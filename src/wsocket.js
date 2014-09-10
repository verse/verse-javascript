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

/* jshint browser: true */
/* globals define */


define(['request', 'response', 'negotiation', 'node', 'user'], function(request, response, negotiation, node, user) {
    'use strict';
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    var myWebscoket, wsocket, onMessage, onSocketError, onSocketConnect, onSocketClose;
    var userInfo = {};


    window.onbeforeunload = function() {
        myWebscoket.onclose = function() {}; // disable onclose handler first
        myWebscoket.close();
    };

    /*
     * handler for received message
     * @param message
     * @param config object
     */

    onMessage = function onMessage(message, config) {
        var response_data;

        if (message.data instanceof ArrayBuffer) {
            if (!response.checkHeader(message.data)) {
                myWebscoket.close();
                return;
            }

            response_data = response.parse(message.data);

            response_data.forEach(function(cmd) {
                if (cmd.CMD === 'auth_passwd') {
                    wsocket.userAuthData(config);
                } else if (cmd.CMD === 'auth_succ') {
                    wsocket.confirmHost(response_data);
                    userInfo = cmd;
                } else if ((cmd.CMD === 'CONFIRM_R') && (cmd.FEATURE === 'HOST_URL')) {
                    wsocket.subscribeNode(0);
                    /* pass the user info to callback function */
                    config.connectionAcceptedCallback(userInfo);
                } else {
                    /* call the callback function from config */
                    config.dataCallback(cmd);
                }

            });
        }
    };

    onSocketError = function onSocketError(event) {
        console.error('Error:' + event.data);
    };

    onSocketConnect = function onSocketConnect(event, config) {
        console.log('[Connected] ' + event.code);
        wsocket.userAuthNone(config);
    };

    onSocketClose = function onSocketClose(event, config) {
        if (config.connectionTerminatedCallback && typeof config.connectionTerminatedCallback === 'function') {
            config.connectionTerminatedCallback(event);
        }
    };


    wsocket = {
        init: function(config) {
            console.info(config);
            console.info('Connecting to URI:' + config.uri + ' ...');
            myWebscoket = new WebSocket(config.uri, config.version);
            myWebscoket.binaryType = 'arraybuffer';

            myWebscoket.addEventListener('error', onSocketError);
            myWebscoket.addEventListener('close', onSocketClose);

            myWebscoket.addEventListener('open', function(evnt) {
                onSocketConnect(evnt, config);
            });
            myWebscoket.addEventListener('message', function(msg) {
                onMessage(msg, config);
            });
        },

        userAuthNone: function userAuthNone(config) {
            /* Send command user auth with type NONE */
            var buf = user.auth(config.username, 1, '');
            buf = request.message(buf);
            myWebscoket.send(buf);
        },

        userAuthData: function userAuthData(config) {
            /* Send command user auth with type PASSWORD */
            var buf = user.auth(config.username, 2, config.passwd);
            buf = request.message(buf);
            myWebscoket.send(buf);
        },

        confirmHost: function confirmHost(response_data) {
            var buf = negotiation.url(negotiation.CHANGE_R, myWebscoket.url);
            buf = request.buffer_push(buf, negotiation.token(negotiation.CONFIRM_R, response_data[1].VALUE));
            buf = request.buffer_push(buf, negotiation.token(negotiation.CHANGE_R, '^DD31*$cZ6#t'));
            buf = request.buffer_push(buf, negotiation.ded(negotiation.CONFIRM_L, response_data[2].VALUE));

            buf = request.message(buf);

            myWebscoket.send(buf);
        },

        subscribeNode: function subscribeNode(nodeId) {
            var buf = node.subscribe(nodeId);
            buf = request.message(buf);
            myWebscoket.send(buf);

        }
    };




    return wsocket;

});
