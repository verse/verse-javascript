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

/* globals ArrayBuffer, define, */

define(function() {
    'use strict';


    var request = {

        /*
         * Add verse protocol header before payload
         * @param payload ArrayBuffer
         */
        message: function message(payload) {
            var messageLen, buf, view, payloadView;

            messageLen = 4 + payload.byteLength;
            buf = new ArrayBuffer(messageLen);
            view = new DataView(buf);
            payloadView = new DataView(payload);

            /* Verse header starts with version */
            /* First 4 bits are reserved for version of protocol */
            view.setUint8(0, 1 << 4);
            /* The length of the message */
            view.setUint16(2, messageLen);

            /* then byte copy the payload to new buffer */
            for (var i = 0; i < payload.byteLength; i++) {
                    view.setUint8(i + 4, payloadView.getUint8(i));
            }
            
            return buf;
        },

        /*
         * Concatenate two buffers and return new buffer
         * @param bufferA
         * @param bufferB
         */
        buffer_push: function buffer_push(bufferA, bufferB) {
            var result, viewResult, viewA, viewB, i, j, messageLen;

            messageLen = bufferA.byteLength + bufferB.byteLength;
            result = new ArrayBuffer(messageLen);
            viewResult = new DataView(result);
            viewA = new DataView(bufferA);
            viewB = new DataView(bufferB);
             
            /*  byte copy the first buffer to result buffer */
            for (i = 0; i < bufferA.byteLength; i++) {
                    viewResult.setUint8(i, viewA.getUint8(i));
            }

            /*  byte copy the first buffer to result buffer */
            for (j = bufferA.byteLength;  j < messageLen; j++) {
                    viewResult.setUint8(j, viewB.getUint8(j - bufferA.byteLength));
            }
            
            return result;

        }


    };

    return request;

});
