/*
* @Author: yuhongliang
* @Date:   2017-05-18 17:49:51
* @Last Modified by:   yuhongliang
* @Last Modified time: 2017-05-19 11:26:53
*/

'use strict';

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
    entry: path.resolve('./src/js/game.js'),
    output: {
        path: path.resolve('dist/'),
        filename: 'js/game.min.js'
    },

    plugins: [
        new CopyWebpackPlugin([
            {
                from: 'src/index.html',
                to: ''
            },
            {
                from: 'src/css/game.css',
                to: 'css'
            },
            {
                from: 'src/img',
                to: 'img'
            }
        ])
    ]
};

module.exports = config;