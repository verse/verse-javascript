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

    var commands, routines, tag, getTagSetCommons, getTagSetUint8, getTagSetUint16,
        getTagSetUint32;

    /*
    * common function for all tagSet commands 
    */

    getTagSetCommons = function getTagSetCommons(opCode, receivedView, bufferPosition) {
        return {
            CMD: commands[opCode],
            SHARE: receivedView.getUint8(bufferPosition + 2),
            NODE_ID: receivedView.getUint32(bufferPosition + 3),
            TAG_GROUP_ID: receivedView.getUint16(bufferPosition + 7),
            TAG_ID: receivedView.getUint16(bufferPosition + 9),
            VALUES: []
        };
    };

    /*
    * common function for all SetUint8 opCodes
    * @param opCode int from interval 70 - 73
    */

    getTagSetUint8 = function getTagSetUint8(opCode, receivedView, bufferPosition) {
        
        var result = getTagSetCommons(opCode, receivedView, bufferPosition);

        result.VALUES[0] = receivedView.getUint8(bufferPosition + 11);

        if (opCode > 70) {
            result.VALUES[1] = receivedView.getUint8(bufferPosition + 12);   
        }

        if (opCode > 71) {
            result.VALUES[2] = receivedView.getUint8(bufferPosition + 13);   
        }

        if (opCode > 72) {
            result.VALUES[3] = receivedView.getUint8(bufferPosition + 14);   
        }

        return result;
    };

    /*
    * common function for all SetUint16 opCodes
    * @param opCode int from interval 74 - 77
    */

    getTagSetUint16 = function getTagSetUint16(opCode, receivedView, bufferPosition) {
        var result = getTagSetCommons(opCode, receivedView, bufferPosition);

        result.VALUES[0] = receivedView.getUint16(bufferPosition + 11);

        if (opCode > 74) {
            result.VALUES[1] = receivedView.getUint16(bufferPosition + 13);   
        }

        if (opCode > 75) {
            result.VALUES[2] = receivedView.getUint16(bufferPosition + 15);   
        }

        if (opCode > 76) {
            result.VALUES[3] = receivedView.getUint16(bufferPosition + 17);   
        }

        return result;
    };

    /*
    * common function for all SetUint16 opCodes
    * @param opCode int from interval 78 - 81
    */

    getTagSetUint32 = function getTagSetUint32(opCode, receivedView, bufferPosition) {
        var result = getTagSetCommons(opCode, receivedView, bufferPosition);

        result.VALUES[0] = receivedView.getUint32(bufferPosition + 11);

        if (opCode > 78) {
            result.VALUES[1] = receivedView.getUint32(bufferPosition + 15);   
        }

        if (opCode > 79) {
            result.VALUES[2] = receivedView.getUint32(bufferPosition + 19);   
        }

        if (opCode > 80) {
            result.VALUES[3] = receivedView.getUint32(bufferPosition + 23);   
        }

        return result;
    };


    //command codes = opCodes
    commands = {
        68: 'TAG_CREATE',
        69: 'TAG_DESTROY',
        70: 'TAG_SET_UINT8',
        71: 'TAG_SET_UINT8',
        72: 'TAG_SET_UINT8',
        73: 'TAG_SET_UINT8',
        74: 'TAG_SET_UINT16',
        75: 'TAG_SET_UINT16',
        76: 'TAG_SET_UINT16',
        77: 'TAG_SET_UINT16',
        78: 'TAG_SET_UINT32',
        79: 'TAG_SET_UINT32',
        80: 'TAG_SET_UINT32',
        81: 'TAG_SET_UINT32'
    };

    /*
     * routines - parsing functions for node commands from server
     */

    routines = {
        68: function getTagCreate(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                NODE_ID: receivedView.getUint32(bufferPosition + 3),
                TAG_GROUP_ID: receivedView.getUint16(bufferPosition + 7),
                TAG_ID: receivedView.getUint16(bufferPosition + 9),
                DATA_TYPE: receivedView.getUint8(bufferPosition + 11),
                COUNT: receivedView.getUint8(bufferPosition + 12),
                CUSTOM_TYPE: receivedView.getUint16(bufferPosition + 13)
            };
        },
        69: function getTagDestroy(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                NODE_ID: receivedView.getUint32(bufferPosition + 3),
                TAG_GROUP_ID: receivedView.getUint16(bufferPosition + 7),
                TAG_ID: receivedView.getUint16(bufferPosition + 9)
            };
        },
        70: getTagSetUint8,
        71: getTagSetUint8,
        72: getTagSetUint8,
        73: getTagSetUint8,
        74: getTagSetUint16,
        75: getTagSetUint16,
        76: getTagSetUint16,
        77: getTagSetUint16,
        78: getTagSetUint32,
        79: getTagSetUint32,
        80: getTagSetUint32,
        81: getTagSetUint32

    };

    tag = {


        /*
         * parse received buffer for tag command VALUES
         */

        getTagValues: function getTagValues(opCode, receivedView, bufferPosition, length) {
            var result = routines[opCode](opCode, receivedView, bufferPosition, length);
            return result;
        }

    };

    return tag;

});
