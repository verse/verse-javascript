/*globals ArrayBuffer, define*/

define(function() {
    'use strict';

    var node, messageTemplate;

    
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

    node = {

        subscribe: function(id) {
            var msg, view;
            msg =  messageTemplate(14, 34);
            view = new DataView(msg);
            view.setUint32(3, id);
            view.setUint32(7, 0);
            view.setUint32(10, 0);
            return msg;
        }

        


    };

    return node;

});
