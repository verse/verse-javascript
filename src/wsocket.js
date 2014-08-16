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


define(['request', 'response', 'negotiation', 'node'], function(request, response, negotiation, node) {
    'use strict';
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    var myWebscoket;

    console.log(response);

    window.onbeforeunload = function() {
        myWebscoket.onclose = function() {}; // disable onclose handler first
        myWebscoket.close();
    };

    var wsocket = {
        init: function(config) {
            console.log('Connecting to URI:' + config.uri + ' ...');
            myWebscoket = new WebSocket(config.uri, config.version);
            myWebscoket.binaryType = 'arraybuffer';

            myWebscoket.addEventListener('error', wsocket.onError);
            myWebscoket.addEventListener('close', wsocket.onClose);

            myWebscoket.addEventListener('open', function(evnt) {
                wsocket.onConnect(evnt, config);
            });
            myWebscoket.addEventListener('message', function(msg) {
                wsocket.onMessage(msg, config);
            });
        },

        onError: function onError(event) {
            console.log('Error:' + event.data);
        },

        onClose: function onClose(event) {
            console.log('[Disconnected], Code:' + event.code + ', Reason: ' + event.reason);
            /* TODO: Call callback function 'connect_terminate' defined by developer */
        },

        onConnect: function onConnect(event, config) {
            console.log('[Connected] ' + event.code);
            wsocket.userAuthNone(config);
        },

        onMessage: function onMessage(message, config) {
            var response_data;

            if (message.data instanceof ArrayBuffer) {
                if (!response.checkHeader(message.data)) {
                    myWebscoket.close();
                    return;
                }

                response_data = response.parse(message.data);
                console.info(response_data);

                response_data.forEach(function(cmd) {
                    if (cmd.CMD === 'auth_passwd') {
                        wsocket.userAuthData(config);
                    } else if (cmd.CMD === 'auth_succ')  {
                        wsocket.confirmHost(response_data);
                    } else if ((cmd.CMD === 'CONFIRM_R') && (cmd.FEATURE === 'HOST_URL')) {
                        /* TODO: Call callback function 'connect_accept' defined by developer */
                        wsocket.subscribeNode(0);
                    }
                });
            }
        },

        userAuthNone: function userAuthNone(config) {
            /* Send command user auth with type NONE */
            var buf = request.userAuth(config.username, 1, "");
            buf = request.message(buf);
            myWebscoket.send(buf);
        },

        userAuthData: function userAuthData(config) {
            /* Send command user auth with type PASSWORD */
            var buf = request.userAuth(config.username, 2, config.passwd);
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
