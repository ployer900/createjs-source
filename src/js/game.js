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
    // createjs.Ticker.interval = 200;

    this.init();
};

/**
 * 初始化游戏
 * @return {[type]} [description]
 */
game.prototype.init = function() {
    this.count = 0;
    this.timerCount = 0;
    //游戏时长
    this.duration = config.duration;
    //红包
    this.redbags = [];
    //游戏结束回调
    this.gameOverCb = null;
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
    // this.buildRedbagWidget();
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
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}   [description]
 */
game.prototype.buildRedbagWidget = function() {
    var w = this.redbagW / 2;
    var h = this.redbagH / 2;
    var canvasH = this.ticketCanvas.height;
    // body...
    for (var i = 0; i < 7; i++) {
        var redbag = new createjs.Shape();
        var j = this.randomX();
        redbag.graphics.beginFill(this.randomColor()).drawRect(0, 0, w, h);
        redbag.x = j * w;
        redbag.y = canvasH - (h * (7 - i));
        redbag.rotation = 15;
        this.stage.addChild(redbag);
        //缓存红包物件
        this.redbags.push(redbag);
    }
}

/**
 * 开始倒计时
 * @return {[type]} [description]
 */
game.prototype.startCountdown = function () {
    this.countdownTimer = setTimeout(function () {
        this.duration--;
        console.log(this.count);
        if (this.duration >= 0) {
            this.startCountdown();
        } else {
            if (this.count == 0) {
                // createjs.Ticker.paused = true;
                setTimeout(function () {
                    //游戏结束
                    createjs.Ticker.paused = true;
                    this.gameOvered();
                }.bind(this), 1000);
            } else {}
        }
    }.bind(this), 1000);
}

/**
 * 开始游戏
 * @return {[type]} [description]
 */
game.prototype.startGame = function(cb) {
    this.startCountdown();
    this.gameOvered = cb;
    createjs.Ticker.on('tick', this.updateFrame.bind(this));
}

/**
 * 隐藏红包
 * @return {[type]} [description]
 */
game.prototype.hideRedbag = function (redbag, paused) {
    redbag.visible = !paused;
}

/**
 * 更新游戏画面
 * @return {[type]} [description]
 */
game.prototype.updateFrame = function (evt) {
    var w = this.redbagW;
    var x = this.randomX();
    var y = 0;

    var redbag = new createjs.Shape();
    redbag.graphics.beginFill(this.randomColor()).drawRect(0, 0, w, w);
    redbag.x = x * w;
    redbag.y = 0;
    redbag.rotation = 15;

    if (this.timerCount == 20 && !evt.paused) {
        this.timerCount = 0;
        this.stage.addChild(redbag);
        this.count++;
        console.log(this.count);
        createjs.Tween.get(redbag)
                .to({y: this.ticketCanvas.height }, 1400)
                .call(function() { this.count--; this.stage.removeChild(redbag); }.bind(this));
    } else {
        this.timerCount++;
    }
};

/**
 * 游戏结束
 * @return {[type]} [description]
 */
game.prototype.gameOvered = function () {
    this.gameOverCb && this.gameOverCb();
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


new game().startGame(function () {
    console.log('game over');
});
