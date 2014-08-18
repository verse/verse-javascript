/*
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

/* globals ArrayBuffer, define, Uint8Array */

define(function() {
    'use strict';


    var request = {

        /*
         * Add verse protocol header before payload
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
            /* The length of the message */
            view.setUint16(2, message_len);

            /* then byte copy the payload to new buffer */
            for (var i = 0; i < payload.byteLength; i++) {
                    view.setUint8(i + 4, payload_view.getUint8(i));
            }
            
            return buf;
        },

        /*
         * Concatenate two buffers and return new buffer
         * @param buffer_a
         * @param buffer_b
         */
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

        }


    };

    return request;

});
