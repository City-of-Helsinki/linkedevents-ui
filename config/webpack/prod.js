const webpack = require('webpack');
const nconf = require('nconf');
const jade = require('jade');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const settings = require('../getSettings.js')()

// There are defined in common.js as well, but that is not available without
// transpilation, which is not done for webpack configuration file
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const SRC = path.resolve(ROOT, 'src');
const common = {
    paths: {
        ROOT,
        SRC
    }
}

const indexTemplate = jade.compileFile(path.join(common.paths.SRC, 'index.jade'), { pretty: true })

const indexHtml = indexTemplate({
    APP_MODE: settings['templateConfig']['APP_MODE'],
    LE_PRODUCTION_INSTANCE: settings['templateConfig']['LE_PRODUCTION_INSTANCE'],
    configJson: JSON.stringify(settings['jsonConfig'])
})

const config = {
    context: path.join(common.paths.ROOT, '/src'),
    entry: [
        //'webpack-hot-middleware/client',
        'babel-polyfill',
        path.join(common.paths.SRC, '/index.js')
    ],
    output: {
        path: common.paths.ROOT + '/dist',
        filename: '[name].[chunkhash].js'
    },
    devtool: 'source-map',
    resolve: {
        modules: [common.paths.ROOT, 'node_modules'],
        extensions: ['.', '.webpack.js', '.web.js', '.jsx', '.js']
    },
    module: {
        rules: [
            {test: /\.(js|jsx)?$/, exclude: /node_modules/, loader: 'babel-loader' },
            {test: /\.scss$/, use: [{ loader: "style-loader"}, { loader: "css-loader"}, { loader: "sass-loader"}]},
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {test: /\.jade$/, loader: 'jade-loader'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml"},
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
