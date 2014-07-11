"use strict";

/*globals define, ArrayBuffer*/
define(["response"], function(response) {

    describe("Response", function() {
        var mock_buff, view;


        describe("parse", function() {
            beforeEach(function() {
                mock_buff = new ArrayBuffer(8);
                view = new DataView(mock_buff);
                /*message lenght*/
                view.setUint16(2, 8);
                /* command usr_auth_fail */
                view.setUint8(4, 8);
                /* command length*/
                view.setUint8(5, 3);
                /* command method*/
                view.setUint8(6, 2);
            });

            it("creates a mock buffer object", function() {
                expect(mock_buff).toBeDefined();
            });

            it("first value in result array should be command auth password for password mock message", function() {
                var result = response.parse(mock_buff);

                expect(result[0]).toEqual({CMD: "auth_passwd"});
            });
            

        });




    });
});
