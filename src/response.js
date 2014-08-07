/*globals define*/

define(function() {
    'use strict';

    var checkOpCode = function checkOpCode(op_code, rec_view, buf_pos) {

        var length, feature, i, token, ded;

        if (op_code === 8) { /* Is it command usr_auth_fail */
            var method = rec_view.getUint8(buf_pos + 1);
            if (method === 2) { /* Password method */
                return {CMD: 'auth_passwd'};
            }

        } else if (op_code === 9) { /*user authorized*/
            var user_id = rec_view.getUint16(buf_pos + 1);
            var avatar = rec_view.getUint32(buf_pos + 3);
            return {CMD: 'auth_succ', USER_ID: user_id, AVATAR_ID: avatar};
            
        } else if (op_code === 4) {
            /* Change_R command */
            length = rec_view.getUint8(buf_pos);
            feature = rec_view.getUint8(buf_pos + 1);
        
            if (feature === 4) { /* got token */
                token = '';
                for (i = 0; i <= length-4; i++) {
                    token += String.fromCharCode(rec_view.getUint8(buf_pos + 2 + i));
                }
                return {TOKEN: token.slice(1)};
            }
            
            return true;
        } else if (op_code === 3) {
            /* Change_L command */
            length = rec_view.getUint8(buf_pos);
            feature = rec_view.getUint8(buf_pos + 1);
            if (feature === 5) { /* got DED */
                ded = '';
                for (i = 0; i <=length-4; i++) {
                    ded += String.fromCharCode(rec_view.getUint8(buf_pos + 2 + i));
                }
                return {DED: ded.slice(1)};
            }
            return true;
        }
    };

    var response = {
        checkHeader: function(buffer) {
            /* TODO: do communication here :-) */
            var rec_view = new DataView(buffer);
            var buf_pos = 0;

            /* Parse header */
            var version = rec_view.getUint8(buf_pos) >> 4;
            buf_pos += 2;

            if (version !== 1) {
                return false;
            }

            return true;

        },

        parse: function(buffer) {
            var op_code, cmd_len, result;
            var rec_view = new DataView(buffer);
            var buf_pos = 2;
            
            var message_len = rec_view.getUint16(buf_pos);
            buf_pos += 2;

            result = [];
            while (buf_pos < message_len - 1) {
                op_code = rec_view.getUint8(buf_pos);

                buf_pos += 1;
                cmd_len = rec_view.getUint8(buf_pos);

                if (cmd_len > 2) {
                    result.push(checkOpCode(op_code, rec_view, buf_pos));
                } else {
                    /* TODO end connection */
                }

                buf_pos += cmd_len - 1;

            }

            return result;

        }


    };

    return response;

});
