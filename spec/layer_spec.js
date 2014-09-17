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

    describe("Tag command test suite", function() {
        var view, messageLen, mockBuffer, mockView, result, opCode;

      

        describe("got layerCreate from server", function() {
            beforeEach(function() {

                opCode = 128;
                messageLen = 15;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //tagCreate command
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

        describe("got layerSubscribe from server", function() {
            beforeEach(function() {

                opCode = 130;
                messageLen = 17;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //tagCreate command
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
        
    });


});
