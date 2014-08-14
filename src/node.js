/*globals ArrayBuffer, define*/

define(function() {
    'use strict';

    var node, commands, routines, messageTemplate, getNodeCreate, getNodeDestroy;


    /**
     * Abstract int message array buffer
     * @param opcode int
     * @param length int
     **/

    messageTemplate = function(length, opCode) {
        var buf, view;

        buf = new ArrayBuffer(length);
        view = new DataView(buf);
        /* first byte - op code*/
        view.setUint8(0, opCode);
        /* second byte - message length */
        view.setUint8(1, length);

        return buf;
    };

    //command codes = opCodes
    commands = {
        32: 'NODE_CREATE',
        33: 'NODE_DESTROY'
    };

    //routines - parsing functions
    routines = {
        32: function getNodeCreate(opCode, receivedView) {
            return {
                CMD: commands[opCode],
                SHARE: receivedView.getUint8(2),
                USER_ID: receivedView.getUint16(3),
                PARENT_ID: receivedView.getUint32(5),
                NODE_ID: receivedView.getUint32(9),
                CUSTOM_TYPE: receivedView.getUint16(13)
            };
        },
        33: getNodeDestroy
    };


    getNodeCreate =

    node = {

        /*
         * subscribe node commad
         * @param id - node id
         */





        subscribe: function(id) {
            var msg, view;
            msg = messageTemplate(14, 34);
            view = new DataView(msg);
            view.setUint32(3, id);
            view.setUint32(7, 0);
            view.setUint32(10, 0);
            return msg;
        },

        getNodeValues: function getNodeValues(opCode, receivedView) {

            console.info(routines[opCode](opCode, receivedView));
            return routines[opCode](opCode, receivedView);
        }





    };

    return node;

});
