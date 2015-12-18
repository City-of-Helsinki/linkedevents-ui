webpack = require 'webpack'
config = require 'config'
HtmlWebpackPlugin = require 'html-webpack-plugin'
jade = require 'jade'

indexTemplate = jade.compileFile './src/index.jade', pretty: true
indexHtml = indexTemplate
    configJson: JSON.stringify config

module.exports =
    context: __dirname + '/src'
    entry:
        app: './scripts/app.cjsx'
    output:
        path: __dirname + '/dist'
        filename: '[name].js'

    module:
        loaders: [
            {test: /\.coffee$/, loader: 'coffee-loader'}
            {test: /\.cjsx$/, loaders: ['coffee', 'cjsx']}
            {test: /\.less$/, loader: 'style!css!less'}
            {test: /\.css$/, loader: 'style!css'}
            {test: /\.json$/, loader: 'json'}
            {test: /\.jade$/, loader: 'jade'}
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"}
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"}
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"}
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"}
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"}
         ]
    plugins: [
        new HtmlWebpackPlugin
            chunks: ['app']
            inject: true
            templateContent: indexHtml
     ]
