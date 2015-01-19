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

define(["node"], function(node) {

    describe("Node commands test suite", function() {
        var testNode, view, messageLen, mockBuffer, mockView, result, opCode;

        describe("node create command", function() {
            beforeEach(function() {
                testNode = node.create(1000, 65540, 2000);
                view = new DataView(testNode);
            });

            it("length of node create command should be equal to 15 ", function() {
                expect(testNode.byteLength).toEqual(15);
            });

            it("first item (1 Byte) - opcode - should be", function() {
                expect(view.getUint8(0)).toEqual(32);
            });

            it("second item (1 Byte) - message length - should be 15 ", function() {
                expect(view.getUint8(1)).toEqual(15);
            });

            it("third item (1 Byte) - share - should be 0 ", function() {
                expect(view.getUint8(2)).toEqual(0);
            });

            it("4th item (2 Byte) - user ID - should be 1000 ", function() {
                expect(view.getUint16(3)).toEqual(1000);
            });

            it("5th item (4 Byte) - parent ID - should be 65540 ", function() {
                expect(view.getUint32(5)).toEqual(65540);
            });

            it("6th item (4 Byte) - node ID - should be 4294967295 ", function() {
                expect(view.getUint32(9)).toEqual(4294967295);
            });

            it("7th item (2 Byte) - custom type - should be 2000 ", function() {
                expect(view.getUint16(13)).toEqual(2000);
            });
        });

        describe("node destroy command", function() {
            beforeEach(function() {
                testNode = node.destroy(65550);
                view = new DataView(testNode);
            });

            it("length of node destroy command should be equal to 6 ", function() {
                expect(testNode.byteLength).toEqual(6);
            });

            it("first item (1 Byte) - opcode - should be", function() {
                expect(view.getUint8(0)).toEqual(33);
            });

            it("second item (1 Byte) - message length - should be 6 ", function() {
                expect(view.getUint8(1)).toEqual(6);
            });

            it("third item (4 Bytes) - node ID - should be 65550 ", function() {
                expect(view.getUint32(2)).toEqual(65550);
            });
        });

        describe("node subscribe command", function() {
            beforeEach(function() {
                testNode = node.subscribe(41);
                view = new DataView(testNode);
            });

            it("length of subscribe command should be equal to 14", function() {
                expect(testNode.byteLength).toEqual(14);
            });

            it("first byte - opcode - should be 34", function() {
                expect(view.getUint8(0)).toEqual(34);
            });

            it("second byte - message length - should be 14 ", function() {
                expect(view.getUint8(1)).toEqual(14);
            });

            it("third byte nodeId should be 41 for this test ", function() {
                expect(view.getUint32(2)).toEqual(41);
            });

            it("version (byte 7) should be 0 as not supported ", function() {
                expect(view.getUint32(6)).toEqual(0);
            });

            it("CRC32 (byte 11) should be 0 as not supported  ", function() {
                expect(view.getUint32(10)).toEqual(0);
            });

        });

        describe("node unsubscribe command", function() {
            beforeEach(function() {
                testNode = node.unsubscribe(1042);
                view = new DataView(testNode);
            });

            it("length of unsubscribe command should be equal to 14", function() {
                expect(testNode.byteLength).toEqual(14);
            });

            it("first byte - opcode - should be 35", function() {
                expect(view.getUint8(0)).toEqual(35);
            });

            it("second byte - message length - should be 14 ", function() {
                expect(view.getUint8(1)).toEqual(14);
            });

            it("third byte nodeId should be 41 for this test ", function() {
                expect(view.getUint32(2)).toEqual(1042);
            });

            it("version (byte 7) should be 0 as not supported ", function() {
                expect(view.getUint32(6)).toEqual(0);
            });

            it("CRC32 (byte 11) should be 0 as not supported  ", function() {
                expect(view.getUint32(10)).toEqual(0);
            });
        });

        describe("node link command", function() {
            beforeEach(function() {
                testNode = node.link(3, 10043);
                view = new DataView(testNode);
            });

            it("length of link command should be equal to 11", function() {
                expect(testNode.byteLength).toEqual(11);
            });

            it("first byte - opcode - should be 37", function() {
                expect(view.getUint8(0)).toEqual(37);
            });

            it("second byte - message length - should be 11 ", function() {
                expect(view.getUint8(1)).toEqual(11);
            });

            it("third byte - share - should be 0 for this test ", function() {
                expect(view.getUint8(2)).toEqual(0);
            });

            it("parent node ID (byte 4) should be 3 ", function() {
                expect(view.getUint32(3)).toEqual(3);
            });

            it("child node ID (byte 8) should be 10043 ", function() {
                expect(view.getUint32(7)).toEqual(10043);
            });
        });

        describe("node permission command", function() {
            beforeEach(function() {
                testNode = node.perm(10044, 1001, 1);
                view = new DataView(testNode);
            });

            it("length of permission command should be equal to 10", function() {
                expect(testNode.byteLength).toEqual(10);
            });

            it("first byte - opcode - should be 38", function() {
                expect(view.getUint8(0)).toEqual(38);
            });

            it("second byte - message length - should be 10 ", function() {
                expect(view.getUint8(1)).toEqual(10);
            });

            it("third byte - share - should be 0 for this test ", function() {
                expect(view.getUint8(2)).toEqual(0);
            });

            it("user ID (byte 4) should be 1001 ", function() {
                expect(view.getUint16(3)).toEqual(1001);
            });

            it("permission (byte 6) should be 1 ", function() {
                expect(view.getUint8(5)).toEqual(1);
            });

            it("node ID (byte 7) should be 10044 ", function() {
                expect(view.getUint32(6)).toEqual(10044);
            });
        });

        describe("got Node Create from server", function() {
            beforeEach(function() {
                
                messageLen = 15;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, 32); //node create command
                view.setUint8(1, messageLen); //mes len
                view.setUint8(2, 0); //share
                view.setUint16(3, 125); //user ID
                view.setUint32(5, 0); //parent ID
                view.setUint32(9, 1); //node ID 
                view.setUint16(13, 62);//custom type  

            });

            it("command should be parsed out as NODE_CREATE, USERID = 125 object", function() {
                
                mockView = new DataView(mockBuffer);
                result = node.getNodeValues(32, mockView, 0, mockBuffer.byteLength);
                
                expect(result).toEqual({
                    CMD: "NODE_CREATE",
                    SHARE: 0,
                    USER_ID: 125,
                    PARENT_ID: 0,
                    NODE_ID: 1,
                    CUSTOM_TYPE: 62
                });
            });
        });

        describe("got Node Destroy from server", function() {
            beforeEach(function() {
                
                opCode = 33;
                messageLen = 6;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //node destroy
                view.setUint8(1, messageLen); //len
                view.setUint32(2, 123); //node ID 
                

            });

            it("command should be parsed out as NODE_DESTROY, NODE_ID = 123 object", function() {
                
                mockView = new DataView(mockBuffer);
                result = node.getNodeValues(opCode, mockView, 0, mockBuffer.byteLength);
                
                expect(result).toEqual({
                    CMD: "NODE_DESTROY",
                    NODE_ID: 123
                });
            });
        });

        describe("got Node Subscribe from server", function() {
            beforeEach(function() {
                
                opCode = 34;
                messageLen = 14;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //node destroy
                view.setUint8(1, messageLen); //len
                view.setUint32(2, 123); //node ID
                view.setUint32(6, 2); //version
                view.setUint32(10, 8); //crc32
                

            });

            it("command should be parsed out as NODE_SUBSCRIBE object", function() {
                
                mockView = new DataView(mockBuffer);
                result = node.getNodeValues(opCode, mockView, 0, mockBuffer.byteLength);
                
                expect(result).toEqual({
                    CMD: "NODE_SUBSCRIBE",
                    NODE_ID: 123,
                    VERSION: 2,
                    CRC32: 8
                });
            });
        });

        
        describe("got Node UnSubscribe from server", function() {
            beforeEach(function() {
                
                opCode = 35;
                messageLen = 14;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //node destroy
                view.setUint8(1, messageLen); //len
                view.setUint32(2, 123); //node ID
                view.setUint32(6, 2); //version
                view.setUint32(10, 8); //crc32
                

            });

            it("command should be parsed out as NODE_UNSUBSCRIBE object", function() {
                
                mockView = new DataView(mockBuffer);
                result = node.getNodeValues(opCode, mockView, 0, mockBuffer.byteLength);
                
                expect(result).toEqual({
                    CMD: "NODE_UNSUBSCRIBE",
                    NODE_ID: 123,
                    VERSION: 2,
                    CRC32: 8
                });
            });
        });

        describe("got Node Link from server", function() {
            beforeEach(function() {
                
                opCode = 37;
                messageLen = 11;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //node destroy
                view.setUint8(1, messageLen); //len
                view.setUint8(2, 0); //share
                view.setUint32(3, 123); //parent node ID
                view.setUint32(7, 859); //version

            });

            it("command should be parsed out as NODE_LINK object", function() {
                
                mockView = new DataView(mockBuffer);
                result = node.getNodeValues(opCode, mockView, 0, mockBuffer.byteLength);
                
                expect(result).toEqual({
                    CMD: "NODE_LINK",
                    SHARE: 0,
                    PARENT_NODE_ID: 123,
                    CHILD_NODE_ID: 859
                });
            });
        });

        describe("got Node Permissions from server", function() {
            beforeEach(function() {
                
                opCode = 38;
                messageLen = 10;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //node destroy
                view.setUint8(1, messageLen); //len
                view.setUint8(2, 0); //share
                view.setUint16(3, 88); //user ID
                view.setUint8(5, 9); //permissions
                view.setUint32(6, 321909); //nodeId

            });

            it("command should be parsed out as NODE_PERMISSIONS object", function() {
                
                mockView = new DataView(mockBuffer);
                result = node.getNodeValues(opCode, mockView, 0, mockBuffer.byteLength);
                
                expect(result).toEqual({
                    CMD: "NODE_PERMISSIONS",
                    SHARE: 0,
                    USER_ID: 88,
                    PERMISSIONS: 9,
                    NODE_ID: 321909
                });
            });
        });

        describe("got Node Umask from server", function() {
            beforeEach(function() {
                
                opCode = 39;
                messageLen = 3;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //node destroy
                view.setUint8(1, messageLen); //len
                view.setUint8(2, 9); //permissions
                

            });

            it("command should be parsed out as NODE_UMASK object", function() {
                
                mockView = new DataView(mockBuffer);
                result = node.getNodeValues(opCode, mockView, 0, mockBuffer.byteLength);
                
                expect(result).toEqual({
                    CMD: "NODE_UMASK",
                    PERMISSIONS: 9
                });
            });
        });

        describe("got Node Owner from server", function() {
            beforeEach(function() {
                
                opCode = 40;
                messageLen = 9;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //node destroy
                view.setUint8(1, messageLen); //len
                view.setUint8(2, 0); //share
                view.setUint16(3, 88); //user ID
                view.setUint32(5, 321909); //nodeId

            });

            it("command should be parsed out as NODE_OWNER object", function() {
                
                mockView = new DataView(mockBuffer);
                result = node.getNodeValues(opCode, mockView, 0, mockBuffer.byteLength);
                
                expect(result).toEqual({
                    CMD: "NODE_OWNER",
                    SHARE: 0,
                    USER_ID: 88,
                    NODE_ID: 321909
                });
            });
        });

        describe("got Node Lock from server", function() {
            beforeEach(function() {
                
                opCode = 41;
                messageLen = 11;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //node destroy
                view.setUint8(1, messageLen); //len
                view.setUint8(2, 0); //share
                view.setUint32(3, 88); //avatar ID
                view.setUint32(7, 321909); //nodeId

            });

            it("command should be parsed out as NODE_LOCK object", function() {
                
                mockView = new DataView(mockBuffer);
                result = node.getNodeValues(opCode, mockView, 0, mockBuffer.byteLength);
                
                expect(result).toEqual({
                    CMD: "NODE_LOCK",
                    SHARE: 0,
                    AVATAR_ID: 88,
                    NODE_ID: 321909
                });
            });
        });

        describe("got Node Unlock from server", function() {
            beforeEach(function() {
                
                opCode = 42;
                messageLen = 11;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //node destroy
                view.setUint8(1, messageLen); //len
                view.setUint8(2, 0); //share
                view.setUint32(3, 88); //avatar ID
                view.setUint32(7, 321909); //nodeId

            });

            it("command should be parsed out as NODE_UNLOCK object", function() {
                
                mockView = new DataView(mockBuffer);
                result = node.getNodeValues(opCode, mockView, 0, mockBuffer.byteLength);
                
                expect(result).toEqual({
                    CMD: "NODE_UNLOCK",
                    SHARE: 0,
                    AVATAR_ID: 88,
                    NODE_ID: 321909
                });
            });
        });

        describe("got Node Priority from server", function() {
            beforeEach(function() {
                
                opCode = 43;
                messageLen = 8;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode); //node destroy
                view.setUint8(1, messageLen); //len
                view.setUint8(2, 0); //share
                view.setUint8(3, 88); //priority
                view.setUint32(4, 321909); //nodeId

            });

            it("command should be parsed out as NODE_PRIORITY object", function() {
                
                mockView = new DataView(mockBuffer);
                result = node.getNodeValues(opCode, mockView, 0, mockBuffer.byteLength);
                
                expect(result).toEqual({
                    CMD: "NODE_PRIORITY",
                    SHARE: 0,
                    PRIORITY: 88,
                    NODE_ID: 321909
                });
            });
        });

    });


});
