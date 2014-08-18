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
        var view, msg, mockView, mockBuffer, mockBufferA, mockBufferB;



        describe("message - general message object", function() {
            beforeEach(function() {
                mockBuffer = new ArrayBuffer(8);
                mockView = new DataView(mockBuffer);
                /* message length */
                mockView.setUint16(2, 8);
                /* command usr_auth_fail */
                mockView.setUint8(4, 8);
                /* command length*/
                mockView.setUint8(5, 3);
                /* command method */
                mockView.setUint8(6, 2);
                msg = request.message(mockBuffer);
                view = new DataView(msg);
            });

            it("should have message.length equal to 12 = 4 message header + 8 mock buffer length", function() {

                expect(msg.byteLength).toEqual(12);
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
                mockBufferA = new ArrayBuffer(8);
                mockView = new DataView(mockBufferA);
                /*message length*/
                mockView.setUint16(2, 8);
                /* command usr_auth_fail */
                mockView.setUint8(4, 8);
                /* command length*/
                mockView.setUint8(5, 3);
                /* command method*/
                mockView.setUint8(6, 2);
                
                mockBufferB = new ArrayBuffer(10);
                mockView = new DataView(mockBufferB);
                /*message length*/
                mockView.setUint16(1, 8);
                /* command usr_auth_fail */
                mockView.setUint8(4, 8);
                /* command length*/
                mockView.setUint8(5, 3);
                /* command method*/
                mockView.setUint8(9, 5);

                mockBuffer = request.buffer_push(mockBufferA, mockBufferB);
                view = new DataView(mockBuffer);
            });

             it("should have message.length equal to 18 =  8 + 10 mock buffer a + b length", function() {

                expect(mockBuffer.byteLength).toEqual(18);
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
