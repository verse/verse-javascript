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

/* jshint devel: true, unused: true */
/* global require */

/*
/ Sample app
/ add your verse websocket server uri and version
/ and your credentials for the server
/ 
/ then use bower install - see http://bower.io/ for further details
*/


require(['wsocket'], function(wsocket) {
    'use strict';

    var config;

    config = {
        uri: 'ws://verse.example.org:54321',
        version: 'v1.verse.tul.cz',
        username: 'verse_user',
        passwd: 'verse_passwd',
        dataCallback: function(data) {
            /* 
            * callback function for data handling 
            *  every command send by server comes here parsed to data object
            * data object example 
            * Object {CMD: "NODE_PERMISIONS", SHARE: 0, USER_ID: 65535, PERMISSIONS: 1, NODE_ID: 0} 
             */
            }
            console.info(data);
        },
        connectionTerminatedCallback:  function(event) {
            /*
            *  callback function for end of session handling
            * called when onClose websocket event is fired
            */
            console.info('[Disconnected], Code:' + event.code + ', Reason: ' + event.reason);
        },
        connectionAcceptedCallback: function(userInfo) {
            /*
            *  callback function for connection accepted event
            * called when negotiation process is finished
            * @param userInfo object 
            */
            console.info('User ID: ' + userInfo.USER_ID);
            console.info('Avatar ID: ' + userInfo.AVATAR_ID);
        }

    };

    wsocket.init(config);


});
