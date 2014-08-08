/*globals ArrayBuffer, define, Uint8Array*/

define(function() {
    'use strict';


    var request = {

        /*
        * TODO: move to message.js file, because it will be used at
        * other parts of code
        *
        * Add verse protocol header to payloda
        * @param payload ArrayBuffer
        */
        message: function message(payload) {
            var message_len, buf, view, payload_view;

            message_len = 4 + payload.byteLength;
            buf = new ArrayBuffer(message_len);
            view = new DataView(buf);
            payload_view = new DataView(payload);

            /* Verse header starts with version */
            /* First 4 bits are reserved for version of protocol */
            view.setUint8(0, 1 << 4);
            /* The lenght of the message */
            view.setUint16(2, message_len);

            /* then byte copy the payload to new buffer */
            for (var i = 0; i < payload.byteLength; i++) {
                    view.setUint8(i + 4, payload_view.getUint8(i));
            }
            
            return buf;
        },

        /* TODO: move to message.js too */
        buffer_push: function buffer_push(buffer_a, buffer_b) {
            var result, res_view, buff_a_view, buff_b_view, i, j, message_len;

            message_len = buffer_a.byteLength + buffer_b.byteLength;
            result = new ArrayBuffer(message_len);
            res_view = new DataView(result);
            buff_a_view = new DataView(buffer_a);
            buff_b_view = new DataView(buffer_b);
             
            /*  byte copy the first buffer to result buffer */
            for (i = 0; i < buffer_a.byteLength; i++) {
                    res_view.setUint8(i, buff_a_view.getUint8(i));
            }

            /*  byte copy the first buffer to result buffer */
            for (j = buffer_a.byteLength;  j < message_len; j++) {
                    res_view.setUint8(j, buff_b_view.getUint8(j - buffer_a.byteLength));
            }
            
            return result;

        },

        /* TODO: it is just special case of userAuth function */
        handshake: function(name) {
            var i;
            /* Fill buffer with data of Verse header and user_auth
             * command */
            var message_len = name.length + 8;
            var buf = new ArrayBuffer(message_len);
            var view = new DataView(buf);

            /* Verse header starts with version */
            /* First 4 bits are reserved for version of protocol */
            view.setUint8(0, 1 << 4);
            /* The lenght of the message */
            view.setUint16(2, message_len);

            /* Pack OpCode of user_auth command */
            view.setUint8(4, 7);
            /* Pack length of the command */
            view.setUint8(5, 4 + name.length);
            /* Pack length of string */
            view.setUint8(6, name.length);
            /* Pack the string of the username */
            for (i = 0; i < name.length; i++) {
                view.setUint8(7 + i, name.charCodeAt(i));
            }
            /* Pack method NONE ... it is not supported and server will
             * return list of supported methods in command user_auth_fail */
            view.setUint8(7 + name.length, 1);

            return buf;
        },

        /* TODO: use message() function for packing data */
        userAuth: function(name, passwd) {
            var i;

            /* Fill buffer with data of Verse header and user_auth
             * command */
            var message_len = 9 + name.length + passwd.length;
            var buf = new ArrayBuffer(message_len);
            var view = new DataView(buf);

            /* Verse header starts with version */
            /* First 4 bits are reserved for version of protocol */
            view.setUint8(0, 1 << 4);
            /* The lenght of the message */
            view.setUint16(2, message_len);

            /* Pack OpCode of user_auth command */
            view.setUint8(4, 7);
            /* Pack length of the command */
            view.setUint8(5, 5 + name.length + passwd.length);
            /* Pack length of string */
            view.setUint8(6, name.length);
            /* Pack the string of the username */
            for (i = 0; i < name.length; i++) {
                view.setUint8(7 + i, name.charCodeAt(i));
            }
            /* Pack method Password  */
            view.setUint8(7 + name.length, 2);
            /* Pack password length */
            view.setUint8(8 + name.length, passwd.length);
            /* Pack the string of the password */
            for (i = 0; i < passwd.length; i++) {
                view.setUint8(9 + name.length + i, passwd.charCodeAt(i));
            }

            /* Send the blob */
            return buf;
        }
    };

    return request;

});
