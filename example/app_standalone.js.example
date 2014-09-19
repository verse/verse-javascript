/* global console, verse */

(function(console, verse, undefined) {
    'use strict';

    var config,  dataHandler;

    console.log(verse);

   
    dataHandler = function dataHandler (data) {
        if (data.CMD === 'NODE_CREATE') {
            verse.subscribeNode(data.NODE_ID);
            console.log('subscribed node ' + data.NODE_ID);
        }
        else if (data.CMD === 'TAG_GROUP_CREATE') {
            verse.subscribeTagGroup(data.NODE_ID, data.TAG_GROUP_ID);
            console.info('subscribed tagGroup nodeId =' + data.NODE_ID + ' tagGroupId = ' + data.TAG_GROUP_ID);
        }
        else if (data.CMD === 'LAYER_CREATE') {
            verse.subscribeLayer(data.NODE_ID, data.LAYER_ID);
            console.info('subscribed Layer nodeId =' + data.NODE_ID + ' layerId = ' + data.LAYER_ID);
        }
        else {
            console.log(data);
        }
    };


    config = {
        uri: 'ws://verse.tul.cz:23456',
        version: 'v1.verse.tul.cz',
        username: 'albert',
        passwd: '3jlkjooipoklkhlhlka',
        dataCallback: dataHandler,
        connectionTerminatedCallback: function(event) {
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

    verse.init(config);

    console.info(verse);

    
    

})(console, verse);