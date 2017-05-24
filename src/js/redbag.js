/*
* @Author: yuhongliang
* @Date:   2017-05-24 12:29:14
* @Last Modified by:   yuhongliang
* @Last Modified time: 2017-05-24 13:45:12
*/

'use strict';
//引入createjs库
require('../lib/createjs-2015.11.26.combined.js');


/**
 * 构建对象
 * @return {[type]} [description]
 */
var redbag = function() {
    //初始化
    this.init();
    return this;
};


/**
 * 初始化
 * @return {[type]} [description]
 */
redbag.prototype.init = function() {
    this.type = '';
    this.angle = 0;
    this.w = 0;
    this.h = 0;
    this.x = 0;
    this.y = 0;
    this.offsetX = 0;
    this.clickedCallback = null;
    return this;
}

/**
 * 设置宽高
 * @param {[type]} w [description]
 * @param {[type]} h [description]
 */
redbag.prototype.setSize = function(w, h) {
    this.w = w || 0;
    this.h = h || 0;
    return this;
}

/**
 * 设置frame
 * @param {[type]} x [description]
 * @param {[type]} y [description]
 * @param {[type]} w [description]
 * @param {[type]} h [description]
 */
redbag.prototype.setFrame = function(x, y, w, h) {
    this.setSize(w, h);
    this.x = x * this.w || 0;
    this.y = y || 0;
    return this;
}

/**
 * 设置左偏移
 * @param {[type]} offsetX [description]
 */
redbag.prototype.setOffsetX = function(offsetX) {
    this.offsetX = offsetX || 0;
    return this;
}

/**
 * 设置红包类型
 * @param {[type]} type [description]
 */
redbag.prototype.setType = function(type) {
    this.type = type || '';
    return this;
}

/**
 * 设置旋转角度
 * @param {[type]} angle [description]
 */
redbag.prototype.setRotationAngle = function(angle) {
    this.angle = angle || 0;
    return this;
}

/**
 * 设置点击事件回调函数
 * @param {Function} cb [description]
 */
redbag.prototype.setClickedEvtHandler = function(cb) {
    this.clickedCallback = cb || function(){};
    return this;
}

/**
 * 生成红包
 * @return {[type]} [description]
 */
redbag.prototype.createRedbag = function() {
    var item = new createjs.Shape();
    item.graphics.beginFill('#ff334d').drawRect(0, 0, this.w, this.h);
    item.x = this.x;
    item.y = this.y;
    item.type = this.type;
    item.rotation = this.angle;
    item.addEventListener('mousedown', this.clickedCallback);
    return item;
}

module.exports = redbag;