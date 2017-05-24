/*
* @Author: yuhongliang
* @Date:   2017-05-24 11:10:38
* @Last Modified by:   yuhongliang
* @Last Modified time: 2017-05-24 13:13:16
*/

'use strict';

var game = require('./game');

new game().startGame(function(count) {
    console.log('game overed');
    alert('一共点中了' + count + '个红包');
});