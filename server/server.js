/* eslint-disable no-console */

import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import getSettings from './getSettings'
import express from 'express'
import { getPassport, addAuth } from './auth'

const settings = getSettings()
const app = express()
const passport = getPassport(settings)

app.use('/', express.static(path.resolve(__dirname, '..', 'dist')));

app.get('/', function (req, res) {
    res.sendfile(path.resolve(__dirname, '..', 'dist'));
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({name: 's', secret: settings.sessionSecret, maxAge: 86400 * 1000}));

app.use(passport.initialize());
app.use(passport.session());
addAuth(app, passport, settings);

const args = require('minimist')(process.argv.slice(2));
const port = process.env.PORT || 8080

console.log('Starting server at port', port);
app.listen(port);
