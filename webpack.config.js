/*
* @Author: yuhongliang
* @Date:   2017-05-18 17:49:51
* @Last Modified by:   yuhongliang
* @Last Modified time: 2017-05-24 11:18:47
*/

'use strict';

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
    entry: path.resolve('./src/js/index.js'),
    output: {
        path: path.resolve('dist/'),
        filename: 'js/index.min.js'
    },

    plugins: [
      new webpack.ProvidePlugin({
          $: '../lib/zepto.js'
      }),
      new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false
          },
          output: {
              comments: false
          }
      }),
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
    ],

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        port: 9000
    }
};

module.exports = config;
