/* jshint browser: true*/
/* globals define*/


define(['request', 'response', 'negotiation'], function(request, response, negotiation) {
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
            var buf;
            console.log('[Connected] ' + event.code);
            buf = request.handshake(config.username);
            my_webscoket.send(buf);
        },

        onMessage: function onMessage(message, config) {
            var response_data;

            if (message.data instanceof ArrayBuffer) {
                if (!response.checkHeader(message.data)) {
                    my_webscoket.close();
                    return;
                }

                response_data = response.parse(message.data);
                console.info(response_data);

                response_data.forEach(function(cmd) {
                    if (cmd.CMD === 'auth_passwd') {
                        wsocket.userAuthData(config);
                    } else if (cmd.CMD === 'auth_succ')  {
                        wsocket.confirmHost(response_data);
                    }
                });
            }
        },

        userAuthData: function userAuthData(config) {
            var buf = request.userAuth(config.username, config.passwd);
            /* Send the blob */
            my_webscoket.send(buf);
        },

        confirmHost: function confirmHost(response_data) {
            var buf = negotiation.url(negotiation.CHANGE_R, my_webscoket.url);

            buf = request.buffer_push(buf, negotiation.token(negotiation.CONFIRM_R, response_data[1].VALUE));
            buf = request.buffer_push(buf, negotiation.token(negotiation.CHANGE_R, '^DD31*$cZ6#t'));
            buf = request.buffer_push(buf, negotiation.ded(negotiation.CONFIRM_L, response_data[2].VALUE));
            
            buf = request.message(buf);
            /* Send the blob */
            my_webscoket.send(buf);
        }
    };

    return wsocket;

});
