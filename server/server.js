/* eslint-disable no-console */

import path from 'path'
import bodyParser from 'body-parser'
import express from 'express'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'

import getSettings from './getSettings'
import { getPassport, addAuth } from './auth'

import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../config/webpack/dev.js'
import indexTemplate from './renderIndexTemplate'

const settings = getSettings()
const app = express()
const passport = getPassport(settings)

if(process.env.NODE_ENV !== 'development') {
    app.use('/', express.static(path.resolve(__dirname, '..', 'dist')));
    app.get('/', function (req, res) {
        res.sendfile(path.resolve(__dirname, '..', 'dist'));
    });
} else {
    const compiler = webpack(config)
    app.use(webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: {
            colors: true,
            assets: false,
            modules: false,
        },
    }));
    app.use(webpackHotMiddleware(compiler));
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({name: 's', secret: settings.sessionSecret, maxAge: 86400 * 1000}));

app.use(passport.initialize());
app.use(passport.session());
addAuth(app, passport, settings);

app.get('*', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html')   
    res.end(indexTemplate)
})

console.log('Starting server at port', settings.port);
app.listen(settings.port);
