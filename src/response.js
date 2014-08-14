/*globals define*/

define(['negotiation'], function(negotiation) {
    'use strict';

    var checkOpCode = function checkOpCode(opCode, receivedView, bufferPosition) {

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
            var method = receivedView.getUint8(bufferPosition + 1);
            if (method === 2) { /* Password method */
                return {
                    CMD: 'auth_passwd'
                };
            }

        } else if (opCode === 9) { /*user authorized*/
            var user_id = receivedView.getUint16(bufferPosition + 1);
            var avatar = receivedView.getUint32(bufferPosition + 3);
            return {
                CMD: 'auth_succ',
                USER_ID: user_id,
                AVATAR_ID: avatar
            };

        } else if (opCode < 7) { //negotiation commands
            length = receivedView.getUint8(bufferPosition);
            feature = receivedView.getUint8(bufferPosition + 1);
            
            console.info(negotiation);

            feature_val = negotiation.getFeatureValues(feature, receivedView, bufferPosition, length);

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
            var receivedView = new DataView(buffer);
            var bufferPosition = 0;

            /* Parse header */
            var version = receivedView.getUint8(bufferPosition) >> 4;
            bufferPosition += 2;

            if (version !== 1) {
                return false;
            }

            return true;

        },

        parse: function(buffer) {
            var opCode, cmdLen, result;
            var receivedView = new DataView(buffer);
            var bufferPosition = 2;

            var message_len = receivedView.getUint16(bufferPosition);
            bufferPosition += 2;

            result = [];
            while (bufferPosition < message_len - 1) {
                opCode = receivedView.getUint8(bufferPosition);

                bufferPosition += 1;
                cmdLen = receivedView.getUint8(bufferPosition);

                if (cmdLen > 2) {
                    result.push(checkOpCode(opCode, receivedView, bufferPosition));
                } else {
                    /* TODO end connection */
                }

                bufferPosition += cmdLen - 1;

            }

            return result;

        }


    };

    return response;

});
