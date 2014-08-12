/*globals define*/

define(function() {
    'use strict';

    var checkOpCode = function checkOpCode(op_code, rec_view, buf_pos) {

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

        if (op_code === 8) { /* Is it command usr_auth_fail */
            var method = rec_view.getUint8(buf_pos + 1);
            if (method === 2) { /* Password method */
                return {
                    CMD: 'auth_passwd'
                };
            }

        } else if (op_code === 9) { /*user authorized*/
            var user_id = rec_view.getUint16(buf_pos + 1);
            var avatar = rec_view.getUint32(buf_pos + 3);
            return {
                CMD: 'auth_succ',
                USER_ID: user_id,
                AVATAR_ID: avatar
            };

        } else if (op_code < 7) {
            length = rec_view.getUint8(buf_pos);
            feature = rec_view.getUint8(buf_pos + 1);
            feature_val = parseFeature(feature, rec_view, buf_pos, length);
            return {
                CMD: op_codes[op_code],
                FEATURE: feature_val.FEATURE,
                VALUE: feature_val.VALUE
            };
        } else {
            return {
                CMD: op_code
            };
        }

    };

    /*
     * Parses received ArrayBuffer, find correct feature name and value
     * @param feature - int feature number
     * @param  rec_view - DataView for received buffer
     * @param buf_pos - int current reading posititon
     * @param lenght - lenght of command
     */
    var parseFeature = function parseFeature(feature, rec_view, buf_pos, length) {
        var value,
            string_features = {
                3: 'HOST_URL',
                4: 'TOKEN',
                5: 'DED',
                9: 'CLIENT_NAME',
                10: 'CLIENT_VERSION'
            },
            int_features = {
                1: 'FCID',
                2: 'CCID',
                6: 'RWIN',
                8: 'COMMAND_COMPRESSION'
            };



        if (feature in string_features) { /* got token */
            value = parseStringValue(rec_view, length, buf_pos);
            return {
                FEATURE: string_features[feature],
                VALUE: value
            };
        } else if (feature in int_features){
            return {
                FEATURE: int_features[feature],
                VALUE: rec_view.getUint8(7)
            };
        } else {
            return {
                FEATURE: feature,
                VALUE: 'TBD'
            };
        }
    };

    /*
     * Parses received ArrayBuffer returns stored string value
     * @param  receivedDataView - DataView for received buffer
     * @param buf_pos - int current reading posititon
     * @param lenght - lenght of command
     */

    var parseStringValue = function parseStringValue(receivedDataView, length, buf_pos) {
        var i, result = '';
        for (i = 0; i <= length - 4; i++) {
            result += String.fromCharCode(receivedDataView.getUint8(buf_pos + 2 + i));
        }
        return result.slice(1);
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
