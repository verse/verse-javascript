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

/* globals define */

define(["negotiation"], function(negotiation) {

    describe("Negotiation", function() {
        var nego, view;

        describe("rwin", function() {
            beforeEach(function() {
                nego = negotiation.rwin(negotiation.CHANGE_R, 155);
                view = new DataView(nego);
            });

            it("length of fcid message should be equal to 4", function() {
                expect(nego.byteLength).toEqual(4);
            });

            it("first byte - message type - should be 4 for CHANGE_R", function() {
                expect(view.getUint8(0)).toEqual(4);
            });

            it("second byte - message length - should be 4 ", function() {
                expect(view.getUint8(1)).toEqual(4);
            });

            it("third byte - feature type - should be 6 ", function() {
                expect(view.getUint8(2)).toEqual(6);
            });

            it("fourth byte - rwin value - should be 15 ", function() {
                expect(view.getUint8(3)).toEqual(155);
            });

        });

        describe("compression", function() {
            beforeEach(function() {
                nego = negotiation.compression(negotiation.CHANGE_R, 2);
                view = new DataView(nego);
            });

            it("length of fcid message should be equal to 4", function() {
                expect(nego.byteLength).toEqual(4);
            });

            it("first byte - message type - should be 4 for CHANGE_R", function() {
                expect(view.getUint8(0)).toEqual(4);
            });

            it("second byte - message length - should be 4 ", function() {
                expect(view.getUint8(1)).toEqual(4);
            });

            it("third byte - feature type - should be 8 ", function() {
                expect(view.getUint8(2)).toEqual(8);
            });

            it("fourth byte - compression value - should be 15 ", function() {
                expect(view.getUint8(3)).toEqual(2);
            });

        });


        describe("fcid", function() {
            beforeEach(function() {
                nego = negotiation.fcid(negotiation.CHANGE_R, 15);
                view = new DataView(nego);
            });

            it("length of fcid message should be equal to 4", function() {
                expect(nego.byteLength).toEqual(4);
            });

            it("first byte - message type - should be 4 for CHANGE_R", function() {
                expect(view.getUint8(0)).toEqual(4);
            });

            it("second byte - message length - should be 4 ", function() {
                expect(view.getUint8(1)).toEqual(4);
            });

            it("third byte - feature type - should be 1 ", function() {
                expect(view.getUint8(2)).toEqual(1);
            });

            it("fourth byte - id - should be 15 ", function() {
                expect(view.getUint8(3)).toEqual(15);
            });

        });


        describe("ccid", function() {
            beforeEach(function() {
                nego = negotiation.ccid(negotiation.CHANGE_L, 215);
                view = new DataView(nego);
            });

            it("length of ccid message should be equal to 4", function() {
                expect(nego.byteLength).toEqual(4);
            });

            it("first byte - message type - should be 3 for CHANGE_L", function() {
                expect(view.getUint8(0)).toEqual(3);
            });

            it("second byte - message length - should be 4 ", function() {
                expect(view.getUint8(1)).toEqual(4);
            });

            it("third byte - feature type - should be 2 ", function() {
                expect(view.getUint8(2)).toEqual(2);
            });

            it("fourth byte - id - should be 15 ", function() {
                expect(view.getUint8(3)).toEqual(215);
            });

        });


        describe("url", function() {
            var url;

            beforeEach(function() {
                url = 'ws://verse.example.com:12345';
                nego = negotiation.url(negotiation.CONFIRM_L, url);
                view = new DataView(nego);
            });

            it("length of ccid message should be equal to 3 + 1 + 28 (url length)", function() {
                expect(nego.byteLength).toEqual(3 + 1 + 28);
            });

            it("first byte - message type - should be 5 for CONFIRM_L", function() {
                expect(view.getUint8(0)).toEqual(5);
            });

            it("second byte - message length - should be 3 + 1 + 28 ", function() {
                expect(view.getUint8(1)).toEqual(32);
            });

            it("third byte - feature type - should be 3 ", function() {
                expect(view.getUint8(2)).toEqual(3);
            });

            it("First byte of packed string should be length of URL string = 28 ", function() {
                expect(view.getUint8(3)).toEqual(28);
            });

            it("First char of packed url should be w", function() {
                expect(view.getUint8(4)).toEqual("w".charCodeAt(0));
            });

            it("Last char of packed passwd should be 5", function() {
                expect(view.getUint8(31)).toEqual("5".charCodeAt(0));
            });

        });

        describe("ded", function() {
            var ded;

            beforeEach(function() {
                ded = 'hokuspokus';
                nego = negotiation.ded(negotiation.CONFIRM_L, ded);
                view = new DataView(nego);
            });

            it("length of ded message should be equal to 3 + 1 + 10 (ded length)", function() {
                expect(nego.byteLength).toEqual(3 + 1 + 10);
            });

            it("first byte - message type - should be 5 for CONFIRM_L", function() {
                expect(view.getUint8(0)).toEqual(5);
            });


            it("Last char of packed ded should be s", function() {
                expect(view.getUint8(13)).toEqual("s".charCodeAt(0));
            });

        });



        describe("token", function() {
            var token;

            beforeEach(function() {
                token = 'token';
                nego = negotiation.token(negotiation.CONFIRM_L, token);
                view = new DataView(nego);
            });

            it("length of token message should be equal to 3 + 1 + 5 (token lenght)", function() {
                expect(nego.byteLength).toEqual(9);
            });

            it("first byte - message type - should be 5 for CONFIRM_L", function() {
                expect(view.getUint8(0)).toEqual(5);
            });

            it("second byte - message length - should be 3 + 1 + 5 ", function() {
                expect(view.getUint8(1)).toEqual(9);
            });

            it("third byte - feature type - should be 4 ", function() {
                expect(view.getUint8(2)).toEqual(4);
            });

            it("First byte of packed string should be length of token string = 5", function() {
                expect(view.getUint8(3)).toEqual(5);
            });

            it("First char of packed token should be t", function() {
                expect(view.getUint8(4)).toEqual("t".charCodeAt(0));
            });

            it("Last char of packed token should be n", function() {
                expect(view.getUint8(8)).toEqual("n".charCodeAt(0));
            });

        });


        describe("fps", function() {
            var fps_val;

            beforeEach(function() {
                fps_val = 7.244;
                nego = negotiation.fps(negotiation.CONFIRM_R, fps_val);
                view = new DataView(nego);
            });

            it("length of ccid message should be equal to 7", function() {
                expect(nego.byteLength).toEqual(7);
            });

            it("first byte - message type - should be 6 for CONFIRM_R", function() {
                expect(view.getUint8(0)).toEqual(6);
            });

            it("second byte - message length - should be 7 ", function() {
                expect(view.getUint8(1)).toEqual(7);
            });

            it("third byte - feature type - should be 7 ", function() {
                expect(view.getUint8(2)).toEqual(7);
            });

            it("fourth byte - FPS - should be 7.244 ", function() {
                expect(view.getFloat32(3)).toBeCloseTo(7.244);
            });

        });


    });


});
