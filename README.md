[![Build status](https://travis-ci.org/City-of-Helsinki/linkedevents-ui.svg?branch=master)](https://travis-ci.org/City-of-Helsinki/linkedevents-ui)
[![codecov](https://codecov.io/gh/City-of-Helsinki/linkedevents-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/City-of-Helsinki/linkedevents-ui)

# Installation

```
$ npm install
$ npm start
```

Then point your browser to the webpack dev server at http://localhost:8080/.

If you're doing API development as well, set your API endpoint in your
local config file at `config/local.yml`, for example:

    api_base: http://localhost:8000/v1

For server or development server (used for authorization environment), set appropriate variables also in respective server modules.
