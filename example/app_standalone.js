/* global console, verse, config */

(function(console, verse, config) {
    'use strict';

    var settings, nodeHandler, tagHandler, tagGroupHandler, layerHandler, userID, avatarID;


    nodeHandler = function nodeHandler(data) {
        data.forEach(function(cmd) {
            console.log(cmd);
            if (cmd.CMD === 'NODE_CREATE') {
                verse.nodeSubscribe(cmd.NODE_ID);
                console.log('subscribed node ' + cmd.NODE_ID);
                // Test creating new node, when node of avatar was created by server
                if (cmd.NODE_ID === avatarID) {
                    verse.nodeCreate(userID, avatarID, 2000);
                    console.log('creating node with custom_type: 2000');
                    verse.nodeCreate(userID, avatarID, 2001);
                    console.log('creating node with custom_type: 2001');
                }
                // Test of destroying existing node on the server
                if (cmd.PARENT_ID === avatarID && cmd.CUSTOM_TYPE === 2001) {
                    verse.nodeDestroy(cmd.NODE_ID);
                    console.log('destroying node with custom_type: 2001');
                }
            }
        });
    };

    tagGroupHandler = function tagGroupHandler(data) {
        data.forEach(function(cmd) {
            console.log(cmd);
            if (cmd.CMD === 'TAG_GROUP_CREATE') {
                verse.tagGroupSubscribe(cmd.NODE_ID, cmd.TAG_GROUP_ID);
                console.info('subscribed tagGroup nodeId =' + cmd.NODE_ID + ' tagGroupId = ' + cmd.TAG_GROUP_ID);
            }
        });
    };

    layerHandler = function layerHandler(data) {
        data.forEach(function(cmd) {
            console.log(cmd);
            if (cmd.CMD === 'LAYER_CREATE') {
                verse.layerSubscribe(cmd.NODE_ID, cmd.LAYER_ID);
                console.info('subscribed Layer nodeId =' + cmd.NODE_ID + ' layerId = ' + cmd.LAYER_ID);
            }
        });
    };

    tagHandler = function tagHandler(data) {
        console.log(data);
    };



    settings = {
        uri: config.uri,
        version: config.version,
        username: config.username,
        passwd: config.passwd,
        nodeCallback: nodeHandler,
        layerCallback: layerHandler,
        tagCallback: tagHandler,
        tagGroupCallback: tagGroupHandler,
        connectionTerminatedCallback: function(event) {
            /*
             *  callback function for end of session handling
             * called when onClose websocket event is fired
             */
            console.info(event);
            console.info('Connection Closed  Code: %s, Reason: %s', event.code, event.reason);
        },
        connectionAcceptedCallback: function(userInfo) {
            /*
             *  callback function for connection accepted event
             * called when negotiation process is finished
             * @param userInfo object
             */
            console.info('User ID: ' + userInfo.USER_ID);
            console.info('Avatar ID: ' + userInfo.AVATAR_ID);
            userID = userInfo.USER_ID;
            avatarID = userInfo.AVATAR_ID;
        },
        errorCallback: function(error) {
            /*
             * Error callback
             * called when user auth fails
             * @param error string command name
             */
            console.error(error);
        }

    };

    verse.init(settings);

})(console, verse, config);
