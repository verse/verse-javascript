/*
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

define(['negotiation', 'node'], function(negotiation, node) {
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

        if (opCode === 8) { /* Is it command usr_auth_fail */
            var method = receivedView.getUint8(bufferPosition + 1);
            if (method === 2) { /* Password method */
                return {
                    CMD: 'auth_passwd'
                };
            }

        } else if (opCode === 9) { /*user authorized*/
            var userId = receivedView.getUint16(bufferPosition + 1),
                avatar = receivedView.getUint32(bufferPosition + 3);
            return {
                CMD: 'auth_succ',
                USER_ID: userId,
                AVATAR_ID: avatar
            };

        } else if (opCode < 7) { //negotiation commands
            length = receivedView.getUint8(bufferPosition);
            feature = receivedView.getUint8(bufferPosition + 1);

            cmdValues = negotiation.getFeatureValues(feature, receivedView, bufferPosition, length);
            return {
                CMD: opCodes[opCode],
                FEATURE: cmdValues.FEATURE,
                VALUE: cmdValues.VALUE
            };
        } else if (opCode > 31 && opCode < 44) { //node commands

            console.info(opCode);
            cmdValues = node.getNodeValues(opCode, receivedView, bufferPosition);
            return cmdValues;

        } else {
            return {
                CMD: opCode
            };
        }

    };




    /*
     * Response module - for parsing server response messages
     */


    var response = {
        checkHeader: function(buffer) {
            /* TODO: do communication here :-) */
            var receivedView = new DataView(buffer);
            var bufferPosition = 0;

            /* Parse header */
            var version = receivedView.getUint8(bufferPosition) >> 4;
            bufferPosition += 2;

            if (version !== 1) {
                return false;
            }

            return true;

        },

        parse: function(buffer) {
            var opCode, cmdLen, result;
            var receivedView = new DataView(buffer);
            var bufferPosition = 2;

            var message_len = receivedView.getUint16(bufferPosition);
            bufferPosition += 2;

            result = [];
            while (bufferPosition < message_len - 1) {
                opCode = receivedView.getUint8(bufferPosition);

                bufferPosition += 1;
                cmdLen = receivedView.getUint8(bufferPosition);

                if (cmdLen > 2) {
                    result.push(checkOpCode(opCode, receivedView, bufferPosition));
                } else {
                    /* TODO end connection */
                }

                bufferPosition += cmdLen - 1;

            }

            return result;

        }


    };

    return response;

});
