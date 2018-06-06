const nconf = require('nconf');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const path = require('path');
const paths = require('./webpack/common').paths;


// Config-keys used by server
const serverConfigKeys = ['port', 'publicUrl', 'helsinkiAuthId', 'helsinkiAuthSecret', 'helsinkiTargetApp', 'sessionSecret'];
// Config-keys used for jade template
const templateConfigKeys = ['LE_PRODUCTION_INSTANCE', 'APP_MODE'];
// React-app config-keys
const clientConfigKeys = ['api_base', 'local_storage_user_expiry_time', 'nocache', 'raven_id'];

const gitRevisionPlugin = new GitRevisionPlugin();
nconf.overrides({
    'commit_hash': gitRevisionPlugin.commithash(),
});

// Read values from env, all known config-keys are whitelisted
const allKeys = serverConfigKeys.concat(templateConfigKeys, clientConfigKeys);
nconf.env(allKeys);

// Read config_dev.json. Will not overwrite configs from env.
nconf.file({file: path.join(paths.ROOT, 'config_dev.json')});

// Defaults, fall back to these if they are not found in any of the previous sources
nconf.defaults({
    'LE_PRODUCTION_INSTANCE': '#',
    'APP_MODE': process.env.NODE_ENV,
    'port': 8080,
});

/**
 * Function to retrieve value from config
 * @param {undefined|string|string[]} keys 
 */
function getConfig(keys) {
    // Return all config if no keys provided
    if (!keys) {
        return nconf.get();
    }

    // Get single item, return value as is
    if (typeof keys === 'string') {
        nconf.required([keys]);
        return nconf.get(keys);
    }

    // Multiple keys provided, return object
    nconf.required(keys);
    return keys.reduce(function(obj, key) {
        obj[key] = nconf.get(key);
        return obj;
    }, {});
}

module.exports = getConfig
