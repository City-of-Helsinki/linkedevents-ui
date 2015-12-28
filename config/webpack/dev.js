import path from 'path';
import common from './common.js';
import webpack from 'webpack';
import config from 'config';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import jade from 'jade';

const indexTemplate = jade.compileFile(path.join(common.paths.SRC, 'index.jade'), {pretty: true});
const indexHtml = indexTemplate({
    configJson: JSON.stringify(config)
});

module.exports = {
    context: path.join(common.paths.ROOT, '/src'),
    entry: [
        'webpack-hot-middleware/client',
        path.join(common.paths.SRC, '/index.js')
    ],
    output: {
        path: common.paths.ROOT + '/dist',
        filename: '[name].js'
    },
    debug: true,
    devtool: 'cheap-module-eval-source-map',
    resolve: {
        root: common.paths.ROOT
    },
    module: {
        loaders: [
            {test: /\.js?$/, exclude: /node_modules/, loader: 'babel' },
            {test: /\.coffee$/, loader: 'coffee-loader'},
            {test: /\.cjsx$/, loaders: ['coffee', 'cjsx']},
            {test: /\.scss$/, loaders: ["style", "css", "sass"]},
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.json$/, loader: 'json'},
            {test: /\.jade$/, loader: 'jade'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"}
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new HtmlWebpackPlugin({
            inject: true,
            templateContent: indexHtml
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
