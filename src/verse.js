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

/* jshint browser: true */
/* globals define */


define('verse', ['request', 'response', 'negotiation', 'node', 'user', 'taggroup', 'layer'],
    function(request, response, negotiation, node, user, tagGroup, layer) {

        'use strict';
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        var myWebscoket,
            verse,
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
        onSocketError = function onSocketError(event, config) {
            console.error('Websocket Error');
        };

        /*
         *  hadler for websocket connect
         * @param event
         * @param config object
         */
        onSocketConnect = function onSocketConnect(event, config) {
            userAuthNone(config);
        };

        /*
         *  hadler for websocket connection close
         * @param event
         * @param config object
         */
        onSocketClose = function onSocketClose(event, config) {
            if (config && config.connectionTerminatedCallback && typeof config.connectionTerminatedCallback === 'function') {
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

        confirmHost = function confirmHost(hostInfo) {
            var buf = negotiation.url(negotiation.CHANGE_R, myWebscoket.url);
            buf = request.buffer_push(buf, negotiation.token(negotiation.CONFIRM_R, hostInfo[1].VALUE));
            buf = request.buffer_push(buf, negotiation.token(negotiation.CHANGE_R, '^DD31*$cZ6#t'));
            buf = request.buffer_push(buf, negotiation.ded(negotiation.CONFIRM_L, hostInfo[2].VALUE));

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
                
                responseData.NEGO.forEach(function(cmd) {
                    if (cmd.CMD === 'AUTH_PASSWD') {
                        userAuthData(config);
                    } else if (cmd.CMD === 'USER_AUTH_SUCCESS') {
                        confirmHost(responseData.NEGO);
                        userInfo = cmd;
                    } else if (cmd.CMD === 'USER_AUTH_FAILURE') {
                        config.errorCallback(cmd.CMD);
                        myWebscoket.close();
                    } else if ((cmd.CMD === 'CONFIRM_R') && (cmd.FEATURE === 'HOST_URL')) {
                        verse.subscribeNode(0);
                        /* pass the user info to callback function */
                        config.connectionAcceptedCallback(userInfo);
                    } 

                });
                /* call the callbacks from config */
                if (responseData.NODE.length > 0) {
                    config.nodeCallback(responseData.NODE);
                }

                if (responseData.TAG_GROUP.length > 0) {
                    config.tagGroupCallback(responseData.TAG_GROUP);
                }


                if (responseData.TAG.length > 0) {
                    config.tagCallback(responseData.TAG);
                }  

                
                if (responseData.LAYER.length > 0) {
                    config.layerCallback(responseData.LAYER);
                }        

                
            }
        };


        /*
         * public API of Verse Websocket module
         */
        verse = {

            init: function(config) {

                console.info('Connecting to URI:' + config.uri + ' ...');
                try {
                    myWebscoket = new window.WebSocket(config.uri, config.version);
                    myWebscoket.binaryType = 'arraybuffer';

                    myWebscoket.addEventListener('error', function(event){
                        onSocketError(event, config);
                    });
                    
                    myWebscoket.addEventListener('close', function(event){
                        onSocketClose(event, config);
                    });

                    myWebscoket.addEventListener('open', function(evnt) {
                        onSocketConnect(evnt, config);
                    });
                    myWebscoket.addEventListener('message', function(msg) {
                        onSocketMessage(msg, config);
                    });
                } catch (e) {
                    console.error('Sorry, the web socket at "%s" is un-available', config.uri);
                }
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
             * create new node on server
             * @param userId uint16
             * @param avatarId uint32
             * @param customType uint16
             */
            createNode: function createNode(userId, avatarId, customType) {
                var buf = node.create(userId, avatarId, customType);
                buf = request.message(buf);
                myWebscoket.send(buf);
            },

            /*
             * destroy existing node on server
             * @param nodeId uint32
             */
            destroyNode: function destroyNode(nodeId) {
                var buf = node.destroy(nodeId);
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
            },

            /*
             * subscribe layer on server
             * @param nodeId int32
             * @param layerId int16
             */

            subscribeLayer: function subscribeNode(nodeId, layerId) {
                var buf = layer.subscribe(nodeId, layerId);
                buf = request.message(buf);
                myWebscoket.send(buf);
            }

        };




        return verse;

    });
