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

    var commands, routines, layer, getLayerCreateCommons, getLayerSetUint8, getLayerSetUint16,
        getLayerSetUint32, getLayerSetFloat32, getLayerSetFloat64,
        getLayerCmdCommons, getLayerSubUnsub;

    /*
     * common function for layer Create and Destroy commands
     */

    getLayerCreateCommons = function getLayerCreateCommons(opCode, receivedView, bufferPosition) {
        return {
            CMD: commands[opCode],
            SHARE: receivedView.getUint8(bufferPosition + 2),
            NODE_ID: receivedView.getUint32(bufferPosition + 3),
            PARENT_LAYER_ID: receivedView.getUint16(bufferPosition + 7),
            LAYER_ID: receivedView.getUint16(bufferPosition + 9)
        };
    };


    /*
     * common parsing function for most of layer commands
     */

    getLayerCmdCommons = function getLayerCmdCommons(opCode, receivedView, bufferPosition) {
        return {
            CMD: commands[opCode],
            SHARE: receivedView.getUint8(bufferPosition + 2),
            NODE_ID: receivedView.getUint32(bufferPosition + 3),
            LAYER_ID: receivedView.getUint16(bufferPosition + 7)
        };
    };



    /*
     * common function for all SetUint8 opCodes
     * @param opCode int from interval 133 - 136
     */

    getLayerSetUint8 = function getLayerSetUint8(opCode, receivedView, bufferPosition) {

        var result = getLayerCmdCommons(opCode, receivedView, bufferPosition);

        result.ITEM_ID = receivedView.getUint32(bufferPosition + 9);
        result.VALUES = [];
        result.VALUES[0] = receivedView.getUint8(bufferPosition + 13);

        if (opCode > 133) {
            result.VALUES[1] = receivedView.getUint8(bufferPosition + 14);
        }

        if (opCode > 134) {
            result.VALUES[2] = receivedView.getUint8(bufferPosition + 15);
        }

        if (opCode > 135) {
            result.VALUES[3] = receivedView.getUint8(bufferPosition + 16);
        }

        return result;
    };

    /*
     * common function for all SetUint16 opCodes
     * @param opCode int from interval 137 - 140
     */

    getLayerSetUint16 = function getLayerSetUint16(opCode, receivedView, bufferPosition) {
        var result = getLayerCmdCommons(opCode, receivedView, bufferPosition);

        result.ITEM_ID = receivedView.getUint32(bufferPosition + 9);
        result.VALUES = [];
        result.VALUES[0] = receivedView.getUint16(bufferPosition + 13);

        if (opCode > 137) {
            result.VALUES[1] = receivedView.getUint16(bufferPosition + 15);
        }

        if (opCode > 138) {
            result.VALUES[2] = receivedView.getUint16(bufferPosition + 17);
        }

        if (opCode > 139) {
            result.VALUES[3] = receivedView.getUint16(bufferPosition + 19);
        }

        return result;
    };

    /*
     * common function for all SetUint32 opCodes
     * @param opCode int from interval 141 - 144
     */

    getLayerSetUint32 = function getLayerSetUint32(opCode, receivedView, bufferPosition) {
        var result = getLayerCmdCommons(opCode, receivedView, bufferPosition);

        result.ITEM_ID = receivedView.getUint32(bufferPosition + 9);
        result.VALUES = [];
        result.VALUES[0] = receivedView.getUint32(bufferPosition + 13);

        if (opCode > 141) {
            result.VALUES[1] = receivedView.getUint32(bufferPosition + 17);
        }

        if (opCode > 142) {
            result.VALUES[2] = receivedView.getUint32(bufferPosition + 21);
        }

        if (opCode > 143) {
            result.VALUES[3] = receivedView.getUint32(bufferPosition + 25);
        }

        return result;
    };

    /*
     * common function for all SetReal32 opCodes
     * @param opCode int from interval 153 - 156
     */

    getLayerSetFloat32 = function getLayerSetFloat32(opCode, receivedView, bufferPosition) {
         var result = getLayerCmdCommons(opCode, receivedView, bufferPosition);

        result.ITEM_ID = receivedView.getUint32(bufferPosition + 9);
        result.VALUES = [];
        result.VALUES[0] = receivedView.getFloat32(bufferPosition + 13);

        if (opCode > 153) {
            result.VALUES[1] = receivedView.getFloat32(bufferPosition + 17);
        }

        if (opCode > 154) {
            result.VALUES[2] = receivedView.getFloat32(bufferPosition + 21);
        }

        if (opCode > 155) {
            result.VALUES[3] = receivedView.getFloat32(bufferPosition + 25);
        }

        return result;
    };

    /*
     * common function for all SetReal64 opCodes
     * @param opCode int from interval 157 - 160
     */

    getLayerSetFloat64 = function getLayerSetFloat64(opCode, receivedView, bufferPosition) {
         var result = getLayerCmdCommons(opCode, receivedView, bufferPosition);

        result.ITEM_ID = receivedView.getUint32(bufferPosition + 9);
        result.VALUES = [];
        result.VALUES[0] = receivedView.getFloat64(bufferPosition + 13);

        if (opCode > 157) {
            result.VALUES[1] = receivedView.getFloat64(bufferPosition + 21);
        }

        if (opCode > 158) {
            result.VALUES[2] = receivedView.getFloat64(bufferPosition + 29);
        }

        if (opCode > 159) {
            result.VALUES[3] = receivedView.getFloat64(bufferPosition + 37);
        }

        return result;
    };

     /*
     * common function for Subscribe and UnSubscribe commands
     * @param opCode int from interval 130 - 131
     */

    getLayerSubUnsub = function getLayerSubUnsub(opCode, receivedView, bufferPosition) {
        var result;
        result = getLayerCmdCommons(opCode, receivedView, bufferPosition);
        result.VERSION = receivedView.getUint32(bufferPosition + 9);
        result.CRC32 = receivedView.getUint32(bufferPosition + 13);
        return result;
    };


    //command codes = opCodes
    commands = {
        128: 'LAYER_CREATE',
        129: 'LAYER_DESTROY',
        130: 'LAYER_SUBSCRIBE',
        131: 'LAYER_UNSUBSCRIBE',
        133: 'LAYER_SET_UINT8',
        134: 'LAYER_SET_UINT8',
        135: 'LAYER_SET_UINT8',
        136: 'LAYER_SET_UINT8',
        137: 'LAYER_SET_UINT16',
        138: 'LAYER_SET_UINT16',
        139: 'LAYER_SET_UINT16',
        140: 'LAYER_SET_UINT16',
        141: 'LAYER_SET_UINT32',
        142: 'LAYER_SET_UINT32',
        143: 'LAYER_SET_UINT32',
        144: 'LAYER_SET_UINT32',
        153: 'LAYER_SET_REAL32',
        154: 'LAYER_SET_REAL32',
        155: 'LAYER_SET_REAL32',
        156: 'LAYER_SET_REAL32',
        157: 'LAYER_SET_REAL64',
        158: 'LAYER_SET_REAL64',
        159: 'LAYER_SET_REAL64',
        160: 'LAYER_SET_REAL64',
        161: 'LAYER_UNSET_DATA'
        
    };

    /*
     * routines - parsing functions for tag commands from server
     */

    routines = {
        128: function getLayerCreate(opCode, receivedView, bufferPosition) {
            var result;
            result = getLayerCreateCommons(opCode, receivedView, bufferPosition);
            result.DATA_TYPE = receivedView.getUint8(bufferPosition + 11);
            result.COUNT = receivedView.getUint8(bufferPosition + 12);
            result.CUSTOM_TYPE = receivedView.getUint16(bufferPosition + 13);
            return result;

        },
        129: function getLayerDestroy(opCode, receivedView, bufferPosition) {
            var result;
            result = getLayerCreateCommons(opCode, receivedView, bufferPosition);

            return result;
        },
        130: getLayerSubUnsub,
        131: getLayerSubUnsub,
        133: getLayerSetUint8,
        134: getLayerSetUint8,
        135: getLayerSetUint8,
        136: getLayerSetUint8,
        137: getLayerSetUint16,
        138: getLayerSetUint16,
        139: getLayerSetUint16,
        140: getLayerSetUint16,
        141: getLayerSetUint32,
        142: getLayerSetUint32,
        143: getLayerSetUint32,
        144: getLayerSetUint32,
        153: getLayerSetFloat32,
        154: getLayerSetFloat32,
        155: getLayerSetFloat32,
        156: getLayerSetFloat32,
        157: getLayerSetFloat64,
        158: getLayerSetFloat64,
        159: getLayerSetFloat64,
        160: getLayerSetFloat64
        

    };

    layer = {


        /*
         * parse received buffer for tag command VALUES
         */

        getLayerValues: function getLayerValues(opCode, receivedView, bufferPosition, length) {
            var result = routines[opCode](opCode, receivedView, bufferPosition, length);
            return result;
        }

    };

    return layer;

});
