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

define(['message'], function(message) {
    'use strict';

    var node, commands, routines;

    //command codes = opCodes
    commands = {
        32: 'NODE_CREATE',
        33: 'NODE_DESTROY',
        34: 'NODE_SUBSCRIBE',
        35: 'NODE_UNSUBSCRIBE',
        37: 'NODE_LINK',
        38: 'NODE_PERMISIONS',
        39: 'NODE_UMASK',
        40: 'NODE_OWNER',
        41: 'NODE_LOCK',
        42: 'NODE_UNLOCK',
        43: 'NODE_PRIORITY'
    };

    /*
     * routines - parsing functions for node commands from server
     */

    routines = {
        32: function getNodeCreate(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                USER_ID: receivedView.getUint16(bufferPosition + 3),
                PARENT_ID: receivedView.getUint32(bufferPosition + 5),
                NODE_ID: receivedView.getUint32(bufferPosition + 9),
                CUSTOM_TYPE: receivedView.getUint16(bufferPosition + 13)
            };
        },
        33: function getNodeDestroy(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                NODE_ID: receivedView.getUint32(bufferPosition + 3)
            };
        },
        34: function getNodeSubscribe(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                NODE_ID: receivedView.getUint32(bufferPosition + 2),
                VERSION: receivedView.getUint32(bufferPosition + 6),
                CRC32: receivedView.getUint32(bufferPosition + 10)
            };
        },
        35: function getNodeUnsubscribe(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                NODE_ID: receivedView.getUint32(bufferPosition + 2),
                VERSION: receivedView.getUint32(bufferPosition + 6),
                CRC32: receivedView.getUint32(bufferPosition + 10)
            };
        },
        37: function getNodeLink(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                PARENT_ID: receivedView.getUint32(bufferPosition + 3),
                CHILD_ID: receivedView.getUint32(bufferPosition + 7)
            };
        },
        38: function getNodePermissions(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                USER_ID: receivedView.getUint16(bufferPosition + 3),
                PERMISSIONS: receivedView.getUint8(bufferPosition + 5),
                NODE_ID: receivedView.getUint32(bufferPosition + 6)
            };
        },
        39: function getNodeUmask(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                PERMISSIONS: receivedView.getUint8(bufferPosition + 2)
            };
        },
        40: function getNodeOwner(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                USER_ID: receivedView.getUint16(bufferPosition + 3),
                NODE_ID: receivedView.getUint32(bufferPosition + 5)
            };
        },
        41: function getNodeLock(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                AVATAR_ID: receivedView.getUint32(bufferPosition + 3),
                NODE_ID: receivedView.getUint32(bufferPosition + 7)
            };
        },
        42: function getNodeUnlock(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                AVATAR_ID: receivedView.getUint32(bufferPosition + 3),
                NODE_ID: receivedView.getUint32(bufferPosition + 7)
            };
        }

    };

    node = {

        /*
         * subscribe node commad
         * @param id - node id
         */
        subscribe: function(id) {
            var msg, view;
            msg = message.template(14, 34);
            view = new DataView(msg);
            view.setUint32(2, id);
            view.setUint32(6, 0);
            view.setUint32(10, 0);
            return msg;
        },

        getNodeValues: function getNodeValues(opCode, receivedView, bufferPosition, length) {
            var result = routines[opCode](opCode, receivedView, bufferPosition, length);
            return result;


        }





    };

    return node;

});
