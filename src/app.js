/* jshint devel: true, unused: true */
/* global require */

/*
/ Sample app
/ add your verse websocket server uri and version
/ and your credentials for the server
/ 
/ then use bower install - see http://bower.io/ for further details
*/


require(['wsocket'], function(wsocket) {
    'use strict';

    var config;

    config = {
        uri: 'ws://verse.example.org:54321',
        version: 'v1.verse.tul.cz',
        username: 'verse_user',
        passwd: 'verse_passwd'
    };

    wsocket.init(config);


});
