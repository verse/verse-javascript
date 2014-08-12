"use strict";

/*globals define*/

define(["node"], function(node) {

    describe("Node commands test suite", function() {
        var testNode, view;


        describe("node subscribe command", function() {
            beforeEach(function() {
                testNode = node.subscribe(0);
                view = new DataView(testNode);
            });

            it("lenght of subscribe command should be equal to 14", function() {
                expect(testNode.byteLength).toEqual(14);
            });

            it("first byte - opcode - should be 34", function() {
                expect(view.getUint8(0)).toEqual(34);
            });

            it("second byte - message lenght - should be 14 ", function() {
                expect(view.getUint8(1)).toEqual(14);
            });

            it("third byte nodeId should be 0 for this test ", function() {
                expect(view.getUint32(2)).toEqual(0);
            });

            it("third byte nodeId should be 0 for this test ", function() {
                expect(view.getUint32(2)).toEqual(0);
            });

            it("version (byte 7) should be 0 as not supported ", function() {
                expect(view.getUint32(6)).toEqual(0);
            });

            it("CRC32 (byte 11) should be 0 as not supported  ", function() {
                expect(view.getUint32(10)).toEqual(0);
            });



        });


    });


});
