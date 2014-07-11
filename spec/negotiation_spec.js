"use strict";

/*globals define*/

define(["negotiation"], function(negotiation) {

    describe("Negotiation", function() {
        var nego, view;


        describe("fcid - int message with CHANGE_R type", function() {
            beforeEach(function() {
                nego = negotiation.fcid(negotiation.CHANGE_R, 15);
                view = new DataView(nego);
            });

            it("lenght of fcid message should be equal to 8  = 4 (header) + cmd_type + lenght + feature + int value", function() {
                expect(nego.byteLength).toEqual(8);
            });

            it("fifth byte - cmd type (op_code) - should be 4 for CHANGE_R", function() {
                expect(view.getUint8(4)).toEqual(4);
            });

            it("sixt byte - cmd length - should be 4", function() {
                expect(view.getUint8(5)).toEqual(4);
            });

            it("seventh byte - feature type - should be 1 ", function() {
                expect(view.getUint8(6)).toEqual(1);
            });

            it("eigth byte - id - should be 15 ", function() {
                expect(view.getUint8(7)).toEqual(15);
            });

            

        });

        describe("ccid - int message with CHANGE_L type", function() {
            beforeEach(function() {
                nego = negotiation.ccid(negotiation.CHANGE_L, 215);
                view = new DataView(nego);
            });

            it("lenght of ccid message should be equal to 8  = 4 (header) + cmd_type + lenght + feature + int value", function() {
                expect(nego.byteLength).toEqual(8);
            });

            it("fifth byte - cmd type (op_code) - should be 3 for CHANGE_L", function() {
                expect(view.getUint8(4)).toEqual(3);
            });

            it("sixth byte - cmd lenght - should be 4 ", function() {
                expect(view.getUint8(5)).toEqual(4);
            });

            it("seventh byte - feature type - should be 2 ", function() {
                expect(view.getUint8(6)).toEqual(2);
            });

            it("eigth byte - id - should be 15 ", function() {
                expect(view.getUint8(7)).toEqual(215);
            });

            

        });

        describe("url - string message with CONFIRM_L type", function() {
            var url;

            beforeEach(function() {
                url = 'wc://verse.example.com:12345';
                nego = negotiation.url(negotiation.CONFIRM_L, url);
                view = new DataView(nego);
            });

            it("lenght of url message should be equal to 36 = 4 (header) + 3 (cmd_type) + 1 (url len) + 28 (url)", function() {
                expect(nego.byteLength).toEqual(4 + 3 + 1 + 28);
            });

            it("fifth byte - cmd type (op_code) - should be 5 for CONFIRM_L", function() {
                expect(view.getUint8(4)).toEqual(5);
            });

            it("sixth byte - cmd lenght - should be 3 + 1 + 28 ", function() {
                expect(view.getUint8(5)).toEqual(32);
            });

            it("seventh byte - feature type - should be 3 ", function() {
                expect(view.getUint8(6)).toEqual(3);
            });

            it("First byte of packed string should be lenght of URL string = 28 ", function() {
                expect(view.getUint8(7)).toEqual(28);
            });

            it("First char of packed url should be w", function() {
                expect(view.getUint8(8)).toEqual("w".charCodeAt(0));
            });

            it("Last char of packed passwd should be 5", function() {
                expect(view.getUint8(35)).toEqual("5".charCodeAt(0));
            });

           
            

        });

        describe("token, string message with CONFIRM_L type", function() {
            var token;

            beforeEach(function() {
                token = 'token';
                nego = negotiation.token(negotiation.CONFIRM_L, token);
                view = new DataView(nego);
            });

            it("lenght of token message should be equal to 13 = 4 (header) + 3 (cmd_len) + 1 (str len) + 5 (token lenght)", function() {
                expect(nego.byteLength).toEqual(13);
            });

            it("fifth byte - cmd type (op_code) - should be 5 for CONFIRM_L", function() {
                expect(view.getUint8(4)).toEqual(5);
            });

            it("sixth byte - cmd lenght - should be 3 + 1 + 5 ", function() {
                expect(view.getUint8(5)).toEqual(9);
            });

            it("seventh byte - feature type - should be 4 ", function() {
                expect(view.getUint8(6)).toEqual(4);
            });

             it("First byte of packed string should be lenght of token string = 5", function() {
                expect(view.getUint8(7)).toEqual(5);
            });

            it("First char of packed token should be t", function() {
                expect(view.getUint8(8)).toEqual("t".charCodeAt(0));
            });

            it("Last char of packed token should be n", function() {
                expect(view.getUint8(12)).toEqual("n".charCodeAt(0));
            });


        });

         describe("fps - float type message, with CONFIRM_R type", function() {
            var fps_val;

            beforeEach(function() {
                fps_val = 7.244;
                nego = negotiation.fps(negotiation.CONFIRM_R, fps_val);
                view = new DataView(nego);
            });

            it("lenght of fps message should be equal to 13 = 4 (header) + 3 (cmd_type) + 4 (float value)", function() {
                expect(nego.byteLength).toEqual(13);
            });

            it("fifth byte - cmd type (op_code) - should be 6 for CONFIRM_R", function() {
                expect(view.getUint8(4)).toEqual(6);
            });

            it("sixth byte - cmd lenght - should be 7 ", function() {
                expect(view.getUint8(5)).toEqual(7);
            });

            it("seventh byte - feature type - should be 7 ", function() {
                expect(view.getUint8(6)).toEqual(7);
            });

            it("fourth byte - FPS - should be 7.244 ", function() {
                expect(view.getFloat32(7)).toBeCloseTo(7.244);
            });

           


        });
        

    });


});
