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

define(["tag"], function(tag) {

    describe("Tag command test suite", function() {
        var testNode, view, messageLen, mockBuffer, mockView, result;

        /*
        describe("received tag group subscribe command", function() {
            beforeEach(function() {
                testNode = tagGroup.subscribe(182, 31);
                view = new DataView(testNode);
            });

            it("length of subscribe command should be equal to 17", function() {
                expect(testNode.byteLength).toEqual(17);
            });

            it("first byte - opcode - should be 66", function() {
                expect(view.getUint8(0)).toEqual(66);
            });

            it("second byte - message length - should be 14 ", function() {
                expect(view.getUint8(1)).toEqual(17);
            });

            it("third byte - share - should be 0 ", function() {
                expect(view.getUint8(2)).toEqual(0);
            });


            it("fourth byte node ID should be 182", function() {
                expect(view.getUint32(3)).toEqual(182);
            });

            it("tagGroup (byte 8) id should be 31", function() {
                expect(view.getUint16(7)).toEqual(31);
            });



        });
        */
    
        describe("got tagCreate from server", function() {
            beforeEach(function() {
                
                messageLen = 15;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, 68); //tagCreate command
                view.setUint8(1, 15); //length
                view.setUint8(2, 0); //share is 0
                view.setUint32(3, 6545); //Node ID
                view.setUint16(7, 68); //TagGroupID
                view.setUint16(9, 154);//TagID
                view.setUint8(11, 3);//Data Type
                view.setUint8(12, 5);//Count
                view.setUint16(13, 298);//custom type

            });

            it("command should be parsed out as TAG_CREATE, NODE_ID = 111 object", function() {
                
                mockView = new DataView(mockBuffer);
                result = tag.getTagValues(68, mockView, 0, mockBuffer.byteLength);
                
                expect(result).toEqual({
                    CMD: "TAG_CREATE",
                    SHARE: 0,
                    NODE_ID: 6545,
                    TAG_GROUP_ID: 68,
                    TAG_ID: 154,
                    DATA_TYPE: 3,
                    COUNT: 5,
                    CUSTOM_TYPE: 298
                });
            });
        });

        describe("got tagSetUint8 3D from server", function() {
            beforeEach(function() {
                
                messageLen = 14;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, 72); // tagSetUint8 3D command
                view.setUint8(1, 14); // length
                view.setUint8(2, 0); // share is 0
                view.setUint32(3, 6545); // Node ID
                view.setUint16(7, 68); // TagGroupID
                view.setUint16(9, 154);// TagID
                view.setUint8(11, 15);// X Value
                view.setUint8(12, 55);// Y Value
                view.setUint8(13, 6);// Z Value

            });

            it("command should be parsed out as TAG_SET_UINT8 object", function() {
                
                mockView = new DataView(mockBuffer);
                result = tag.getTagValues(72, mockView, 0, mockBuffer.byteLength);
                
                expect(result).toEqual({
                    CMD: "TAG_SET_UINT8",
                    SHARE: 0,
                    NODE_ID: 6545,
                    TAG_GROUP_ID: 68,
                    TAG_ID: 154,
                    VALUES: [15, 55, 6]
                });
            });
        });

        describe("got tagSetUint32 4D from server", function() {
            beforeEach(function() {
                
                messageLen = 27;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, 81); // tagSetUint32 4D command
                view.setUint8(1, messageLen); // length
                view.setUint8(2, 0); // share is 0
                view.setUint32(3, 6545); // Node ID
                view.setUint16(7, 68); // TagGroupID
                view.setUint16(9, 154);// TagID
                view.setUint32(11, 155465);// 1 Value
                view.setUint32(15, 5535654);// 2 Value
                view.setUint32(19, 6455453);// 3 Value
                view.setUint32(23, 54643);// 4 Value

            });

            it("command should be parsed out as TAG_SET_UINT8 object", function() {
                
                mockView = new DataView(mockBuffer);
                result = tag.getTagValues(81, mockView, 0, mockBuffer.byteLength);
                
                expect(result).toEqual({
                    CMD: "TAG_SET_UINT32",
                    SHARE: 0,
                    NODE_ID: 6545,
                    TAG_GROUP_ID: 68,
                    TAG_ID: 154,
                    VALUES: [155465, 5535654, 6455453, 54643]
                });
            });
        });





    });


});
