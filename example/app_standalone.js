/* global console, verse, config */

(function(console, verse, config) {
    'use strict';

    var settings, nodeHandler, tagHandler, tagGroupHandler, layerHandler, userID, avatarID;
    var testNodeId, testTagGroupId, testLayerId, testTagId;
    var prio = 128;

    nodeHandler = function nodeHandler(data) {
        data.forEach(function(cmd) {
            console.log(cmd);
            if (cmd.CMD === 'NODE_CREATE') {
                // Subscribe to every node
                verse.nodeSubscribe(prio, cmd.NODE_ID);
                console.log('subscribed node ' + cmd.NODE_ID);
                // Test creating new node, when node of avatar was created by server
                if (cmd.NODE_ID === avatarID) {
                    // Create node for testing (creating tag groups, layers, etc.)
                    verse.nodeCreate(prio, userID, avatarID, 2000);
                    console.log('creating node with custom_type: 2000');
                    // Create node for testing destroying node
                    verse.nodeCreate(prio, userID, avatarID, 2001);
                    console.log('creating node with custom_type: 2001');
                }
                // Test of creating new tag group and layer
                if (cmd.PARENT_ID === avatarID && cmd.CUSTOM_TYPE === 2000) {
                    // Save node_id of test node (node created by this client with custom_type 2000)
                    testNodeId = cmd.NODE_ID;
                    // Create tag group for testing tag commands
                    verse.tagGroupCreate(prio, cmd.NODE_ID, 3000);
                    console.log('creating tag group with custom_type: 3000');
                    // Create node for testing destroying tag group
                    verse.tagGroupCreate(prio, cmd.NODE_ID, 3001);
                    console.log('creating tag group with custom_type: 3001');
                    // Create layer for testing layer commands
                    verse.layerCreate(prio, cmd.NODE_ID, null, 'UINT32', 2, 4000);
                    console.log('creating layer with custom_type: 4000');
                    // Create layer for testing destroying layer
                    verse.layerCreate(prio, cmd.NODE_ID, null, 'UINT32', 2, 4001);
                    console.log('creating layer with custom_type: 4001');
                }
                // Test of destroying existing node on the server
                if (cmd.PARENT_ID === avatarID && cmd.CUSTOM_TYPE === 2001) {
                    verse.nodeDestroy(prio, cmd.NODE_ID);
                    console.log('destroying node with custom_type: 2001');
                }
            }
        });
    };

    tagGroupHandler = function tagGroupHandler(data) {
        data.forEach(function(cmd) {
            console.log(cmd);
            if (cmd.CMD === 'TAG_GROUP_CREATE') {
                // Subscribe to every tag group
                verse.tagGroupSubscribe(prio, cmd.NODE_ID, cmd.TAG_GROUP_ID);
                console.info('subscribed tagGroup nodeId =' + cmd.NODE_ID + ' tagGroupId = ' + cmd.TAG_GROUP_ID);
                // Test of creating new tags
                if (cmd.NODE_ID === testNodeId && cmd.CUSTOM_TYPE === 3000) {
                    // Save tag group ID of test tag group
                    testTagGroupId = cmd.TAG_GROUP_ID;
                    // Create tag for testing changing value
                    verse.tagCreate(prio, cmd.NODE_ID, cmd.TAG_GROUP_ID, 'UINT32', 2, 3100);
                    console.log('creating new tag with custom type: 3100');
                    // Create tag for testing destroying of tag
                    verse.tagCreate(prio, cmd.NODE_ID, cmd.TAG_GROUP_ID, 'UINT16', 2, 3101);
                    console.log('creating new tag with custom type: 3101');
                }
                // Test of destroying existing tag group
                if (cmd.NODE_ID === testNodeId && cmd.CUSTOM_TYPE === 3001) {
                    verse.tagGroupDestroy(prio, cmd.NODE_ID, cmd.TAG_GROUP_ID);
                    console.log('destroying tag group with custom_type 3001');
                }
            }
        });
    };

    layerHandler = function layerHandler(data) {
        data.forEach(function(cmd) {
            console.log(cmd);
            if (cmd.CMD === 'LAYER_CREATE') {
                verse.layerSubscribe(prio, cmd.NODE_ID, cmd.LAYER_ID);
                console.info('subscribed Layer nodeId = ' + cmd.NODE_ID + ' layerId = ' + cmd.LAYER_ID);
                // Test of setting layer item value
                if (cmd.NODE_ID === testNodeId && cmd.CUSTOM_TYPE === 4000) {
                    testLayerId = cmd.LAYER_ID;
                    verse.layerSetItems(prio, cmd.NODE_ID, cmd.LAYER_ID, 'UINT32', {1: [5, 6], 2: [7, 8]});
                    console.log('sending layer_item_set command for layer with custom type: 4000');
                }
                // Test of destroying existing layer
                if (cmd.NODE_ID === testNodeId && cmd.CUSTOM_TYPE === 4001) {
                    verse.layerDestroy(prio, cmd.NODE_ID, cmd.LAYER_ID);
                }
            }
            if (cmd.CMD === 'LAYER_SET_UINT32') {
                // Test of unseting existing items
                if (cmd.NODE_ID === testNodeId && cmd.LAYER_ID === testLayerId && cmd.ITEM_ID === 1) {
                    verse.layerUnSetItems(prio, cmd.NODE_ID, cmd.LAYER_ID, [1, 2]);
                    console.log('sending layer_item_unset command');
                }
            }
        });
    };

    tagHandler = function tagHandler(data) {
        data.forEach(function(cmd) {
            console.log(cmd);
            if (cmd.CMD === 'TAG_CREATE') {
                // TODO: test of setting tag value
                if (cmd.NODE_ID === testNodeId && cmd.TAG_GROUP_ID === testTagGroupId && cmd.CUSTOM_TYPE === 3100) {
                    testTagId = cmd.TAG_ID;
                    verse.tagSet(prio, cmd.NODE_ID, cmd.TAG_GROUP_ID, cmd.TAG_ID, 'UINT32', [88888, 99999]);
                    console.log('sending tag value for tag with custom type: 3100');
                }
                // Testo of destroying of existing tag group
                if (cmd.NODE_ID === testNodeId && cmd.TAG_GROUP_ID === testTagGroupId && cmd.CUSTOM_TYPE === 3101) {
                    verse.tagDestroy(prio, cmd.NODE_ID, cmd.TAG_GROUP_ID, cmd.TAG_ID);
                    console.log('destroying tag with custom type: 3101');
                }
            }
        });
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
