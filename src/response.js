/*
 * Verse Websocket Asynchronous Module
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2014 Jiri Vrany, Jiri Hnidek
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

/* globals define */

define(['negotiation', 'node', 'taggroup', 'tag', 'layer', 'user'], function(negotiation, node, tagGroup, tag, layer, user) {
    'use strict';

    var checkOpCode = function checkOpCode(opCode, receivedView, bufferPosition) {

        var length, feature, cmdValues, opCodes;


        opCodes = {
            3: 'CHANGE_L',
            4: 'CHANGE_R',
            5: 'CONFIRM_L',
            6: 'CONFIRM_R',
            7: 'USER_AUTH_REQUEST',
            8: 'USER_AUTH_FAILURE',
            9: 'USER_AUTH_SUCCESS'
        };

        if (opCode === 8) {
            /* Is it command usr_auth_fail */
            var method = receivedView.getUint8(bufferPosition + 1);

            /* istanbul ignore else */
            if (method === 2) {
                /* Password method */
                return {
                    'group': 'NEGO',
                    'cmd': {
                        CMD: 'AUTH_PASSWD'
                    }
                };
            }

        } else if (opCode === 9) {
            /*user authorized*/
            return {
                'group': 'NEGO',
                'cmd': user.getUserInfo(receivedView, bufferPosition - 1)
            };

        } else if (opCode < 7) { //negotiation commands
            length = receivedView.getUint8(bufferPosition);
            feature = receivedView.getUint8(bufferPosition + 1);

            cmdValues = negotiation.getFeatureValues(feature, receivedView, bufferPosition, length);
            return {
                'group': 'NEGO',
                'cmd': {
                    CMD: opCodes[opCode],
                    FEATURE: cmdValues.FEATURE,
                    VALUE: cmdValues.VALUE
                }
            };
        } else if (opCode > 31 && opCode < 44) { //node commands
            length = receivedView.getUint8(bufferPosition);
            cmdValues = node.getNodeValues(opCode, receivedView, bufferPosition - 1, length);

            return {
                'group': 'NODE',
                'cmd': cmdValues
            };

        } else if (opCode > 63 && opCode < 68) { //TagGroup commands
            length = receivedView.getUint8(bufferPosition);
            cmdValues = tagGroup.getTagGroupValues(opCode, receivedView, bufferPosition - 1, length);

            return {
                'group': 'TAG_GROUP',
                'cmd': cmdValues
            };

        } else if (opCode > 67 && opCode < 99) { //Tag commands
            length = receivedView.getUint8(bufferPosition);
            cmdValues = tag.getTagValues(opCode, receivedView, bufferPosition - 1, length);

            return {
                'group': 'TAG',
                'cmd': cmdValues
            };

        } else if (opCode > 127 && opCode < 162) { //Layer commands
            length = receivedView.getUint8(bufferPosition);
            cmdValues = layer.getLayerValues(opCode, receivedView, bufferPosition - 1, length);

            return {
                'group': 'LAYER',
                'cmd': cmdValues
            };

        } else {
            return {
                'group': 'NEGO',
                'cmd': {
                    CMD: opCode,
                    MESSAGE: '@TODO - opCode not implemented'
                }
            };
        }

    };




    /*
     * Response module - for parsing server response messages
     */


    var response = {

        /*
         * Check version of protocol in message header
         */
        checkHeader: function(buffer) {

            var receivedView = new DataView(buffer);
            var bufferPosition = 0;

            /* Parse header */
            var version = receivedView.getUint8(bufferPosition) >> 4;
            bufferPosition += 2;

            if (version !== 1) {
                return false;
            } else {
                return true;
            }
        },

        /*
         * Parse received message
         * @return verse command object
         */
        parse: function(buffer) {
            var opCode, cmdLen, result, payload;
            var receivedView = new DataView(buffer);
            var bufferPosition = 2;

            var message_len = receivedView.getUint16(bufferPosition);
            bufferPosition += 2;

            result = {
                TAG: [],
                NODE: [],
                LAYER: [],
                TAG_GROUP: [],
                NEGO: []
            };
            while (bufferPosition < message_len - 1) {
                opCode = receivedView.getUint8(bufferPosition);

                bufferPosition += 1;
                cmdLen = receivedView.getUint8(bufferPosition);

                if (cmdLen > 2) {
                    payload = checkOpCode(opCode, receivedView, bufferPosition);
                    result[payload.group].push(payload.cmd);
                } else {
                    result.NEGO.push({
                        CMD: 'USER_AUTH_FAILURE'
                    });
                }

                bufferPosition += cmdLen - 1;

            }

            return result;

        }


    };

    return response;

});
