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

/* globals define */

define(['message'], function(message) {
    'use strict';

    var node, commands, routines;

    //command codes = opCodes
    commands = {
        32: 'NODE_CREATE',
        33: 'NODE_DESTROY',
        34: 'NODE_SUBSCRIBE',
        35: 'NODE_UNSUBSCRIBE',
        37: 'NODE_LINK',
        38: 'NODE_PERMISSIONS',
        39: 'NODE_UMASK',
        40: 'NODE_OWNER',
        41: 'NODE_LOCK',
        42: 'NODE_UNLOCK',
        43: 'NODE_PRIORITY'
    };

    /*
     * routines - parsing functions for node commands from server
     */

    routines = {
        32: function getNodeCreate(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                USER_ID: receivedView.getUint16(bufferPosition + 3),
                PARENT_ID: receivedView.getUint32(bufferPosition + 5),
                NODE_ID: receivedView.getUint32(bufferPosition + 9),
                CUSTOM_TYPE: receivedView.getUint16(bufferPosition + 13)
            };
        },
        33: function getNodeDestroy(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                NODE_ID: receivedView.getUint32(bufferPosition + 2)
            };
        },
        34: function getNodeSubscribe(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                NODE_ID: receivedView.getUint32(bufferPosition + 2),
                VERSION: receivedView.getUint32(bufferPosition + 6),
                CRC32: receivedView.getUint32(bufferPosition + 10)
            };
        },
        35: function getNodeUnsubscribe(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                NODE_ID: receivedView.getUint32(bufferPosition + 2),
                VERSION: receivedView.getUint32(bufferPosition + 6),
                CRC32: receivedView.getUint32(bufferPosition + 10)
            };
        },
        37: function getNodeLink(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                PARENT_NODE_ID: receivedView.getUint32(bufferPosition + 3),
                CHILD_NODE_ID: receivedView.getUint32(bufferPosition + 7)
            };
        },
        38: function getNodePermissions(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                USER_ID: receivedView.getUint16(bufferPosition + 3),
                PERMISSIONS: receivedView.getUint8(bufferPosition + 5),
                NODE_ID: receivedView.getUint32(bufferPosition + 6)
            };
        },
        39: function getNodeUmask(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                PERMISSIONS: receivedView.getUint8(bufferPosition + 2)
            };
        },
        40: function getNodeOwner(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                USER_ID: receivedView.getUint16(bufferPosition + 3),
                NODE_ID: receivedView.getUint32(bufferPosition + 5)
            };
        },
        41: function getNodeLock(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                AVATAR_ID: receivedView.getUint32(bufferPosition + 3),
                NODE_ID: receivedView.getUint32(bufferPosition + 7)
            };
        },
        42: function getNodeUnlock(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                AVATAR_ID: receivedView.getUint32(bufferPosition + 3),
                NODE_ID: receivedView.getUint32(bufferPosition + 7)
            };
        },
        43: function getNodePriority(opCode, receivedView, bufferPosition) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(bufferPosition + 2),
                PRIORITY: receivedView.getUint8(bufferPosition + 3),
                NODE_ID: receivedView.getUint32(bufferPosition + 4)
            };
        }


    };

    node = {
 
        /*
         * method for getting values of node
         */
        getNodeValues: function getNodeValues(opCode, receivedView, bufferPosition, length) {
            var result = routines[opCode](opCode, receivedView, bufferPosition, length);
            return result;
        },

        /*
         * create node command
         * @param user_id - ID of current user
         * @param avatar_id - ID of current avatar
         * @param custom_type - custom type of node
         */
        create: function(user_id, avatar_id, custom_type) {
            var msg, view;
            msg = message.template(15, 32);
            view = new DataView(msg);
            view.setUint8(2, 0);
            view.setUint16(3, user_id);
            view.setUint32(5, avatar_id);
            view.setUint32(9, 4294967295);
            view.setUint16(13, custom_type);
            return msg;
        },

        /*
         * destroy node command
         * @param node_id - ID of node to be destroyed
         */
        destroy: function(node_id) {
            var msg, view;
            msg = message.template(6, 33);
            view = new DataView(msg);
            view.setUint32(2, node_id);
            return msg;
        },

        /*
         * subscribe node commad
         * @param id - node id
         */
        subscribe: function(node_id) {
            var msg, view;
            msg = message.template(14, 34);
            view = new DataView(msg);
            view.setUint32(2, node_id);
            view.setUint32(6, 0);
            view.setUint32(10, 0);
            return msg;
        },

        /*
         * unsubscribe node commad
         * @param id - node id
         */
        unsubscribe: function(node_id) {
            var msg, view;
            msg = message.template(14, 35);
            view = new DataView(msg);
            view.setUint32(2, node_id);
            view.setUint32(6, 0);
            view.setUint32(10, 0);
            return msg;
        },

        /*
         * link two nodes
         * @param parent_id - node ID of parent node
         * @param child_id - node ID of child node
         */
        link: function(parent_node_id, child_node_id) {
            var msg, view;
            msg = message.template(11, 37);
            view = new DataView(msg);
            view.setUint8(2, 0); // share
            view.setUint32(3, parent_node_id);
            view.setUint32(7, child_node_id);
            return msg;
        },

        /*
         * permission of node
         * @param node_id
         * @param user_id
         * @param permission
         */
        perm: function(node_id, user_id, permission) {
            var msg, view;
            msg = message.template(10, 38);
            view = new DataView(msg);
            view.setUint8(2, 0); // share
            view.setUint16(3, user_id);
            view.setUint8(5, permission);
            view.setUint32(6, node_id);
            return msg;
        },

        /*
         * set umask of new node
         * @param permission
         */
        umask: function(permission) {
            var msg, view;
            msg = message.template(3, 39);
            view = new DataView(msg);
            view.setUint8(2, permission);
            return msg;
        },

        /*
         * set new node owner
         * @param node_id - ID of node
         * @param user_id - ID of new owner
         */
        owner: function(node_id, user_id) {
            var msg, view;
            msg = message.template(9, 40);
            view = new DataView(msg);
            view.setUint8(2, 0); // share
            view.setUint16(3, user_id);
            view.setUint32(5, node_id);
            return msg;
        },

        /*
         * lock node
         * @param avatar_id - ID of your avatar
         * @param node_id - ID of node
         */
        lock: function(avatar_id, node_id) {
            var msg, view;
            msg = message.template(11, 41);
            view = new DataView(msg);
            view.setUint8(2, 0); // share
            view.setUint32(3, avatar_id);
            view.setUint32(7, node_id);
            return msg;
        },

        /*
         * unlock node
         * @param avatar_id - ID of your avatar
         * @param node_id - ID of node
         */
        unlock: function(avatar_id, node_id) {
            var msg, view;
            msg = message.template(11, 42);
            view = new DataView(msg);
            view.setUint8(2, 0); // share
            view.setUint32(3, avatar_id);
            view.setUint32(7, node_id);
            return msg;
        },

        /*
         * set priority of node
         * @param node_id - ID of node
         * @param priority - new priority of node
         */
        prio: function(node_id, priority) {
            var msg, view;
            msg = message.template(8, 43);
            view = new DataView(msg);
            view.setUint8(2, 0); // share
            view.setUint8(3, priority);
            view.setUint32(4, node_id);
            return msg;
        }

    };

    return node;

});
