Linkedevents-UI - form-style UI for Linked Events API
=====================================================

[![Build status](https://travis-ci.org/City-of-Helsinki/linkedevents-ui.svg?branch=master)](https://travis-ci.org/City-of-Helsinki/linkedevents-ui)
[![codecov](https://codecov.io/gh/City-of-Helsinki/linkedevents-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/City-of-Helsinki/linkedevents-ui)

Linkedevents-UI is a user interface for creating and changing events through
Linked Events API. It exposes many capabilities of the API including:

* Creation, changing and deletion of events
* Managing multipart events
* Showing available actions based on user permissions

# Development Installation

## Prerequisites
* Yarn
* Node v8 LTS 
* Python 2 (due to node-sass using node-gyp)

If you're building the application in Windows environment you might also need to install windows-build-tools by running

```
npm install --global --production windows-build-tools
```

then close the commandline and try in a new commanline window. windows-build-tools have to be installed only once.

## Configuration

`config_dev.json` contains partially working settings giving you read only
access to our test API. If you have your own API and/or authentication
credentials you can change the relevant settings therein.

Using your own authentication server requires code changes in server/auth.js.

## Running development server

```
$ yarn
$ yarn start
```

Then point your browser to the webpack dev server at http://localhost:8080/.

