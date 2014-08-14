/*globals define*/

define(['negotiation'], function(negotiation) {
    'use strict';

    var checkOpCode = function checkOpCode(opCode, rec_view, buf_pos) {

        var length, feature, feature_val, op_codes;


        op_codes = {
            3: 'CHANGE_L',
            4: 'CHANGE_R',
            5: 'CONFIRM_L',
            6: 'CONFIRM_R',
            7: 'USER_AUTH_REQUEST',
            8: 'USER_AUTH_FAILURE',
            9: 'USER_AUTH_SUCCESS'
        };

        if (opCode === 8) { /* Is it command usr_auth_fail */
            var method = rec_view.getUint8(buf_pos + 1);
            if (method === 2) { /* Password method */
                return {
                    CMD: 'auth_passwd'
                };
            }

        } else if (opCode === 9) { /*user authorized*/
            var user_id = rec_view.getUint16(buf_pos + 1);
            var avatar = rec_view.getUint32(buf_pos + 3);
            return {
                CMD: 'auth_succ',
                USER_ID: user_id,
                AVATAR_ID: avatar
            };

        } else if (opCode < 7) { //negotiation commands
            length = rec_view.getUint8(buf_pos);
            feature = rec_view.getUint8(buf_pos + 1);
            
            console.info(negotiation);

            feature_val = negotiation.getFeatureValues(feature, rec_view, buf_pos, length);

            console.info('fv' + feature_val);
            return {
                CMD: op_codes[opCode],
                FEATURE: feature_val.FEATURE,
                VALUE: feature_val.VALUE
            };
        } else if (opCode > 31 && opCode < 44) { //node commands
            return {
                CMD: opCode
            };
        } else {
            return {
                CMD: opCode
            };
        }

    };

    


    /*
    * Response module - for parsing server response messages 
    */


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
            var opCode, cmd_len, result;
            var rec_view = new DataView(buffer);
            var buf_pos = 2;

            var message_len = rec_view.getUint16(buf_pos);
            buf_pos += 2;

            result = [];
            while (buf_pos < message_len - 1) {
                opCode = rec_view.getUint8(buf_pos);

                buf_pos += 1;
                cmd_len = rec_view.getUint8(buf_pos);

                if (cmd_len > 2) {
                    result.push(checkOpCode(opCode, rec_view, buf_pos));
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
