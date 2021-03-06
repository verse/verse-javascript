/*
 * Verse Websocket Asynchronous Module 
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

/* globals ArrayBuffer, define */

define(function() {
    'use strict';


    var user = {


        /*
        * Parse received buffer for avatar and user id
        */

        getUserInfo: function getUserInfo(receivedView, bufferPosition) {
            return {
                CMD: 'USER_AUTH_SUCCESS',
                USER_ID: receivedView.getUint16(bufferPosition + 2),
                AVATAR_ID: receivedView.getUint32(bufferPosition + 4)
            };
        },

        
        /*
         * Pack command for user authentication
         * @param name
         * @param method
         * @param passwd
         */
        auth: function(name, method, passwd) {
            var i;

            /* Fill buffer with data of Verse header and user_auth
             * command */
            var cmdLen;

            if (method === 1) {
                cmdLen = 1 + 1 + 1 + name.length + 1;
            } else if (method === 2) {
                cmdLen = 1 + 1 + 1 + name.length + 1 + 1 + passwd.length;
            } else {
                return null;
            }

            var buf = new ArrayBuffer(cmdLen);
            var view = new DataView(buf);

            /* Pack OpCode of user_auth command */
            view.setUint8(0, 7);
            /* Pack length of the command */
            view.setUint8(1, cmdLen);

            /* Pack length of string */
            view.setUint8(2, name.length);
            /* Pack the string of the username */
            for (i = 0; i < name.length; i++) {
                view.setUint8(3 + i, name.charCodeAt(i));
            }

            /* Pack method type */
            view.setUint8(3 + name.length, method);

            /* Pack auth data */
            if (method === 2) {
                /* Pack password length */
                view.setUint8(3 + name.length + 1, passwd.length);
                /* Pack the string of the password */
                for (i = 0; i < passwd.length; i++) {
                    view.setUint8(3 + name.length + 2 + i, passwd.charCodeAt(i));
                }
            }

            return buf;
        }
    };

    return user;

});
