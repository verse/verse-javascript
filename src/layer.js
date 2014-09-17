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

    var commands, routines, tag, getLayerSetCommons, getLayerSetUint8, getLayerSetUint16,
        getLayerSetUint32, getLayerSetFloat32, getLayerSetFloat64, getLayerSetString8;

    /*
    * common function for all tagSet commands 
    */

    getLayerSetCommons = function getLayerSetCommons(opCode, receivedView, bufferPosition) {
        return {
            CMD: commands[opCode],
            SHARE: receivedView.getUint8(bufferPosition + 2),
            NODE_ID: receivedView.getUint32(bufferPosition + 3),
            PARENT_LAYER_ID: receivedView.getUint16(bufferPosition + 7),
            LAYER_ID: receivedView.getUint16(bufferPosition + 9),
            VALUES: []
        };
    };

    /*
    * common function for all SetUint8 opCodes
    * @param opCode int from interval 70 - 73
    */

    getLayerSetUint8 = function getLayerSetUint8(opCode, receivedView, bufferPosition) {
        
        var result = getLayerSetCommons(opCode, receivedView, bufferPosition);

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

    getLayerSetUint16 = function getLayerSetUint16(opCode, receivedView, bufferPosition) {
        var result = getLayerSetCommons(opCode, receivedView, bufferPosition);

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
    * common function for all SetUint32 opCodes
    * @param opCode int from interval 78 - 81
    */

    getLayerSetUint32 = function getLayerSetUint32(opCode, receivedView, bufferPosition) {
        var result = getLayerSetCommons(opCode, receivedView, bufferPosition);

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

    /*
    * common function for all SetReal32 opCodes
    * @param opCode int from interval 90 - 93
    */

    getLayerSetFloat32 = function getLayerSetFloat32(opCode, receivedView, bufferPosition) {
        var result = getLayerSetCommons(opCode, receivedView, bufferPosition);

        result.VALUES[0] = receivedView.getFloat32(bufferPosition + 11);

        if (opCode > 90) {
            result.VALUES[1] = receivedView.getFloat32(bufferPosition + 15);   
        }

        if (opCode > 91) {
            result.VALUES[2] = receivedView.getFloat32(bufferPosition + 19);   
        }

        if (opCode > 92) {
            result.VALUES[3] = receivedView.getFloat32(bufferPosition + 23);   
        }

        return result;
    };

    /*
    * common function for all SetReal64 opCodes
    * @param opCode int from interval 94 - 97
    */

    getLayerSetFloat64 = function getLayerSetFloat64(opCode, receivedView, bufferPosition) {
        var result = getLayerSetCommons(opCode, receivedView, bufferPosition);

        result.VALUES[0] = receivedView.getFloat64(bufferPosition + 11);

        if (opCode > 94) {
            result.VALUES[1] = receivedView.getFloat64(bufferPosition + 19);   
        }

        if (opCode > 95) {
            result.VALUES[2] = receivedView.getFloat64(bufferPosition + 27);   
        }

        if (opCode > 96) {
            result.VALUES[3] = receivedView.getFloat64(bufferPosition + 35);   
        }

        return result;
    };

    /*
    * common function for all SetReal64 opCodes
    * @param opCode int from interval 94 - 97
    */

    getLayerSetString8 = function getLayerSetString8(opCode, receivedView, bufferPosition) {
        var i, strLength, result;

        result = getLayerSetCommons(opCode, receivedView, bufferPosition);
        delete result.VALUES;
        result.VALUE = '';

        strLength = receivedView.getUint8(11);
        for (i = 0; i < strLength; i++) {
            result.VALUE += String.fromCharCode(receivedView.getUint8(bufferPosition + 12 + i));
        }
        
        return result;
    };



    //command codes = opCodes
    commands = {
        128: 'LAYER_CREATE',
        129: 'LAYER_DESTROY'/*,
        
        70: 'LAYER_SET_UINT8',
        71: 'LAYER_SET_UINT8',
        72: 'LAYER_SET_UINT8',
        73: 'LAYER_SET_UINT8',
        74: 'LAYER_SET_UINT16',
        75: 'LAYER_SET_UINT16',
        76: 'LAYER_SET_UINT16',
        77: 'LAYER_SET_UINT16',
        78: 'LAYER_SET_UINT32',
        79: 'LAYER_SET_UINT32',
        80: 'LAYER_SET_UINT32',
        81: 'LAYER_SET_UINT32',
        90: 'LAYER_SET_REAL32',
        91: 'LAYER_SET_REAL32',
        92: 'LAYER_SET_REAL32',
        93: 'LAYER_SET_REAL32',
        94: 'LAYER_SET_REAL64',
        95: 'LAYER_SET_REAL64',
        96: 'LAYER_SET_REAL64',
        97: 'LAYER_SET_REAL64',
        98: 'LAYER_SET_STRING8'
        */
    };

    /*
     * routines - parsing functions for tag commands from server
     */

    routines = {
        128: function getLayerCreate(opCode, receivedView, bufferPosition) {
            var result;
            result = getLayerSetCommons(opCode, receivedView, bufferPosition);
            delete result.VALUES;  
            result.DATA_TYPE = receivedView.getUint8(bufferPosition + 11);
            result.COUNT = receivedView.getUint8(bufferPosition + 12);
            result.CUSTOM_TYPE = receivedView.getUint16(bufferPosition + 13);
            return result;
            
        },
        129: function getLayerDestroy(opCode, receivedView, bufferPosition) {
            var result;
            result = getLayerSetCommons(opCode, receivedView, bufferPosition);
            delete result.VALUES;    

            return result;
        },
        70: getLayerSetUint8,
        71: getLayerSetUint8,
        72: getLayerSetUint8,
        73: getLayerSetUint8,
        74: getLayerSetUint16,
        75: getLayerSetUint16,
        76: getLayerSetUint16,
        77: getLayerSetUint16,
        78: getLayerSetUint32,
        79: getLayerSetUint32,
        80: getLayerSetUint32,
        81: getLayerSetUint32,
        90: getLayerSetFloat32,
        91: getLayerSetFloat32,
        92: getLayerSetFloat32,
        93: getLayerSetFloat32,
        94: getLayerSetFloat64,
        95: getLayerSetFloat64,
        96: getLayerSetFloat64,
        97: getLayerSetFloat64,
        98: getLayerSetString8

    };

    tag = {


        /*
         * parse received buffer for tag command VALUES
         */

        getLayerValues: function getLayerValues(opCode, receivedView, bufferPosition, length) {
            var result = routines[opCode](opCode, receivedView, bufferPosition, length);
            return result;
        }

    };

    return tag;

});
