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

## Configuration

LE UI is configured to use Helsinki Linked Events test api by default. This
lets you search for events and view their details.

For development the easiest way to further configure the application, is
to copy `config_dev.toml-example` to `config_dev.toml`. It contains
configuration that should be mostly identical to built-in configuration.
Every setting should be described in comments as well.

Note that `config_dev.toml` resembles a shell fragment, but it is TOML,
instead of shell. Thereby do not try to add exports or such there.

## Running development server

```
$ yarn
$ yarn start
```

Then point your browser to the webpack dev server at http://localhost:8080/.
