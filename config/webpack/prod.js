const webpack = require('webpack');
const nconf = require('nconf');
const jade = require('jade');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

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

const jsonConfigKeys = ["api_base", "local_storage_user_expiry_time", "nocache", "raven_id"];
const templateConfigKeys = ["LE_PRODUCTION_INSTANCE", "APP_MODE"];

nconf.env(jsonConfigKeys.concat(templateConfigKeys));
nconf.defaults({
    'LE_PRODUCTION_INSTANCE': '#',
    'APP_MODE': 'production',
});
nconf.required(jsonConfigKeys.concat(templateConfigKeys));

const gitRevisionPlugin = new GitRevisionPlugin();
nconf.set('commit_hash', gitRevisionPlugin.commithash());

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

const config = {
    raven_id: null,
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

    debug: false,
    devtool: 'source-map',
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
