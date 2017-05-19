/*
* @Author: yuhongliang
* @Date:   2017-05-18 17:51:05
* @Last Modified by:   yuhongliang
* @Last Modified time: 2017-05-19 12:15:36
*/

'use strict';

//引入createjs库
require('../lib/easeljs-0.8.2.combined.js');

var game = function() {
    var clientW = window.innerWidth || document.documentElement.clientWidth;
    var clientH = window.innerHeight || document.documentElement.clientHeight;

    this.ticketCanvas = document.getElementById('ticket-canvas');

    //设置画布的宽高
    this.ticketCanvas.width = clientW;
    this.ticketCanvas.height = clientH;

    //实例化舞台元素
    this.stage = new createjs.Stage(this.ticketCanvas);
    
    createjs.Touch.enable(this.stage);
    createjs.Ticker.addEventListener('tick', function() {
        this.stage.update();
    }.bind(this));
    createjs.Ticker.timingMode = createjs.Ticker.RAF;

    this.init();  
};

/**
 * 初始化游戏
 * @return {[type]} [description]
 */
game.prototype.init = function() {
    //红包宽高
    this.redbagW = this.redbagH = this.ticketCanvas.width / 4;

    //添加物件
    this.buildGameWidget();
}


/**
 * 构建游戏部件
 * @return {[type]} [description]
 */
game.prototype.buildGameWidget = function() {

    //绘制背景
    this.buildBackgroundWidget();

    //绘制红包
    this.buildRedbagWidget();
}

/**
 * 绘制背景
 * @return {[type]} [description]
 */
game.prototype.buildBackgroundWidget = function() {
    this.background = new createjs.Shape();
    this.background.graphics.beginFill('rgba(0,0,0,0.5)').drawRect(0, 0, this.ticketCanvas.width, this.ticketCanvas.height);
    this.background.addEventListener('click', function(e) {
        console.log(e.stageX, e.stageY);
    });
    this.stage.addChild(this.background);
}

/**
 * 绘制红包
 * @return {[type]} [description]
 */
game.prototype.buildRedbagWidget = function() {
    // body...
    this.redbag = new createjs.Shape();
    this.redbag.graphics.beginFill('#30cff3').drawRect(10, 10, this.redbagW, this.redbagW);
    this.stage.addChild(this.redbag);
}


new game();