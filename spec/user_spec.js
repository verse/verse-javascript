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

define(['user'], function(user) {

    describe('User module', function() {
        var view, auth, uname, passwd;


        describe('userAuthNone - first step of auth algorithm', function() {
            beforeEach(function() {
                uname = 'albert';
                auth = user.auth(uname, 1, '');
                view = new DataView(auth);
            });

            it('The length of userAuthNone should be 10 for name=albert ', function() {
                expect(auth.byteLength).toEqual(10);
            });

            it('The OpCode of the command should be 7', function() {
                expect(view.getUint8(0)).toEqual(7);
            });

            it('The second byte - command length - should be 10 for albert', function() {
                expect(view.getUint8(1)).toEqual(10);
            });

            it('Pack length of string should be 6 for albert', function() {
                expect(view.getUint8(2)).toEqual(6);
            });

            it('First char of packed string should a', function() {
                expect(view.getUint8(3)).toEqual('a'.charCodeAt(0));
            });

            it('The type of auth method should be 1', function() {
                expect(view.getUint8(9)).toEqual(1);
            });

        });

        describe('userAuthData - auth with username and passwd', function() {
            beforeEach(function() {
                uname = 'albert';
                passwd = '12345';
                auth = user.auth(uname, 2, passwd);
                view = new DataView(auth);
            });

            it('The length of auth should be 16 = 2 (cmd_header) + 1 + (string length) + 6 (albert) + 1 + 1 (string length) + 5 (12345)', function() {
                expect(auth.byteLength).toEqual(16);
            });

            it('The OpCode of the command should be 7', function() {
                expect(view.getUint8(0)).toEqual(7);
            });

            it('The length of the command should be 16', function() {
                expect(view.getUint8(1)).toEqual(16);
            });

            it('Pack length of the username (albert) should be 6', function() {
                expect(view.getUint8(2)).toEqual(uname.length);
            });

            it('First char of packed username should be a', function() {
                expect(view.getUint8(3)).toEqual('a'.charCodeAt(0));
            });

            it('The type of auth method should be 2', function() {
                expect(view.getUint8(9)).toEqual(2);
            });

            it('The length of the passwd should be 5', function() {
                expect(view.getUint8(10)).toEqual(passwd.length);
            });

            it('First char of packed passwd should be 1', function() {
                expect(view.getUint8(11)).toEqual('1'.charCodeAt(0));
            });

            it('Last char of packed passwd should be 5', function() {
                expect(view.getUint8(15)).toEqual('5'.charCodeAt(0));
            });

        });


         describe('got user info from server', function() {
            var result, messageLen, opCode, mockBuffer, mockView;

            beforeEach(function() {
                messageLen = 10;
                opCode = 9;
                mockBuffer = new ArrayBuffer(messageLen);
                view = new DataView(mockBuffer);

                view.setUint8(0, opCode);
                view.setUint8(1, messageLen);
                view.setUint16(2, 135);
                view.setUint32(4, 185);   

            });

            it('command should be parsed out as CONFIRM_R, CCID, 18 object', function() {

                mockView = new DataView(mockBuffer);
                result = user.getUserInfo(mockView, 0);

                expect(result).toEqual({
                    CMD: 'USER_AUTH_SUCCESS',
                    USER_ID: 135,
                    AVATAR_ID: 185
                });
            });
        });




    });


});