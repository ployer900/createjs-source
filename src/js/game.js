/*
* @Author: yuhongliang
* @Date:   2017-05-18 17:51:05
* @Last Modified by:   yuhongliang
* @Last Modified time: 2017-05-23 20:49:07
*/

'use strict';

//引入createjs库
require('../lib/createjs-2015.11.26.combined.js');
var config = require('./config.js');

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
    this.background.addEventListener('click', function(e) {
        console.log(e.stageX, e.stageY);
    });
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
    var w = this.redbagW;
    var x = this.randomX();
    var y = 0;

    var redbag = new createjs.Shape();
    redbag.graphics.beginFill(this.randomColor()).drawRect(0, 0, w, w);
    redbag.x = x * w;
    redbag.y = 0;
    redbag.rotation = 15;

    //时间到
    if (!this.timeout) {
        if (this.frequencyDivision == FREQUENCY_DIVISION) {
            this.frequencyDivision = 0;
            this.stage.addChild(redbag);
            this.addedCount++;
            createjs.Tween.get(redbag)
                    .to({ y: this.ticketCanvas.height }, config.moveDuration)
                    .call(function() { this.addedCount--; this.stage.removeChild(redbag); }.bind(this));
        } else {
            this.frequencyDivision++;
        }
    } else {
        if (this.addedCount == 0) {
            createjs.Ticker.paused = true;
            //调用游戏结束回调函数
            this.gameEnded();
        }
    };
};

/**
 * 游戏结束
 * @return {[type]} [description]
 */
game.prototype.gameEnded = function () {
    this.gameEndedCallback && this.gameEndedCallback();
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


//初始化，启动游戏
new game().startGame(function () {
    console.log('game over');
});
