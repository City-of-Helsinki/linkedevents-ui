// Do not use this to change settings in development (or production!)
// instead in development use config_dev.toml in project root
// and in production use environment variables
const defaults = {
    port: 8080,
    // Used to sign the session cookie
    sessionSecret: 'development-secret',
    // All four settings below need to match ones configured in SSO
    publicUrl: 'http://localhost:8080',
    helsinkiAuthId: 'this-is-mock',
    helsinkiAuthSecret: 'this-is-mock',
    helsinkiTargetApp: 'linkedevents-ui',
    api_base: 'https://api.hel.fi/linkedevents-test/v1',
    local_storage_user_expiry_time: 48,
    nocache: true,
    raven_id: false,
    LE_PRODUCTION_INSTANCE: '#',
    APP_MODE: 'testing'
}

// These are used by the small backend server doing authentication. It will be replaced
// by pure client based implementation at some point. At that point port and authsecret
// will no longer be used
const serverConfigKeys = ["port", "publicUrl", "helsinkiAuthId", "helsinkiAuthSecret", "helsinkiTargetApp", "sessionSecret"]
// These control the application itself. They are rendered as JSON in base template
const jsonConfigKeys = ['api_base', 'local_storage_user_expiry_time', 'nocache', 'raven_id', 'commit_hash']
// ... and these control static rendering of a warning banner in the base template
const templateConfigKeys = ['LE_PRODUCTION_INSTANCE', 'APP_MODE']

const settings = { serverConfig: null,
                   jsonConfig: null,
                   templateConfig: null }

function filterObject(object, keys) {
    var newObject = {}
    for (var key of keys) {
        newObject[key] = object[key]
    }
    return newObject
}

function getConfig() {
    if(settings['serverConfig'] !== null) {
        return settings
    }

    const nconf = require('nconf');
    const GitRevisionPlugin = require('git-revision-webpack-plugin');

    nconf.env({ parseValues: true, whitelist: serverConfigKeys.concat(jsonConfigKeys.concat(templateConfigKeys))})
    // We spefically only want to read configuration file in development mode
    // There have been quite a few unfortunate accidents with production running
    // on a leftover configuration file. Thus only environmental variable there.
    if(process.env.NODE_ENV == 'development') {
        // TOML can be used similarly to an 'env'-file, although it is really
        // extended INI-like format
        nconf.file('toml',{file: 'config_dev.toml', format: require('nconf-toml')})
        // JSON is kept for backwards compabitibility, to not to annoy the developer
        // using it
        nconf.file('json',{file: 'config_dev.json'})
    }
    nconf.defaults(defaults)
    // 'memory' is needed to store the commit_hash, if file has not been loaded
    nconf.use('memory')
    nconf.set('commit_hash', new GitRevisionPlugin().commithash());

    nconf.required(serverConfigKeys.concat(jsonConfigKeys.concat(templateConfigKeys)))

    const completeConfig = nconf.get()

    settings['serverConfig'] = filterObject(completeConfig, serverConfigKeys)
    settings['jsonConfig'] = filterObject(completeConfig, jsonConfigKeys)
    settings['templateConfig'] = filterObject(completeConfig, templateConfigKeys)

    console.log("Your settings are:")
    console.log(settings)

    return settings;
}

module.exports = getConfig