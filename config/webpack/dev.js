import path from 'path';
import common from './common.js';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import jade from 'jade';
import GitRevisionPlugin from 'git-revision-webpack-plugin';
import nconf from 'nconf';

const jsonConfigKeys = ['api_base', 'local_storage_user_expiry_time', 'nocache', 'raven_id', 'commit_hash'];
const templateConfigKeys = ['LE_PRODUCTION_INSTANCE', 'APP_MODE'];

const gitRevisionPlugin = new GitRevisionPlugin();

nconf.env({ parseValues: true, whitelist: jsonConfigKeys.concat(templateConfigKeys)});
nconf.defaults({
    'LE_PRODUCTION_INSTANCE': '#',
    'APP_MODE': 'production',
});
nconf.file({file: 'config_dev.json'})
nconf.set('commit_hash', gitRevisionPlugin.commithash());
nconf.required(jsonConfigKeys.concat(templateConfigKeys));


const indexTemplate = jade.compileFile(path.join(common.paths.SRC, 'index.jade'), { pretty: true })

// We only want a subset of the read variables in configJson passed
// to template. Nconf only allows for fetching one variable or all
var configJson = {};
for (var key of jsonConfigKeys) {
    configJson[key] = nconf.get(key);
}

const indexHtml = indexTemplate({
    APP_MODE: nconf.get('APP_MODE'),
    LE_PRODUCTION_INSTANCE: nconf.get('LE_PRODUCTION_INSTANCE'),
    configJson: JSON.stringify(configJson)
})

export default {
    context: path.join(common.paths.ROOT, '/src'),
    entry: [
        "webpack-hot-middleware/client?reload=true",
        'babel-polyfill',
        path.join(common.paths.SRC, '/index.js')
    ],
    output: {
        path: common.paths.ROOT + '/dist',
        filename: '[name].js'
    },
    devtool: 'cheap-module-eval-source-map',
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
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
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
