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
    // APP_MODE='testing' trigger a nice red banner
    'APP_MODE': 'testing'
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
    debug: true,
    devtool: 'cheap-module-eval-source-map',
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
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
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
