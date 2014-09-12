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

/* globals define */

define(['message'], function(message) {
    'use strict';

     var tagGroup;

    

    tagGroup = {

        /*
         * subscribe tagGroup commad
         * @param nodeId int32
         * @param tagGroupId int16
         */
        subscribe: function(nodeId, tagGroupId) {
            var msg, view;
            msg = message.template(17, 46);
            view = new DataView(msg);
            view.setUint8(3, 0);//share
            view.setUint32(3, nodeId);
            view.setUint16(7, tagGroupId);
            view.setUint32(9, 0);//Version
            view.setUint32(13, 0);//CRC32
            return msg;
        }




    };

    return tagGroup;

});
