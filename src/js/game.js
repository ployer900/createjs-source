/*
* @Author: yuhongliang
* @Date:   2017-05-18 17:51:05
* @Last Modified by:   yuhongliang
* @Last Modified time: 2017-05-24 13:55:56
*/

'use strict';

//引入createjs库
require('../lib/createjs-2015.11.26.combined.js');
var config = require('./config.js');
var redbag = require('./redbag.js');

//分频计数器
var FREQUENCY_DIVISION = 60 / config.frequency;

//构建游戏类
var game = function() {
    var clientW = window.innerWidth || document.documentElement.clientWidth;
    var clientH = window.innerHeight || document.documentElement.clientHeight;

    this.ticketCanvas = document.getElementById('ticket-canvas');

    //设置画布的宽高
    this.ticketCanvas.width = clientW;
    this.ticketCanvas.height = clientH;

    //实例化舞台元素
    this.stage = new createjs.Stage(this.ticketCanvas);

    //使能ticker
    createjs.Touch.enable(this.stage);
    createjs.Ticker.addEventListener('tick', function() {
        this.stage.update();
    }.bind(this));
    createjs.Ticker.timingMode = createjs.Ticker.RAF;

    //初始化
    this.init();
};

/**
 * 初始化游戏
 * @return {[type]} [description]
 */
game.prototype.init = function() {
    //是否停止添加红包
    this.timeout = false;
    //已添加红包个数
    this.addedCount = 0;
    //时间分频
    this.frequencyDivision = 0;
    //游戏时长
    this.duration = config.duration;
    this.clickedCount = 0;
    //游戏结束回调
    this.gameEndedCallback = null;
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
}

/**
 * 绘制背景
 * @return {[type]} [description]
 */
game.prototype.buildBackgroundWidget = function() {
    this.background = new createjs.Shape();
    this.background.graphics.beginFill('rgba(0,0,0,0.5)').drawRect(0, 0, this.ticketCanvas.width, this.ticketCanvas.height);
    this.stage.addChild(this.background);
}

/**
 * 开始倒计时
 * @return {[type]} [description]
 */
game.prototype.startCountdown = function () {
    this.countdownTimer = setTimeout(function () {
        this.duration--;
        if (this.duration >= 0) {
            this.startCountdown();
        } else {
            this.timeout = true;
        }
    }.bind(this), 1000);
}

/**
 * 开始游戏
 * @return {[type]} [description]
 */
game.prototype.startGame = function(cb) {
    this.startCountdown();
    this.gameEndedCallback = cb;
    createjs.Ticker.on('tick', this.updateFrame.bind(this));
}

/**
 * 绘制游戏
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
game.prototype.updateFrame = function (evt) {
    if (evt.paused) return;
    //时间到，则停止添加下落红包
    if (!this.timeout) {
        //分频添加
        if (this.frequencyDivision == FREQUENCY_DIVISION) {
            var self = this;
            var w = this.redbagW / 1.5;
            var x = this.randomX();
            var y = 0;
            //添加红包
            var canvasH = this.ticketCanvas.height;
            var item = new redbag().setFrame(x, y, w, w)
                                   .setRotationAngle(15)
                                   .setType('normal')
                                   .setClickedEvtHandler(this.redbagClickedHandler.bind(self))
                                   .createRedbag();
            this.frequencyDivision = 0;
            this.stage.addChild(item);
            this.addedCount++;
            createjs.Tween.get(item)
                    .to({ y: canvasH }, config.moveDuration)
                    .call(function() { this.addedCount--; this.stage.removeChild(item); }.bind(this));
        } else { 
            this.frequencyDivision++;
        }
    } else {
        //等待红包全部掉出屏幕
        if (this.addedCount == 0) {
            createjs.Ticker.paused = true;
            //调用游戏结束回调函数
            this.gameEnded(this.clickedCount);
        }
    };
};

/**
 * 红包点击事件
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
game.prototype.redbagClickedHandler = function(evt) {
    this.clickedCount++;
}

/**
 * 游戏结束
 * @return {[type]} [description]
 */
game.prototype.gameEnded = function (count) {
    this.gameEndedCallback && this.gameEndedCallback(count);
}

/**
 * 随机轨道值0,1,2,3
 * @return {[type]} [description]
 */
game.prototype.randomX = function () {
    return Math.floor((Math.random(0, 1) * 4));
}

/**
 * 随机颜色
 * @return {[type]} [description]
 */
game.prototype.randomColor = function () {
    return '#' + Math.floor(Math.random() * 0Xffffff).toString(16);
}


///exports
module.exports = game;