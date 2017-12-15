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
    helsinkiTargetApp: 'linkedevents-ui'
}

const configKeys = ["port", "publicUrl", "helsinkiAuthId", "helsinkiAuthSecret", "helsinkiTargetApp", "sessionSecret"];

export default function getOptions() {
    const nconf = require('nconf');

    nconf.env(configKeys)
    nconf.defaults(defaults)
    if(process.env.NODE_ENV == 'development') {
        nconf.file({file: 'config_dev.toml', format: require('nconf-toml')})
        nconf.file({file: 'config_dev.json'})
    }

    nconf.required(configKeys)

    return nconf.get()
}
