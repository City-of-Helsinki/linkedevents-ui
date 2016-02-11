//import path from 'path';
var path = require('path');

//import common from './common.js';
const ROOT = path.resolve(__dirname, '../..');
const SRC = path.resolve(ROOT, 'src');

var common = {
    paths: {
        ROOT,
        SRC
    }
};

//import webpack from 'webpack';
var webpack = require('webpack');

//import config from 'config';
var config = require('config');

//import HtmlWebpackPlugin from 'html-webpack-plugin';
var HtmlWebpackPlugin = require('html-webpack-plugin');

//import jade from 'jade';
var jade = require('jade');

const indexTemplate = jade.compileFile(path.join(common.paths.SRC, 'index.jade'), { pretty: true })

const indexHtml = indexTemplate({
    configJson: JSON.stringify(config)
})

var config = {
    context: path.join(common.paths.ROOT, '/src'),
    entry: [
        //'webpack-hot-middleware/client',
        'babel-polyfill',
        path.join(common.paths.SRC, '/index.js')
    ],
    output: {
        path: common.paths.ROOT + '/dist',
        //filename: '[name].js'
        filename: 'bundle.js'
    },

    debug: false,

    resolve: {
        root: common.paths.ROOT,
        extensions: ['.', '', '.webpack.js', '.web.js', '.jsx', '.js']
    },
    module: {
        loaders: [
            {test: /\.(js|jsx)?$/, exclude: /node_modules/, loader: 'babel' },
            {test: /\.scss$/, loaders: ["style", "css", "sass"]},
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.json$/, loader: 'json'},
            {test: /\.jade$/, loader: 'jade'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    plugins: [
        //new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new HtmlWebpackPlugin({
            inject: true,
            templateContent: indexHtml
        })
    ]
};

module.exports = config;
