/* jshint devel: true, unused: true */
/* global require, requirejs */
/*
requirejs.config({
    baseUrl: '../build/',
    paths: {
        verse: 'verse.amd.min',
        config: '../example/config'
    }
});
*/

requirejs.config({
    baseUrl: '../src/',
    paths: {
        verse: 'verse',
        config: '../example/config'
    }
});

require(['verse', 'config'], function(verse, config) {
    'use strict';

    var settings, nodeHandler, tagHandler, tagGroupHandler, layerHandler;


    nodeHandler = function nodeHandler(data) {
        data.forEach(function(cmd) {
            if (cmd.CMD === 'NODE_CREATE') {
                verse.nodeSubscribe(cmd.NODE_ID);
                console.log('subscribed node ' + cmd.NODE_ID);
            } else {
                console.log(cmd);
            }
        });

    };

    tagGroupHandler = function tagGroupHandler(data) {
        data.forEach(function(cmd) {
            if (cmd.CMD === 'TAG_GROUP_CREATE') {
                verse.tagGroupSubscribe(cmd.NODE_ID, cmd.TAG_GROUP_ID);
                console.info('subscribed tagGroup nodeId =' + cmd.NODE_ID + ' tagGroupId = ' + cmd.TAG_GROUP_ID);
            } else {
                console.log(cmd);
            }
        });

    };

    layerHandler = function layerHandler(data) {
        data.forEach(function(cmd) {
            if (cmd.CMD === 'LAYER_CREATE') {
                verse.layerSubscribe(cmd.NODE_ID, cmd.LAYER_ID);
                console.info('subscribed Layer nodeId =' + cmd.NODE_ID + ' layerId = ' + cmd.LAYER_ID);
            } else {
                console.log(cmd);
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

});
