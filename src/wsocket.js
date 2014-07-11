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

            my_webscoket.addEventListener('open', function(e) {
                wsocket.onConnect(e, config.username);
            });
            my_webscoket.addEventListener('error', wsocket.onError);
            my_webscoket.addEventListener('close', wsocket.onClose);
            my_webscoket.addEventListener('message', function(e) {
                wsocket.onMessage(e, config.username, config.passwd);
            });

        },



        onConnect: function onConnect(event, username) {
            var buf;
            console.log('[Connected] ' + event.code);
            buf = request.handshake(username);
            my_webscoket.send(buf);
            console.log('handshake send');
        },

        onError: function onError(event) {
            console.log('Error:' + event.data);
        },

        onClose: function onClose(event) {
            console.log('[Disconnected], Code:' + event.code + ', Reason: ' + event.reason);
        },

        onMessage: function onMessage(message, username, passwd) {
            var buf, response_data;
            if (message.data instanceof ArrayBuffer) {
                if (!response.checkHeader(message.data)) {
                    /*bad protocl version - close conection*/
                    my_webscoket.close();
                    return;
                }

                response_data = response.parse(message.data);
                response_data.forEach(function(cmd) {
                    if (cmd.CMD === 'auth_passwd') {
                        buf = request.userAuth(username, passwd);
                        /* Send the blob */
                        my_webscoket.send(buf);
                        console.log('heslo zaslano');
                    } else if (cmd.CMD === 'auth_succ')  {
                        wsocket.confirmHost(response_data);
                    }
                });


            }
        },

        confirmHost: function confirmHost(response_data) {
            var paket = negotiation.url(negotiation.CHANGE_R, 'ws://verse.tul.cz:23456');
            console.info(paket); 
            /*
            my_webscoket.send(paket);
            my_webscoket.send(negotiation.token(negotiation.CONFIRM_R, response_data[1].TOKEN));
            my_webscoket.send(negotiation.token(negotiation.CHANGE_R, '^DD31*$cZ6#t'));
            my_webscoket.send(negotiation.ded(negotiation.CONFIRM_L, response_data[2].DED));
            console.info(response_data[2].DED);
            */
        }


    };

    return wsocket;

});
