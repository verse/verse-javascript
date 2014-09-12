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


define(['request', 'response', 'negotiation', 'node', 'user', 'taggroup'], function(request, response, negotiation, node, user, tagGroup) {
    'use strict';
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    var myWebscoket,
        wsocket,
        onSocketMessage,
        onSocketError,
        onSocketConnect,
        onSocketClose,
        userAuthNone,
        userInfo = {},
        confirmHost,
        userAuthData;


    window.onbeforeunload = function() {
        myWebscoket.onclose = function() {}; // disable onclose handler first
        myWebscoket.close();
    };

   

    /*
     *   hadler for websocket error event
     */
    onSocketError = function onSocketError(event) {
        console.error('Error:' + event.data);
    };

    /*
     *  hadler for websocket connect
     * @param event
     * @param config object
     */
    onSocketConnect = function onSocketConnect(event, config) {
        console.log('[Connected] ' + event.code);
        userAuthNone(config);
    };

    /*
     *  hadler for websocket connection close
     * @param event
     * @param config object
     */
    onSocketClose = function onSocketClose(event, config) {
        if (config.connectionTerminatedCallback && typeof config.connectionTerminatedCallback === 'function') {
            config.connectionTerminatedCallback(event);
        }
    };

    /*
     * First step of negotiation process
     * Send command user auth with type NONE
     */

    userAuthNone = function userAuthNone(config) {
        var buf = user.auth(config.username, 1, '');
        buf = request.message(buf);
        myWebscoket.send(buf);
    };

    /*
     * Second step of negotiation process
     * Send command user auth with type PASSWORD
     */

    userAuthData = function userAuthData(config) {

        var buf = user.auth(config.username, 2, config.passwd);
        buf = request.message(buf);
        myWebscoket.send(buf);
    };

    /*
     * confirm values send by server to finish the negotitation process
     * @param responseData list of objects
     */

    confirmHost = function confirmHost(responseData) {
        var buf = negotiation.url(negotiation.CHANGE_R, myWebscoket.url);
        buf = request.buffer_push(buf, negotiation.token(negotiation.CONFIRM_R, responseData[1].VALUE));
        buf = request.buffer_push(buf, negotiation.token(negotiation.CHANGE_R, '^DD31*$cZ6#t'));
        buf = request.buffer_push(buf, negotiation.ded(negotiation.CONFIRM_L, responseData[2].VALUE));

        buf = request.message(buf);

        myWebscoket.send(buf);
    };

     /*
     * handler for received message
     * @param message
     * @param config object
     */
    onSocketMessage = function onSocketMessage(message, config) {
        var responseData;

        if (message.data instanceof ArrayBuffer) {
            if (!response.checkHeader(message.data)) {
                myWebscoket.close();
                return;
            }

            responseData = response.parse(message.data);

            responseData.forEach(function(cmd) {
                if (cmd.CMD === 'auth_passwd') {
                    userAuthData(config);
                } else if (cmd.CMD === 'auth_succ') {
                    confirmHost(responseData);
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


    /*
     * public API of Verse Websocket module
     */
    wsocket = {
        init: function(config) {

            console.info('Connecting to URI:' + config.uri + ' ...');

            myWebscoket = new WebSocket(config.uri, config.version);
            myWebscoket.binaryType = 'arraybuffer';

            myWebscoket.addEventListener('error', onSocketError);
            myWebscoket.addEventListener('close', onSocketClose);

            myWebscoket.addEventListener('open', function(evnt) {
                onSocketConnect(evnt, config);
            });
            myWebscoket.addEventListener('message', function(msg) {
                onSocketMessage(msg, config);
            });
        },

        /*
        * subscribe node on server
        * @param nodeId int
        */

        subscribeNode: function subscribeNode(nodeId) {
            var buf = node.subscribe(nodeId);
            buf = request.message(buf);
            myWebscoket.send(buf);

        },

        /*
        * subscribe tag_group on server
        * @param nodeId int32
        * @param tagGroupId int16
        */

        subscribeTagGroup: function subscribeNode(nodeId, tagGroupId) {
            var buf = tagGroup.subscribe(nodeId, tagGroupId);
            buf = request.message(buf);
            myWebscoket.send(buf);

        }

    };




    return wsocket;

});
