/* eslint-disable no-console */

import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import getSettings from './getSettings'
import express from 'express'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../config/webpack/dev.js'

import { getPassport, addAuth } from './auth'

const settings = getSettings()

const app = express()
const compiler = webpack(config)
const passport = getPassport(settings)

app.use(webpackMiddleware(compiler));
app.use(webpackHotMiddleware(compiler));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({name: 's', secret: settings.sessionSecret, maxAge: 86400 * 1000}));

app.use(passport.initialize());
app.use(passport.session());
addAuth(app, passport, settings);

const args = require('minimist')(process.argv.slice(2));
const port = process.env.PORT || 8080

if (settings.dev || args.dump) {
    console.log('Using dev settings!');
  //console.log("Settings:\n", inspect(settings, {colors: true}));
}

console.log('Starting server at port', port);
app.listen(port);
