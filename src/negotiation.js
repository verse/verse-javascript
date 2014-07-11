/*globals ArrayBuffer, define*/

define(function() {
    'use strict';

    var negotiation, sendStringMessage, sendIntMessage;

    /**
     * Abstract string message array buffer
     * @param message_type int
     * @param data_str string
     * @param feature_type int
     **/
    sendStringMessage = function(message_type, data_str, feature_type) {
        var buf, view, mes_len, cmd_len, i;

        cmd_len = 3 + 1 + data_str.length;
        mes_len = 4 + cmd_len;
        buf = new ArrayBuffer(mes_len);
        view = new DataView(buf);
        /* Verse header starts with version */
        /* First 4 bits are reserved for version of protocol */
        view.setUint8(0, 1 << 4);
        /* The lenght of the message is 8 for int message*/
        view.setUint16(2, mes_len);
        /* fifth byte - message type */
        view.setUint8(4, message_type);
        /* sixth byte - message length */
        view.setUint8(5, cmd_len);
        /* seventh byte - feature type */
        view.setUint8(6, feature_type);
        /* eigth byte - packed string length */
        view.setUint8(7, data_str.length);
        /* Pack the data_str */
        for (i = 0; i < data_str.length; i++) {
            view.setUint8(8 + i, data_str.charCodeAt(i));
        }

        return buf;
    };

    /**
     * Abstract int message array buffer
     * @param message_type int
     * @param data_int int
     * @param feature_type int
     **/

    sendIntMessage = function(message_type, data_int, feature_type) {
        var buf, view;

        buf = new ArrayBuffer(8);
        view = new DataView(buf);
        /* Verse header starts with version */
        /* First 4 bits are reserved for version of protocol */
        view.setUint8(0, 1 << 4);
        /* The lenght of the message is 8 for int message*/
        view.setUint16(2, 8);
        /* fifth byte - message type = opt_code of cmd */
        view.setUint8(4, message_type);
        /* sixth byte - command length */
        view.setUint8(5, 4);
        /* seventh byte - feature type */
        view.setUint8(6, feature_type);
        /* eighth byte - value */
        view.setUint8(7, data_int);

        return buf;
    };

    negotiation = {

        /* message types */
        CHANGE_L: 3,
        CHANGE_R: 4,
        CONFIRM_L: 5,
        CONFIRM_R: 6,

        /*
         * Flow Control ID (FCID)
         * feature type 1
         * @param type : int message type
         * @param id : fcid Value range: 0 - 255
         */
        fcid: function(type, id) {
            return sendIntMessage(type, id, 1);
        },

        /*
         * Congestion Control ID (CCID)
         * feature type 2
         * @param type : int message type
         * @param id : fcid Value range: 0 - 255
         */
        ccid: function(type, id) {
            return sendIntMessage(type, id, 2);
        },

        /*
         * URL of host defined in RFC 1738
         * feature type 3
         * @param type : int message type
         * @param nurl : string
         */
        url: function(type, nurl) {
            return sendStringMessage(type, nurl, 3);
        },

        /*
         * Token
         * feature type 4
         * @param type : int message type
         * @param token_val : string
         */
        token: function(type, token_val) {
            return sendStringMessage(type, token_val, 4);
        },


        /*
         * Data Exchange Definition (DED)
         * feature type 5
         * @param type : int message type
         * @param ded_val : string
         */
        ded: function(type, ded_val) {
            return sendStringMessage(type, ded_val, 5);
        },

        /*
         * Scale factor of RWIN used in Flow Control
         * feature type 6
         * @param type : int message type
         * @param id : rwin, Value range: 0 - 255
         */
        rwin: function(type, value) {
            return sendIntMessage(type, value, 6);
        },

        /*
         * Frames per Seconds
         * feature type 7
         * @param type : int message type
         * @param fps: float, Value range: Float min - Float max
         */

        fps: function(message_type, value) {
            var buf, view;

            buf = new ArrayBuffer(13);
            view = new DataView(buf);
            /* Verse header starts with version */
            /* First 4 bits are reserved for version of protocol */
            view.setUint8(0, 1 << 4);
            /* The lenght of the message is 13 for float message*/
            view.setUint16(2, 13);
            /* fifth byte - message type */
            view.setUint8(4, message_type);
            /* sixth byte - cmd length */
            view.setUint8(5, 7);
            /* seventh byte - feature type */
            view.setUint8(6, 7);
            /* eigth byte - value */
            view.setFloat32(7, value);

            return buf;
        },

        /*
         * Command Compression
         * feature type 8
         * @param type : int message type
         * @param id : compress Value range: 0 - 255
         */
        compression: function(type, value) {
            return sendIntMessage(type, value, 8);
        }



    };

    return negotiation;

});
