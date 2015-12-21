/* eslint-disable no-console */

// import {getCompiler, applyCompilerMiddleware} from './bundler';
// import {inspect} from 'util';
// import morgan from 'morgan';
// import renderMiddleware from "./render-middleware";

import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import getSettings from './getSettings';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../config/webpack/dev.js';

import { getPassport, addAuth } from './auth';

const settings = getSettings();

const app = express();
const compiler = webpack(config);
const passport = getPassport(settings);

app.use(express.static(__dirname + '/dist'));
app.use(webpackMiddleware(compiler));
app.use(webpackHotMiddleware(compiler));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({name: 's', secret: settings.sessionSecret, maxAge: 86400 * 1000}));

app.use(passport.initialize());
app.use(passport.session());
addAuth(app, passport, settings);

app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const args = require('minimist')(process.argv.slice(2));

if (settings.dev || args.dump) {
  //console.log("Settings:\n", inspect(settings, {colors: true}));
}

app.listen(8080);

//
/*

const server = express();
const compiler = getCompiler(settings, true);

server.use('/', express.static(compiler.options.paths.OUTPUT));
server.use('/assets', express.static(compiler.options.paths.ASSETS));
server.use(morgan(settings.dev ? 'dev' : 'combined'));
server.use((req, res, next) => {
  if (/127\.0\.0\.1/.test(req.hostname)) {
    res.status(400).send("Please use localhost, not 127.0.0.1.");
  } else {
    next();
  }
});

if (settings.dev) {
  applyCompilerMiddleware(server, compiler, settings);
}
server.use(renderMiddleware(settings));


function run() {
  // Hello? Anyone there?
  server.listen(settings.port, settings.hostname, () => {
    console.log(`[***] Listening on ${settings.hostname}:${settings.port}.`);
  });
}

compiler.run((err, stats) => {
  if (err) throw new Error(`Webpack error: ${err}`);
  console.log(stats.toString({assets: true, chunkModules: false, chunks: true, colors: true}));
});
run();
*/
