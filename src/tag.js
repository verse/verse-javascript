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

define(['Int64', 'command'], function(Int64, command) {
    'use strict';

    var commands, get_routines, set_routines, data_types, data_type_len, op_codes, tag,
        getTagSetCommons, getTagSetUint8, getTagSetUint16,
        getTagSetUint32, getTagSetUint64, getTagSetFloat16,
        getTagSetFloat32, getTagSetFloat64, getTagSetString8;

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

        /* istanbul ignore else  */
        if (opCode > 70) {
            result.VALUES[1] = receivedView.getUint8(bufferPosition + 12);   
        }

        /* istanbul ignore else  */
        if (opCode > 71) {
            result.VALUES[2] = receivedView.getUint8(bufferPosition + 13);   
        }

        /* istanbul ignore else  */
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

        /* istanbul ignore else  */
        if (opCode > 74) {
            result.VALUES[1] = receivedView.getUint16(bufferPosition + 13);   
        }

        /* istanbul ignore else  */
        if (opCode > 75) {
            result.VALUES[2] = receivedView.getUint16(bufferPosition + 15);   
        }

        /* istanbul ignore else  */
        if (opCode > 76) {
            result.VALUES[3] = receivedView.getUint16(bufferPosition + 17);   
        }

        return result;
    };

    /*
    * common function for all SetUint32 opCodes
    * @param opCode int from interval 78 - 81
    */

    getTagSetUint32 = function getTagSetUint32(opCode, receivedView, bufferPosition) {
        var result = getTagSetCommons(opCode, receivedView, bufferPosition);

        result.VALUES[0] = receivedView.getUint32(bufferPosition + 11);

        /* istanbul ignore else  */
        if (opCode > 78) {
            result.VALUES[1] = receivedView.getUint32(bufferPosition + 15);   
        }

        /* istanbul ignore else  */
        if (opCode > 79) {
            result.VALUES[2] = receivedView.getUint32(bufferPosition + 19);   
        }

        /* istanbul ignore else  */
        if (opCode > 80) {
            result.VALUES[3] = receivedView.getUint32(bufferPosition + 23);   
        }

        return result;
    };

    /*
    * common function for all SetUint64 opCodes
    * WARNING > conversion by valueOf fails if the number is bigger than 2^53
    * @param opCode int from interval 82 - 85
    *
    */
    getTagSetUint64 = function getTagSetUint64(opCode, receivedView, bufferPosition) {
        var result, hi, lo, bigNumber;

        result = getTagSetCommons(opCode, receivedView, bufferPosition);

        lo = receivedView.getUint32(bufferPosition + 11);
        hi = receivedView.getUint32(bufferPosition + 15); 
        bigNumber = new Int64(hi, lo);
        result.VALUES[0] = bigNumber.valueOf();

        /* istanbul ignore else  */
        if (opCode > 82) {
            lo = receivedView.getUint32(bufferPosition + 19);
            hi = receivedView.getUint32(bufferPosition + 23); 
            bigNumber = new Int64(hi, lo);
            result.VALUES[1] = bigNumber.valueOf();
        }

        /* istanbul ignore else  */
        if (opCode > 83) {
            lo = receivedView.getUint32(bufferPosition + 27);
            hi = receivedView.getUint32(bufferPosition + 31); 
            bigNumber = new Int64(hi, lo);
            result.VALUES[2] = bigNumber.valueOf();
        }

        /* istanbul ignore else  */    
        if (opCode > 84) {
            lo = receivedView.getUint32(bufferPosition + 35);
            hi = receivedView.getUint32(bufferPosition + 39); 
            bigNumber = new Int64(hi, lo);
            result.VALUES[3] = bigNumber.valueOf();
        }

        return result;
    };

    /*
    * common function for all SetReal32 opCodes
    * @param opCode int from interval 90 - 93
    */
    /* istanbul ignore next */
    getTagSetFloat16 = function getTagSetFloat16(opCode, receivedView, bufferPosition) {
        var result = getTagSetCommons(opCode, receivedView, bufferPosition);

        result.VALUES[0] = 'Float16 not supported in JS';

        return result;
    };

    /*
    * common function for all SetReal32 opCodes
    * @param opCode int from interval 90 - 93
    */
    getTagSetFloat32 = function getTagSetFloat32(opCode, receivedView, bufferPosition) {
        var result = getTagSetCommons(opCode, receivedView, bufferPosition);

        result.VALUES[0] = receivedView.getFloat32(bufferPosition + 11);

        /* istanbul ignore else  */
        if (opCode > 90) {
            result.VALUES[1] = receivedView.getFloat32(bufferPosition + 15);   
        }

        /* istanbul ignore else  */
        if (opCode > 91) {
            result.VALUES[2] = receivedView.getFloat32(bufferPosition + 19);   
        }

        /* istanbul ignore else  */
        if (opCode > 92) {
            result.VALUES[3] = receivedView.getFloat32(bufferPosition + 23);   
        }

        return result;
    };

    /*
    * common function for all SetReal64 opCodes
    * @param opCode int from interval 94 - 97
    */
    getTagSetFloat64 = function getTagSetFloat64(opCode, receivedView, bufferPosition) {
        var result = getTagSetCommons(opCode, receivedView, bufferPosition);

        result.VALUES[0] = receivedView.getFloat64(bufferPosition + 11);

        /* istanbul ignore else  */
        if (opCode > 94) {
            result.VALUES[1] = receivedView.getFloat64(bufferPosition + 19);   
        }

        /* istanbul ignore else  */
        if (opCode > 95) {
            result.VALUES[2] = receivedView.getFloat64(bufferPosition + 27);   
        }

        /* istanbul ignore else  */
        if (opCode > 96) {
            result.VALUES[3] = receivedView.getFloat64(bufferPosition + 35);   
        }

        return result;
    };

    /*
    * common function for all SetReal64 opCodes
    * @param opCode int from interval 94 - 97
    */
    getTagSetString8 = function getTagSetString8(opCode, receivedView, bufferPosition) {
        var i, strLength, result;

        result = getTagSetCommons(opCode, receivedView, bufferPosition);
        delete result.VALUES;
        result.VALUE = '';

        strLength = receivedView.getUint8(bufferPosition + 11);
        
        for (i = 0; i < strLength; i++) {
            result.VALUE += String.fromCharCode(receivedView.getUint8(bufferPosition + 12 + i));
        
        }
        
        return result;
    };


    // Command codes = opCodes
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
        81: 'TAG_SET_UINT32',
        82: 'TAG_SET_UINT64',
        83: 'TAG_SET_UINT64',
        84: 'TAG_SET_UINT64',
        85: 'TAG_SET_UINT64',
        86: 'TAG_SET_REAL16',
        87: 'TAG_SET_REAL16',
        88: 'TAG_SET_REAL16',
        89: 'TAG_SET_REAL16',
        90: 'TAG_SET_REAL32',
        91: 'TAG_SET_REAL32',
        92: 'TAG_SET_REAL32',
        93: 'TAG_SET_REAL32',
        94: 'TAG_SET_REAL64',
        95: 'TAG_SET_REAL64',
        96: 'TAG_SET_REAL64',
        97: 'TAG_SET_REAL64',
        98: 'TAG_SET_STRING8'
    };


    /*
     * get_routines - parsing functions for tag commands from server
     */
    get_routines = {
        68: function getTagCreate(opCode, receivedView, bufferPosition) {
            var result;
            result = getTagSetCommons(opCode, receivedView, bufferPosition);
            delete result.VALUES;  
            result.DATA_TYPE = receivedView.getUint8(bufferPosition + 11);
            result.COUNT = receivedView.getUint8(bufferPosition + 12);
            result.CUSTOM_TYPE = receivedView.getUint16(bufferPosition + 13);
            return result;
            
        },
        69: function getTagDestroy(opCode, receivedView, bufferPosition) {
            var result;
            result = getTagSetCommons(opCode, receivedView, bufferPosition);
            delete result.VALUES;    

            return result;
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
        81: getTagSetUint32,
        82: getTagSetUint64,
        83: getTagSetUint64,
        84: getTagSetUint64,
        85: getTagSetUint64,
        86: getTagSetFloat16,
        87: getTagSetFloat16,
        88: getTagSetFloat16,
        89: getTagSetFloat16,
        90: getTagSetFloat32,
        91: getTagSetFloat32,
        92: getTagSetFloat32,
        93: getTagSetFloat32,
        94: getTagSetFloat64,
        95: getTagSetFloat64,
        96: getTagSetFloat64,
        97: getTagSetFloat64,
        98: getTagSetString8
    };

    /*
     * set_routines - setting values of tags
     */
    set_routines = {
        'UINT8': function setTagSetUint8(view, values) {
            for (var i = 0; i < values.length; i++) {
                view.setUint8(11 + i, values[i]);
            }
        },
        'UINT16': function setTagSetUint16(view, values) {
            for (var i = 0; i < values.length; i++) {
                view.setUint16(11 + 2 * i, values[i]);
            }
        },
        'UINT32': function setTagSetUint32(view, values) {
            for (var i = 0; i < values.length; i++) {
                view.setUint32(11 + 4 * i, values[i]);
            }
        },
        'UINT64': function setTagSetUint64(view, values) {
            for (var i = 0; i < values.length; i++) {
                view.setUint16(11 + 8 * i, values[i]);
            }
        },
        'REAL16': null,
        'REAL32': function setTagSetReal32(view, values) {
            for (var i = 0; i < values.length; i++) {
                view.setFloat32(11 + 4 * i, values[i]);
            }
        },
        'REAL64': function setTagSetReal64(view, values) {
            for (var i = 0; i < values.length; i++) {
                view.setFloat64(11 + 4 * i, values[i]);
            }
        },
        'STRING8': function setTagSetString8(view, values) {
            var n;
            // Encode length of the string
            view.setUint8(11, values[0].length);
            for (var i = 0; i < values[0].length; i++) {
                n = values[0].charCodeAt(i);
                if (n >= 0 && n < 128) {
                    view.setUint8(12 + i, n);
                }
                // TODO: encode properly other unicode values
            }
        }
    };

    /*
     * allowed names of tag data types
     */
    data_types = {
        'UINT8': 1,
        'UINT16': 2,
        'UINT32': 3,
        'UINT64': 4,
        'REAL16': 5,
        'REAL32': 6,
        'REAL64': 7,
        'STRING8': 8
    };

    /*
     * data types length in memory
     */
    data_type_len = {
        'UINT8': 1,
        'UINT16': 2,
        'UINT32': 4,
        'UINT64': 8,
        'REAL16': 2,
        'REAL32': 4,
        'REAL64': 8
    };

    /*
     * basic OpCodes (with one value) for data types
     */
    op_codes = {
        'UINT8': 70,
        'UINT16': 74,
        'UINT32': 78,
        'UINT64': 82,
        'REAL16': 86,
        'REAL32': 90,
        'REAL64': 94
    };

    tag = {

        /*
         * parse received buffer for tag command VALUES
         */
        getTagValues: function getTagValues(opCode, receivedView, bufferPosition, length) {
            var result = get_routines[opCode](opCode, receivedView, bufferPosition, length);
            return result;
        },

        /*
         * create new tag at verse server
         */
        create: function(nodeId, tagGroupId, dataType, count, customType) {
            var cmd, view;
            cmd = command.template(15, 68);
            view = new DataView(cmd);
            view.setUint8(2, 0); //share
            view.setUint32(3, nodeId);
            view.setUint16(7, tagGroupId);
            view.setUint16(9, 65535); // tag ID will be defined by server
            if ( data_types.hasOwnProperty(dataType) ) {
                view.setUint8(11, data_types[dataType]);
            } else {
                return null;
            }
            view.setUint8(12, count);
            view.setUint16(13, customType);
            return cmd;
        },

        /*
         * create new tag at verse server
         */
        destroy: function(nodeId, tagGroupId, tagId) {
            var cmd, view;
            cmd = command.template(11, 69);
            view = new DataView(cmd);
            view.setUint8(2, 0); //share
            view.setUint32(3, nodeId);
            view.setUint16(7, tagGroupId);
            view.setUint16(9, tagId);
            return cmd;
        },

        /*
         * set/change value of tag at verse server
         */
         set: function(nodeId, tagGroupId, tagId, dataType, values) {
            var cmd, view, cmd_len;
            // Compute length of the command and create almost empty command
            if ( data_types.hasOwnProperty(dataType) ) {
                if (dataType === 'STRING8') {
                    // Tag can contain only one string!
                    cmd_len = 11 + 1 + values[0].length;
                    cmd = command.template(cmd_len, 98);
                } else {
                    cmd_len = 11 + ( values.length * data_type_len[dataType] );
                    cmd = command.template(cmd_len, op_codes[dataType] + values.length - 1);
                }
            } else {
                return null;
            }
            view = new DataView(cmd);
            view.setUint8(2, 0); //share
            view.setUint32(3, nodeId);
            view.setUint16(7, tagGroupId);
            view.setUint16(9, tagId);
            set_routines[dataType](view, values);

            return cmd;
         }
    };

    return tag;

});
