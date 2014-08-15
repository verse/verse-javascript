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

/* globals ArrayBuffer, define */

define(function() {
    'use strict';

    var node, commands, routines, messageTemplate, getNodeCreate, getNodeDestroy;


    /**
     * Abstract int message array buffer
     * @param opcode int
     * @param length int
     **/

    messageTemplate = function(length, opCode) {
        var buf, view;

        buf = new ArrayBuffer(length);
        view = new DataView(buf);
        /* first byte - op code*/
        view.setUint8(0, opCode);
        /* second byte - message length */
        view.setUint8(1, length);

        return buf;
    };

    //command codes = opCodes
    commands = {
        32: 'NODE_CREATE',
        33: 'NODE_DESTROY',
        34: 'NODE_SUBSCRIBE',
        38: 'NODE_PERMISIONS'
    };

    //routines - parsing functions
    routines = {
        32: function getNodeCreate(opCode, receivedView) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(2),
                USER_ID: receivedView.getUint16(3),
                PARENT_ID: receivedView.getUint32(5),
                NODE_ID: receivedView.getUint32(9),
                CUSTOM_TYPE: receivedView.getUint16(13)
            };
        },
        33: function getNodeDestroy(opCode, receivedView) {
            return {
                CMD: commands[opCode],
                NODE_ID: receivedView.getUint32(3)
            };
        },
        34: function getNodeSubscribe(opCode, receivedView) {
            return {
                CMD: commands[opCode],
                NODE_ID: receivedView.getUint32(2),
                VERSION: receivedView.getUint32(6),
                CRC32: receivedView.getUint32(10)
            };
        },
        38: function getNodePermissions(opCode, receivedView) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(2),
                USER_ID: receivedView.getUint16(3),
                PERMSSIONS: receivedView.getUint8(5),
                NODE_ID: receivedView.getUint32(6)
            };
        }
         
    };


    getNodeCreate =

    node = {

        /*
         * subscribe node commad
         * @param id - node id
         */





        subscribe: function(id) {
            var msg, view;
            msg = messageTemplate(14, 34);
            view = new DataView(msg);
            view.setUint32(3, id);
            view.setUint32(7, 0);
            view.setUint32(10, 0);
            return msg;
        },

        getNodeValues: function getNodeValues(opCode, receivedView) {
            var result = routines[opCode](opCode, receivedView);
            return result;
    
           
        }





    };

    return node;

});
