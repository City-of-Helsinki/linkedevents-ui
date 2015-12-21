/* eslint-disable no-console */

// import {getCompiler, applyCompilerMiddleware} from './bundler';
import {getPassport, addAuth} from './auth';
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

const app = express();
const compiler = webpack(config);

app.use(express.static(__dirname + '/dist'));
app.use(webpackMiddleware(compiler));
app.use(webpackHotMiddleware(compiler));
app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(8080);

// const args = require('minimist')(process.argv.slice(2));
/*
const settings = getSettings();
if (settings.dev || args.dump) {
  console.log("Settings:\n", inspect(settings, {colors: true}));
}
const server = express();
const compiler = getCompiler(settings, true);
const passport = getPassport(settings);

server.use('/', express.static(compiler.options.paths.OUTPUT));
server.use('/assets', express.static(compiler.options.paths.ASSETS));
server.use(morgan(settings.dev ? 'dev' : 'combined'));
server.use(cookieParser());
server.use(bodyParser.urlencoded({extended: true}));
server.use((req, res, next) => {
  if (/127\.0\.0\.1/.test(req.hostname)) {
    res.status(400).send("Please use localhost, not 127.0.0.1.");
  } else {
    next();
  }
});
server.use(cookieSession({name: 's', secret: settings.sessionSecret, maxAge: 86400 * 1000}));
server.use(passport.initialize());
server.use(passport.session());
addAuth(server, passport, settings);

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
