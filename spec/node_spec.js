"use strict";

/*globals define, ArrayBuffer*/

define(["node"], function(node) {

    describe("Node commands test suite", function() {
        var testNode, view, mes_len, mock_buff, mockView, result;


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

         describe("got Node Create from server", function() {
            beforeEach(function() {
                
                mes_len = 15;
                mock_buff = new ArrayBuffer(mes_len);
                view = new DataView(mock_buff);

                view.setUint8(0, 32); //node create command
                view.setUint8(1, 0); //share 0
                view.setUint16(3, 125); //user ID
                view.setUint32(5, 0); //parent ID
                view.setUint32(9, 1); //node ID 
                view.setUint16(13, 62);//custom type  

            });

            it("command should be parsed out as NODE_CREATE, USERID = 125 object", function() {
                
                mockView = new DataView(mock_buff);
                result = node.getNodeValues(32, mockView);
                
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


    });


});
