import path from 'path';
import common from './common.js';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {readConfig} from '../appConfig';
import assetPath from '../assetPath';
const publicUrl = readConfig('publicUrl')
const ui_mode = readConfig('ui_mode')

export default {
    context: path.join(common.paths.ROOT, '/src'),
    entry: [
        'webpack-hot-middleware/client?reload=true',
        'babel-polyfill',
        path.join(common.paths.SRC, '/index.js'),
    ],
    output: {
        path: common.paths.ROOT + '/dist',
        filename: '[name].js',
        publicPath: `${publicUrl}/scripts/`,
    },
    devtool: 'cheap-module-eval-source-map',
    resolve: {
        modules: [common.paths.ROOT, 'node_modules'],
        extensions: ['.', '.webpack.js', '.web.js', '.jsx', '.js'],
        alias: {
            '@city-assets': assetPath.cityAssets,
            '@city-images': assetPath.cityImages,
            '@city-i18n': assetPath.cityi18n,
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: ['babel-loader', 'eslint-loader'],
            },
            {test: /\.(js|jsx)?$/, exclude: /node_modules/, loader: 'babel-loader'},
            {
                test: /\.scss$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {
                        loader: 'sass-loader',
                        options: {
                            data: "$ui-mode: " + ui_mode + " !global;",
                        },
                    },
                ],
            },
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {test: /\.(jade|pug)?$/, loader: 'pug-loader'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
        ],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
    ],
    mode: 'development',
};
