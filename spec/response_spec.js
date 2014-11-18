/*
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2014 Jiri Vrany, Jiri Hnidek
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

'use strict';

/* globals define, ArrayBuffer */

define(['response'], function(response) {

    describe('Response', function() {
        var mockBuffer, view, messageLen, i, dataString, result;


        describe('parse int message with auth success', function() {
            beforeEach(function() {
                mockBuffer = new ArrayBuffer(8);
                view = new DataView(mockBuffer);
                /* message length */
                view.setUint16(2, 8);
                /* command usr_auth_fail */
                view.setUint8(4, 8);
                /* command length */
                view.setUint8(5, 3);
                /* command method */
                view.setUint8(6, 2);
            });

            it('creates a mock buffer object', function() {
                expect(mockBuffer).toBeDefined();
            });

            it('first value in result array should be command auth password for password mock message', function() {
                result = response.parse(mockBuffer);

                expect(result.NEGO[0]).toEqual({
                    CMD: 'AUTH_PASSWD'
                });
            });

        });


        describe('got change_r with token from server', function() {
            beforeEach(function() {
                var message_type = 4,
                    feature_type = 4;

                dataString = '^DD31*$cZ6#t';

                messageLen = 4 + 3 + 1 + dataString.length;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                /* Verse header starts with version */
                /* First 4 bits are reserved for version of protocol */
                view.setUint8(0, 1 << 4);
                /* The length of the message */
                view.setUint16(2, messageLen);
                /*  message type  */
                view.setUint8(4, message_type);
                /* second byte - message length */
                view.setUint8(5, messageLen - 4);
                /* third byte - feature type */
                view.setUint8(6, feature_type);
                /* fourth byte - length of packed string */
                view.setUint8(7, dataString.length);

                //console.info(dataString);
                /* Pack the dataString */
                for (i = 0; i < dataString.length; i++) {
                    //console.info(dataString[i]);

                    view.setUint8(8 + i, dataString.charCodeAt(i));
                }

            });

            it('command should be parsed out as CHANGE_R', function() {
                result = response.parse(mockBuffer);

                expect(result.NEGO[0]).toEqual({
                    CMD: 'CHANGE_R',
                    FEATURE: 'TOKEN',
                    VALUE: dataString
                });
            });
        });

        describe('got BAD VERSION from server', function() {
            beforeEach(function() {
                var message_type = 8;

                messageLen = 4 + 2;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                /* First 4 bits are reserved for version of protocol */
                view.setUint8(0, 3 << 4);
                view.setUint16(2, messageLen);
                view.setUint8(4, message_type);
                view.setUint8(5, messageLen - 4);

            });

            it('version check should be falsy', function() {
                result = response.checkHeader(mockBuffer);

                expect(result).toBe(false);
            });
        });




        describe('got USER AUTH FAIL from server', function() {
            beforeEach(function() {
                var message_type = 8;

                messageLen = 4 + 2;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                /* First 4 bits are reserved for version of protocol */
                view.setUint8(0, 1 << 4);
                view.setUint16(2, messageLen);
                view.setUint8(4, message_type);
                view.setUint8(5, messageLen - 4);

            });

            it('command should be parsed out as AUTH FAIL', function() {
                result = response.parse(mockBuffer);

                expect(result.NEGO[0]).toEqual({
                    CMD: 'USER_AUTH_FAILURE'
                });
            });

             it('version check should be true', function() {
                result = response.checkHeader(mockBuffer);

                expect(result).toBe(true);
            });
        });



        describe('got negotiation confirm_r  CCID from server', function() {
            beforeEach(function() {
                var message_type = 6,
                    feature_type = 2;

                messageLen = 4 + 3 + 1;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                /* First 4 bits are reserved for version of protocol */
                view.setUint8(0, 1 << 4);
                view.setUint16(2, messageLen);
                view.setUint8(4, message_type);
                view.setUint8(5, messageLen - 4);
                view.setUint8(6, feature_type);
                view.setUint8(7, 18);

            });

            it('command should be parsed out as CONFIRM_R, CCID, 18 object', function() {
                result = response.parse(mockBuffer);

                expect(result.NEGO[0]).toEqual({
                    CMD: 'CONFIRM_R',
                    FEATURE: 'CCID',
                    VALUE: 18
                });
            });
        });

        describe('got user info from server', function() {
            var opCode;

            beforeEach(function() {
                messageLen = 10 + 4;
                opCode = 9;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                /* First 4 bits are reserved for version of protocol */
                view.setUint8(0, 1 << 4);
                view.setUint16(2, messageLen);
                view.setUint8(4, opCode);
                view.setUint8(5, messageLen - 4);
                view.setUint16(6, 858);
                view.setUint32(8, 203);

            });

            it('command should be parsed out as USER_AUTH_SUCCESS object', function() {

                result = response.parse(mockBuffer);

                expect(result.NEGO[0]).toEqual({
                    CMD: 'USER_AUTH_SUCCESS',
                    USER_ID: 858,
                    AVATAR_ID: 203
                });
            });
        });

        describe('got Node Create server', function() {
            var opCode;

            beforeEach(function() {
                messageLen = 15 + 4;
                opCode = 32;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                // First 4 bits are reserved for version of protocol 
                view.setUint8(0, 1 << 4);
                view.setUint16(2, messageLen);
                view.setUint8(4, opCode); //node create command
                view.setUint8(5, messageLen - 4); //mes len
                view.setUint16(7, 125); //user ID
                view.setUint32(9, 0); //parent ID
                view.setUint32(13, 1); //node ID 
                view.setUint16(17, 62); //custom type  

            });

            it('command should be parsed out as NODE_CREATE object', function() {

                result = response.parse(mockBuffer);

                expect(result.NODE[0]).toEqual({
                    CMD: 'NODE_CREATE',
                    SHARE: 0,
                    USER_ID: 125,
                    PARENT_ID: 0,
                    NODE_ID: 1,
                    CUSTOM_TYPE: 62
                });
            });
        });

        describe('got TagGroupCreate from server', function() {

            beforeEach(function() {
                messageLen = 17 + 4;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                // First 4 bits are reserved for version of protocol 
                view.setUint8(0, 1 << 4);
                view.setUint16(2, messageLen);
                view.setUint8(4, 64); //tagGroupCreate command
                view.setUint8(5, 17); //length
                view.setUint8(6, 0); //share is 0
                view.setUint32(7, 115); //Node ID
                view.setUint16(11, 68); //TagGroupID
                view.setUint16(13, 62); //custom type 

            });

            it('command should be parsed out as TAG_GROUP_CREATE object', function() {

                result = response.parse(mockBuffer);

                expect(result.TAG_GROUP[0]).toEqual({
                    CMD: 'TAG_GROUP_CREATE',
                    SHARE: 0,
                    NODE_ID: 115,
                    TAG_GROUP_ID: 68,
                    CUSTOM_TYPE: 62
                });
            });
        });

        describe('got TagCreate from server', function() {

            beforeEach(function() {
                messageLen = 15 + 4;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                // First 4 bits are reserved for version of protocol 
                view.setUint8(0, 1 << 4);
                view.setUint16(2, messageLen);
                view.setUint8(4, 68); //tagCreate command
                view.setUint8(5, 15); //length
                view.setUint8(6, 0); //share is 0
                view.setUint32(7, 6545); //Node ID
                view.setUint16(11, 68); //TagGroupID
                view.setUint16(13, 154); //TagID
                view.setUint8(15, 3); //Data Type
                view.setUint8(16, 5); //Count
                view.setUint16(17, 298); //custom type

            });

            it('command should be parsed out as TAG_CREATE object', function() {

                result = response.parse(mockBuffer);

                expect(result.TAG[0]).toEqual({
                    CMD: 'TAG_CREATE',
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

        describe('got LayerCreate from server', function() {

            beforeEach(function() {
                messageLen = 15 + 4;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                // First 4 bits are reserved for version of protocol 
                view.setUint8(0, 1 << 4);
                view.setUint16(2, messageLen);
                view.setUint8(4, 128); //layer create command
                view.setUint8(5, 15); //length
                view.setUint8(6, 0); //share is 0
                view.setUint32(7, 6545); //Node ID
                view.setUint16(11, 68); //Parent Layer ID
                view.setUint16(13, 154); //Layer ID
                view.setUint8(15, 3); //Data Type
                view.setUint8(16, 5); //Count
                view.setUint16(17, 298); //custom type

            });

            it('command should be parsed out as LAYER_CREATE object', function() {

                result = response.parse(mockBuffer);

                expect(result.LAYER[0]).toEqual({
                    CMD: 'LAYER_CREATE',
                    SHARE: 0,
                    NODE_ID: 6545,
                    PARENT_LAYER_ID: 68,
                    LAYER_ID: 154,
                    DATA_TYPE: 3,
                    COUNT: 5,
                    CUSTOM_TYPE: 298
                });
            });
        });

        describe('got weird command from server', function() {

            beforeEach(function() {
                messageLen = 5 + 4;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                // First 4 bits are reserved for version of protocol 
                view.setUint8(0, 1 << 4);
                view.setUint16(2, messageLen);
                view.setUint8(4, 222); //layer create command
                view.setUint8(5, 5); //length

            });

            it('command should be parsed out as command code and message object', function() {

                result = response.parse(mockBuffer);

                expect(result.NEGO[0]).toEqual({
                    CMD: 222,
                    MESSAGE: '@TODO - opCode not implemented'
                });
            });
        });

    });
});
