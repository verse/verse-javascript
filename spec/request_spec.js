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

define(["request"], function(request) {

    describe("Request", function() {
        var shake, view, auth, uname, passwd, mock_view, mock_buff, mock_buff_a, mock_buff_b;


        describe("handshake", function() {
            beforeEach(function() {
                uname = "albert";
                shake = request.handshake(uname);
                view = new DataView(shake);
            });

            it("should have handshake.length equal to 14 for name=albert ", function() {
                expect(shake.byteLength).toEqual(14);
            });

            it("first byte - message length - should be 14 for albert", function() {
                expect(view.getUint16(2)).toEqual(14);
            });

            it("length of command should be 10 (4 + 6) for albert", function() {
                expect(view.getUint8(5)).toEqual(10);
            });

            it("Pack length of string should be 6 for albert", function() {
                expect(view.getUint8(6)).toEqual(6);
            });

            it("First char of packed string should a", function() {
                expect(view.getUint8(7)).toEqual("a".charCodeAt(0));
            });

        });

        describe("userAuth", function() {
            beforeEach(function() {
                uname = "albert";
                passwd = "12345";
                auth = request.userAuth(uname, passwd);
                view = new DataView(auth);
            });

            it("The length of userAuth should be 16 = 2 (cmd_header) + 1 + (string length) + 6 (albert) + 1 + 1 (string length) + 5 (12345)", function() {
                expect(auth.byteLength).toEqual(16);
            });

            it("The OpCode of the command should be 7", function() {
                expect(view.getUint8(0)).toEqual(7);
            });

            it("The length of the command should be 16", function() {
                expect(view.getUint8(1)).toEqual(16);
            });

            it("Pack length of the username (albert) should be 6", function() {
                expect(view.getUint8(2)).toEqual(uname.length);
            });

            it("First char of packed username should be a", function() {
                expect(view.getUint8(3)).toEqual("a".charCodeAt(0));
            });

            it("The type of auth method should be 2", function() {
                expect(view.getUint8(9)).toEqual(2);
            });

            it("The length of the passwd should be 5", function() {
                expect(view.getUint8(10)).toEqual(passwd.length);
            });

            it("First char of packed passwd should be 1", function() {
                expect(view.getUint8(11)).toEqual("1".charCodeAt(0));
            });

            it("Last char of packed passwd should be 5", function() {
                expect(view.getUint8(15)).toEqual("5".charCodeAt(0));
            });

        });


        describe("message - general message object", function() {
            beforeEach(function() {
                mock_buff = new ArrayBuffer(8);
                mock_view = new DataView(mock_buff);
                /*message length*/
                mock_view.setUint16(2, 8);
                /* command usr_auth_fail */
                mock_view.setUint8(4, 8);
                /* command length*/
                mock_view.setUint8(5, 3);
                /* command method*/
                mock_view.setUint8(6, 2);
                shake = request.message(mock_buff);
                view = new DataView(shake);
            });

            it("should have message.length equal to 12 = 4 message header + 8 mock buffer length", function() {

                expect(shake.byteLength).toEqual(12);
            });

            it("should have 6 byte equal to 8 if copy works", function() {

                expect(view.getUint16(6)).toEqual(8);
            });

              it("encoded message length should be also 12", function() {

                expect(view.getUint16(2)).toEqual(12);
            });

        });


        describe("merge two array buffers into one", function() {
            beforeEach(function() {
                mock_buff_a = new ArrayBuffer(8);
                mock_view = new DataView(mock_buff_a);
                /*message length*/
                mock_view.setUint16(2, 8);
                /* command usr_auth_fail */
                mock_view.setUint8(4, 8);
                /* command length*/
                mock_view.setUint8(5, 3);
                /* command method*/
                mock_view.setUint8(6, 2);
                
                mock_buff_b = new ArrayBuffer(10);
                mock_view = new DataView(mock_buff_b);
                /*message length*/
                mock_view.setUint16(1, 8);
                /* command usr_auth_fail */
                mock_view.setUint8(4, 8);
                /* command length*/
                mock_view.setUint8(5, 3);
                /* command method*/
                mock_view.setUint8(9, 5);

                mock_buff = request.buffer_push(mock_buff_a, mock_buff_b);
                view = new DataView(mock_buff);
            });

             it("should have message.length equal to 18 =  8 + 10 mock buffer a + b length", function() {

                expect(mock_buff.byteLength).toEqual(18);
            });

            it("should have 2 byte equal to 8 if merge works", function() {

                expect(view.getUint16(2)).toEqual(8);
            });

             it("should have 18 byte equal to 5 if merge works", function() {

                expect(view.getUint8(17)).toEqual(5);
            });


        });

    });


});
