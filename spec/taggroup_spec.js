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

define(["taggroup"], function(tagGroup) {

    describe("Tag Group commands test suite", function() {
        var testCommand, view, messageLen, mockBuffer, mockView, result;

        describe("Prepare TagGroup create command", function() {
            beforeEach(function() {
                testCommand = tagGroup.create(182, 17); // node_id, tg custom_type
                view = new DataView(testCommand);
            });

            it("length of create command should be equal to 11", function() {
                expect(testCommand.byteLength).toEqual(11);
            });

            it("first byte - opcode - should be 64", function() {
                expect(view.getUint8(0)).toEqual(64);
            });

            it("second byte - message length - should be 11 ", function() {
                expect(view.getUint8(1)).toEqual(11);
            });

            it("third byte - share - should be 0 ", function() {
                expect(view.getUint8(2)).toEqual(0);
            });

            it("fourth byte node ID should be 182", function() {
                expect(view.getUint32(3)).toEqual(182);
            });

            it("tagGroup (byte 8) id should be 65535", function() {
                expect(view.getUint16(7)).toEqual(65535);
            });

            it("custom_type (byte 10) id should be 17", function() {
                expect(view.getUint16(9)).toEqual(17);
            });
        });

        describe("Prepare TagGroup destroy command", function() {
            beforeEach(function() {
                testCommand = tagGroup.destroy(183, 457); // node_id, tag_group_id
                view = new DataView(testCommand);
            });

            it("length of destroy command should be equal to 9", function() {
                expect(testCommand.byteLength).toEqual(9);
            });

            it("first byte - opcode - should be 65", function() {
                expect(view.getUint8(0)).toEqual(65);
            });

            it("second byte - message length - should be 9 ", function() {
                expect(view.getUint8(1)).toEqual(9);
            });

            it("third byte - share - should be 0 ", function() {
                expect(view.getUint8(2)).toEqual(0);
            });

            it("fourth byte node ID should be 182", function() {
                expect(view.getUint32(3)).toEqual(183);
            });

            it("tagGroup (byte 8) id should be 457", function() {
                expect(view.getUint16(7)).toEqual(457);
            });
        });

        describe("Prepare TagGroupUnsubscribe command", function() {
            beforeEach(function() {
                testCommand = tagGroup.subscribe(182, 31);
                view = new DataView(testCommand);
            });

            it("length of subscribe command should be equal to 17", function() {
                expect(testCommand.byteLength).toEqual(17);
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

        describe("Prepare tagGroupUnsubscribe command", function() {
            beforeEach(function() {
                testCommand = tagGroup.unsubscribe(182, 31);
                view = new DataView(testCommand);
            });


            it("first byte - opCode - should be 67", function() {
                expect(view.getUint8(0)).toEqual(67);
            });
        });


        describe("got TagGroupCreate from server", function() {
            beforeEach(function() {

                messageLen = 11;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, 64); //tagGroupCreate command
                view.setUint8(1, messageLen); //length
                view.setUint8(2, 0); //share is 0
                view.setUint32(3, 115); //Node ID
                view.setUint16(7, 68); //TagGroupID
                view.setUint16(9, 62); //custom type  

            });

            it("command should be parsed out as TAG_GROUP_CREATE, NODE_ID = 111 object", function() {

                mockView = new DataView(mockBuffer);
                result = tagGroup.getTagGroupValues(64, mockView, 0, mockBuffer.byteLength);

                expect(result).toEqual({
                    CMD: "TAG_GROUP_CREATE",
                    SHARE: 0,
                    NODE_ID: 115,
                    TAG_GROUP_ID: 68,
                    CUSTOM_TYPE: 62
                });
            });
        });

        describe("got TagGroupDestroy from server", function() {
            beforeEach(function() {

                messageLen = 9;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, 65); //tagGroupDestroy command
                view.setUint8(1, messageLen); //length
                view.setUint8(2, 0); //share is 0
                view.setUint32(3, 115); //Node ID
                view.setUint16(7, 68); //TagGroupID
         
            });

            it("command should be parsed out as TAG_GROUP_DESTROY object", function() {

                mockView = new DataView(mockBuffer);
                result = tagGroup.getTagGroupValues(65, mockView, 0, mockBuffer.byteLength);

                expect(result).toEqual({
                    CMD: "TAG_GROUP_DESTROY",
                    SHARE: 0,
                    NODE_ID: 115,
                    TAG_GROUP_ID: 68
                });
            });
        });

        describe("got TagGroupSubscribe from server", function() {
            beforeEach(function() {

                messageLen = 17;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, 66); //tagGroupSubscribe command
                view.setUint8(1, messageLen); //length
                view.setUint8(2, 0); //share is 0
                view.setUint32(3, 115); //Node ID
                view.setUint16(7, 68); //TagGroupID
                view.setUint32(9, 1215); //VERSION
                view.setUint32(13, 8115); //CRC32
         
            });

            it("command should be parsed out as TAG_GROUP_SUBSCRIBE object", function() {

                mockView = new DataView(mockBuffer);
                result = tagGroup.getTagGroupValues(66, mockView, 0, mockBuffer.byteLength);

                expect(result).toEqual({
                    CMD: "TAG_GROUP_SUBSCRIBE",
                    SHARE: 0,
                    NODE_ID: 115,
                    TAG_GROUP_ID: 68,
                    VERSION: 1215,
                    CRC32: 8115
                });
            });
        });





    });


});
