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

"use strict";

/* globals define, ArrayBuffer */

define(["layer"], function(layer) {

    describe("Layer commands parsing test suite", function() {
        var view, messageLen, mockBuffer, mockView, result, opCode;

      

        describe("got layerCreate from server", function() {
            beforeEach(function() {

                opCode = 128;
                messageLen = 15;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //opCode
                view.setUint8(1, 15); //length
                view.setUint8(2, 0); //share is 0
                view.setUint32(3, 6545); //Node ID
                view.setUint16(7, 68); //Parent Layer ID
                view.setUint16(9, 154); //Layer ID
                view.setUint8(11, 3); //Data Type
                view.setUint8(12, 5); //Count
                view.setUint16(13, 298); //custom type

            });

            it("command should be parsed out as LAYER_CREATE object", function() {

                mockView = new DataView(mockBuffer);
                result = layer.getLayerValues(opCode, mockView, 0, mockBuffer.byteLength);

                expect(result).toEqual({
                    CMD: "LAYER_CREATE",
                    SHARE: 0,
                    NODE_ID: 6545,
                    PARENT_LAYER_ID: 68,
                    LAYER_ID: 154,
                    DATA_TYPE: 3,
                    COUNT: 5,
                    CUSTOM_TYPE: 298
                });
            });
        });

         describe("got layerDestroy from server", function() {
            beforeEach(function() {

                opCode = 129;
                messageLen = 9;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //opCode
                view.setUint8(1, 15); //length
                view.setUint8(2, 0); //share is 0
                view.setUint32(3, 6545); //Node ID
                view.setUint16(7, 154); //Layer ID
                
            });

            it("command should be parsed out as LAYER_DESTROY object", function() {

                mockView = new DataView(mockBuffer);
                result = layer.getLayerValues(opCode, mockView, 0, mockBuffer.byteLength);

                expect(result).toEqual({
                    CMD: "LAYER_DESTROY",
                    SHARE: 0,
                    NODE_ID: 6545,
                    LAYER_ID: 154
                });
            });
        });

        describe("got layerSubscribe from server", function() {
            beforeEach(function() {

                opCode = 130;
                messageLen = 17;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //opCode
                view.setUint8(1, messageLen); //length
                view.setUint8(2, 0); //share is 0
                view.setUint32(3, 6545); //Node ID
                view.setUint16(7, 68); //Layer ID
                view.setUint32(9, 154); //Version
                view.setUint32(13, 298); //CRC32

            });

            it("command should be parsed out as LAYER_SUBSCRIBE object", function() {

                mockView = new DataView(mockBuffer);
                result = layer.getLayerValues(opCode, mockView, 0, mockBuffer.byteLength);

                expect(result).toEqual({
                    CMD: "LAYER_SUBSCRIBE",
                    SHARE: 0,
                    NODE_ID: 6545,
                    LAYER_ID: 68,
                    VERSION: 154,
                    CRC32: 298
                });
            });
        });

        describe("got layerSetUint8 4D from server", function() {
            beforeEach(function() {

                messageLen = 17;
                opCode = 136;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //opCode
                view.setUint8(1, messageLen); //length
                view.setUint8(2, 0); //share is 0
                view.setUint32(3, 6545); //Node ID
                view.setUint16(7, 68); //Layer ID
                view.setUint32(9, 154); // Item ID
                view.setUint8(13, 15); // X Value
                view.setUint8(14, 55); // Y Value
                view.setUint8(15, 6); // Z Value
                view.setUint8(16, 22); // Z Value

            });

            it("command should be parsed out as LAYER_SET_UINT8 object", function() {

                mockView = new DataView(mockBuffer);
                result = layer.getLayerValues(opCode, mockView, 0, mockBuffer.byteLength);

                expect(result).toEqual({
                    CMD: "LAYER_SET_UINT8",
                    SHARE: 0,
                    NODE_ID: 6545,
                    LAYER_ID: 68,
                    ITEM_ID: 154,
                    VALUES: [15, 55, 6, 22]
                });
            });
        });


        describe("got layerSetUint16 4D from server", function() {
            beforeEach(function() {

                messageLen = 21;
                opCode = 140;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //opCode
                view.setUint8(1, messageLen); //length
                view.setUint8(2, 0); //share is 0
                view.setUint32(3, 6545); //Node ID
                view.setUint16(7, 68); //Layer ID
                view.setUint32(9, 154); // Item ID
                view.setUint16(13, 15); // X Value
                view.setUint16(15, 55); // Y Value
                view.setUint16(17, 6); // Z Value
                view.setUint16(19, 16); // 4 Value

            });

            it("command should be parsed out as LAYER_SET_UINT16 object", function() {

                mockView = new DataView(mockBuffer);
                result = layer.getLayerValues(opCode, mockView, 0, mockBuffer.byteLength);

                expect(result).toEqual({
                    CMD: "LAYER_SET_UINT16",
                    SHARE: 0,
                    NODE_ID: 6545,
                    LAYER_ID: 68,
                    ITEM_ID: 154,
                    VALUES: [15, 55, 6, 16]
                });
            });
        });

        describe("got layerSetUint32 4D from server", function() {
            beforeEach(function() {

                messageLen = 29;
                opCode = 144;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //opCode
                view.setUint8(1, messageLen); //length
                view.setUint8(2, 0); //share is 0
                view.setUint32(3, 6545); //Node ID
                view.setUint16(7, 68); //Layer ID
                view.setUint32(9, 154); // Item ID
                view.setUint32(13, 15); // X Value
                view.setUint32(17, 55); // Y Value
                view.setUint32(21, 6); // Z Value
                view.setUint32(25, 16); // 4 Value

            });

            it("command should be parsed out as LAYER_SET_UINT32 object", function() {

                mockView = new DataView(mockBuffer);
                result = layer.getLayerValues(opCode, mockView, 0, mockBuffer.byteLength);

                expect(result).toEqual({
                    CMD: "LAYER_SET_UINT32",
                    SHARE: 0,
                    NODE_ID: 6545,
                    LAYER_ID: 68,
                    ITEM_ID: 154,
                    VALUES: [15, 55, 6, 16]
                });
            });
        });

        describe("got layerSetUint64 4D from server", function() {
            beforeEach(function() {

                messageLen = 46;
                opCode = 148;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //opCode
                view.setUint8(1, messageLen); //length
                view.setUint8(2, 0); //share is 0
                view.setUint32(3, 6545); //Node ID
                view.setUint16(7, 68); //Layer ID
                view.setUint32(9, 154); // Item ID
                view.setUint32(13, 15); // X Value
                view.setUint32(21, 55); // Y Value
                view.setUint32(29, 6); // Z Value
                view.setUint32(37, 16); // 4 Value

            });

            it("command should be parsed out as LAYER_SET_UINT64 object", function() {

                mockView = new DataView(mockBuffer);
                result = layer.getLayerValues(opCode, mockView, 0, mockBuffer.byteLength);

                expect(result).toEqual({
                    CMD: "LAYER_SET_UINT64",
                    SHARE: 0,
                    NODE_ID: 6545,
                    LAYER_ID: 68,
                    ITEM_ID: 154,
                    VALUES: [15, 55, 6, 16]
                });
            });
        });

        describe("got layerSetReal32 4D from server", function() {
            beforeEach(function() {

                opCode = 156;// layerSetReal64 4D command
                messageLen = 29;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //opCode
                view.setUint8(1, messageLen); //length
                view.setUint8(2, 0); //share is 0
                view.setUint32(3, 6545); //Node ID
                view.setUint16(7, 68); //Layer ID
                view.setUint32(9, 154); // Item ID
                view.setFloat32(13, 125.453457876465465463234); // 1 Value
                view.setFloat32(17, 125.453457876465465463234); // 1 Value
                view.setFloat32(21, 125.453457876465465463234); // 1 Value
                view.setFloat32(25, 125.453457876465465463234); // 1 Value


            });

            it("command should be parsed out as LAYER_SET_REAL32 4D object", function() {

                mockView = new DataView(mockBuffer);
                result = layer.getLayerValues(opCode, mockView, 0, mockBuffer.byteLength);

                expect(result.CMD).toEqual("LAYER_SET_REAL32");
            });

            it("lenght of VALUES array should be 4", function() {

                mockView = new DataView(mockBuffer);
                result = layer.getLayerValues(opCode, mockView, 0, mockBuffer.byteLength);

                expect(result.VALUES.length).toEqual(4);
            });

            it("second of VALUES should be close to 125.453457876465465463234", function() {

                mockView = new DataView(mockBuffer);
                result = layer.getLayerValues(opCode, mockView, 0, mockBuffer.byteLength);

                expect(result.VALUES[3]).toBeCloseTo(125.453457876465465463234);
            });

        });

        
        describe("got layerSetReal64 4D from server", function() {
            beforeEach(function() {

                opCode = 160;// layerSetReal64 4D command
                messageLen = 45;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //opCode
                view.setUint8(1, messageLen); //length
                view.setUint8(2, 0); //share is 0
                view.setUint32(3, 6545); //Node ID
                view.setUint16(7, 68); //Layer ID
                view.setUint32(9, 154); // Item ID
                view.setFloat64(13, 125.453457876465465463234); // 1 Value
                view.setFloat64(21, 125.453457876465465463234); // 1 Value
                view.setFloat64(29, 125.453457876465465463234); // 1 Value
                view.setFloat64(37, 125.453457876465465463234); // 1 Value


            });

            it("command should be parsed out as LAYER_SET_REAL64 4D object", function() {

                mockView = new DataView(mockBuffer);
                result = layer.getLayerValues(opCode, mockView, 0, mockBuffer.byteLength);

                expect(result.CMD).toEqual("LAYER_SET_REAL64");
            });

            it("lenght of VALUES array should be 4", function() {

                mockView = new DataView(mockBuffer);
                result = layer.getLayerValues(opCode, mockView, 0, mockBuffer.byteLength);

                expect(result.VALUES.length).toEqual(4);
            });

            it("second of VALUES should be close to 125.453457876465465463234", function() {

                mockView = new DataView(mockBuffer);
                result = layer.getLayerValues(opCode, mockView, 0, mockBuffer.byteLength);

                expect(result.VALUES[3]).toBeCloseTo(125.453457876465465463234);
            });

        });

        
        
    });

    describe("Layer commands send to server test suite", function() {
        var testCommand, view, messageLen, mockBuffer, mockView, result;

        describe("Layer Create command", function() {
            beforeEach(function() {
                // node_id, parent_layer_id, data_type, count, custom_type
                testCommand = layer.create(182, 31, 'UINT32', 2, 315);
                view = new DataView(testCommand);
            });

            it("length of create command should be equal to 15", function() {
                expect(testCommand.byteLength).toEqual(15);
            });

            it("first byte - opcode - should be 128", function() {
                expect(view.getUint8(0)).toEqual(128);
            });

            it("second byte - message length - should be 15", function() {
                expect(view.getUint8(1)).toEqual(15);
            });

            it("third byte - share - should be 0", function() {
                expect(view.getUint8(2)).toEqual(0);
            });

            it("fourth byte node ID should be 182", function() {
                expect(view.getUint32(3)).toEqual(182);
            });

            it("Parent layer ID (byte 8) should be 31", function() {
                expect(view.getUint16(7)).toEqual(31);
            });

            it("Layer ID (byte 10) should be 65535", function() {
                expect(view.getUint16(9)).toEqual(65535);
            });

            it("Data type (byte 12) should be 3", function() {
                expect(view.getUint8(11)).toEqual(3);
            });

            it("Count (byte 13) should be 2", function() {
                expect(view.getUint8(12)).toEqual(2);
            });

            it("Count (byte 14) should be 315", function() {
                expect(view.getUint16(13)).toEqual(315);
            });
        });

        describe("Layer Create command with no parent layer", function() {
            beforeEach(function() {
                // node_id, parent_layer_id, data_type, count, custom_type
                testCommand = layer.create(182, null, 'UINT32', 2, 315);
                view = new DataView(testCommand);
            });

            it("length of create command should be equal to 15", function() {
                expect(testCommand.byteLength).toEqual(15);
            });

            it("first byte - opcode - should be 128", function() {
                expect(view.getUint8(0)).toEqual(128);
            });

            it("second byte - message length - should be 15", function() {
                expect(view.getUint8(1)).toEqual(15);
            });

            it("third byte - share - should be 0", function() {
                expect(view.getUint8(2)).toEqual(0);
            });

            it("fourth byte node ID should be 182", function() {
                expect(view.getUint32(3)).toEqual(182);
            });

            it("Parent layer ID (byte 8) should be 65535", function() {
                expect(view.getUint16(7)).toEqual(65535);
            });

            it("Layer ID (byte 10) should be 65535", function() {
                expect(view.getUint16(9)).toEqual(65535);
            });

            it("Data type (byte 12) should be 3", function() {
                expect(view.getUint8(11)).toEqual(3);
            });

            it("Count (byte 13) should be 2", function() {
                expect(view.getUint8(12)).toEqual(2);
            });

            it("Count (byte 14) should be 315", function() {
                expect(view.getUint16(13)).toEqual(315);
            });
        });

        describe("Wrong Layer Create command", function() {
            it("the command should not be created", function() {
                // String8 is not supported by layers
                testCommand = layer.create(182, 31, 'STRING8', 2, 315);
                expect(testCommand === null);
            });
        });

        describe("Layer destroy command", function() {
            beforeEach(function() {
                testCommand = layer.destroy(183, 32); // node_id, layer_id
                view = new DataView(testCommand);
            });

            it("length of destroy command should be equal to 9", function() {
                expect(testCommand.byteLength).toEqual(9);
            });

            it("first byte - opcode - should be 129", function() {
                expect(view.getUint8(0)).toEqual(129);
            });

            it("second byte - message length - should be 9", function() {
                expect(view.getUint8(1)).toEqual(9);
            });

            it("third byte - share - should be 0", function() {
                expect(view.getUint8(2)).toEqual(0);
            });

            it("fourth byte node ID should be 183", function() {
                expect(view.getUint32(3)).toEqual(183);
            });

            it("Layer ID (byte 8) should be 32", function() {
                expect(view.getUint16(7)).toEqual(32);
            });
        });

        describe("Layer Subscribe command", function() {
            beforeEach(function() {
                testCommand = layer.subscribe(182, 31);
                view = new DataView(testCommand);
            });

            it("length of subscribe command should be equal to 17", function() {
                expect(testCommand.byteLength).toEqual(17);
            });

            it("first byte - opcode - should be 130", function() {
                expect(view.getUint8(0)).toEqual(130);
            });

            it("second byte - message length - should be 17", function() {
                expect(view.getUint8(1)).toEqual(17);
            });

            it("third byte - share - should be 0", function() {
                expect(view.getUint8(2)).toEqual(0);
            });

            it("fourth byte node ID should be 182", function() {
                expect(view.getUint32(3)).toEqual(182);
            });

            it("Layer ID (byte 8) id should be 31", function() {
                expect(view.getUint16(7)).toEqual(31);
            });
        });

        describe("Layer UnSubscribe command", function() {
            beforeEach(function() {
                testCommand = layer.unsubscribe(182, 31);
                view = new DataView(testCommand);
            });

            it("length of the command should be equal to 17", function() {
                expect(testCommand.byteLength).toEqual(17);
            });

            it("first byte - opcode - should be 131", function() {
                expect(view.getUint8(0)).toEqual(131);
            });

            it("second byte - message length - should be 17", function() {
                expect(view.getUint8(1)).toEqual(17);
            });

            it("third byte - share - should be 0", function() {
                expect(view.getUint8(2)).toEqual(0);
            });


            it("fourth byte node ID should be 182", function() {
                expect(view.getUint32(3)).toEqual(182);
            });

            it("Layer ID (byte 8) id should be 31", function() {
                expect(view.getUint16(7)).toEqual(31);
            });

        });

    });


});
