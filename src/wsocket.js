/* jshint browser: true*/
/* globals define*/


define(['request', 'response', 'negotiation', 'node'], function(request, response, negotiation, node) {
    'use strict';
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    var my_webscoket;

    console.log(response);

    window.onbeforeunload = function() {
        my_webscoket.onclose = function() {}; // disable onclose handler first
        my_webscoket.close();
    };

    var wsocket = {
        init: function(config) {
            console.log('Connecting to URI:' + config.uri + ' ...');
            my_webscoket = new WebSocket(config.uri, config.version);
            my_webscoket.binaryType = 'arraybuffer';

            my_webscoket.addEventListener('error', wsocket.onError);
            my_webscoket.addEventListener('close', wsocket.onClose);

            my_webscoket.addEventListener('open', function(evnt) {
                wsocket.onConnect(evnt, config);
            });
            my_webscoket.addEventListener('message', function(msg) {
                wsocket.onMessage(msg, config);
            });
        },

        onError: function onError(event) {
            console.log('Error:' + event.data);
        },

        onClose: function onClose(event) {
            console.log('[Disconnected], Code:' + event.code + ', Reason: ' + event.reason);
        },

        onConnect: function onConnect(event, config) {
            console.log('[Connected] ' + event.code);
            wsocket.userAuthNone(config);
        },

        onMessage: function onMessage(message, config) {
            var response_data;

            if (message.data instanceof ArrayBuffer) {
                if (!response.checkHeader(message.data)) {
                    my_webscoket.close();
                    return;
                }

                console.info(message);
                response_data = response.parse(message.data);
                console.info(response_data);

                response_data.forEach(function(cmd) {
                    if (cmd.CMD === 'auth_passwd') {
                        wsocket.userAuthData(config);
                    } else if (cmd.CMD === 'auth_succ')  {
                        wsocket.confirmHost(response_data);
                    } else if ((cmd.CMD === 'CONFIRM_R') && (cmd.FEATURE === 'HOST_URL')) {
                        wsocket.subscribeNode(0);
                    }
                });
            }
        },

        userAuthNone: function userAuthNone(config) {
            var buf = request.handshake(config.username);
            my_webscoket.send(buf);
        },

        userAuthData: function userAuthData(config) {
            var buf = request.userAuth(config.username, config.passwd);
            my_webscoket.send(buf);
        },

        confirmHost: function confirmHost(response_data) {
            var buf = negotiation.url(negotiation.CHANGE_R, my_webscoket.url);

            buf = request.buffer_push(buf, negotiation.token(negotiation.CONFIRM_R, response_data[1].VALUE));
            buf = request.buffer_push(buf, negotiation.token(negotiation.CHANGE_R, '^DD31*$cZ6#t'));
            buf = request.buffer_push(buf, negotiation.ded(negotiation.CONFIRM_L, response_data[2].VALUE));
            
            buf = request.message(buf);

            my_webscoket.send(buf);
        },

        subscribeNode: function subscribeNode(nodeId) {
            var buf = node.subscribe(nodeId);
            buf = request.message(buf);
            my_webscoket.send(buf);

        }
    };

    return wsocket;

});
