import {Provider} from 'nconf'
import _ from 'lodash'

const defaults = {
    serverUrl: process.env.SERVER_URL || 'http://localhost:8080',
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000',
    publicUrl: process.env.PUBLIC_URL || 'http://localhost:8080',
    helsinkiAuthId: process.env.CLIENT_ID || 'this-is-mock',
    helsinkiAuthSecret: process.env.CLIENT_SECRET || 'this-is-mock',
    helsinkiTargetApp: process.env.TARGET_APP || 'linkedevents-ui',
    sessionSecret: process.env.SESSION_SECRET || (Math.random()).toString(),
    dev: false
}

const requiredKeys = ["helsinkiAuthId", "helsinkiAuthSecret", "helsinkiTargetApp"]

export default function getOptions() {
    // Check configs
    const nconf = new Provider()
    nconf.argv()
    nconf.env()
    nconf.file({file: './server.config'})
    nconf.defaults(_.clone(defaults))

    const settings = _.pick(nconf.get(), Object.keys(defaults))
    const {hostname, port} = require('url').parse(settings.serverUrl)
    settings.hostname = hostname
    settings.port = port
    settings.publicUrl = settings.publicUrl || settings.serverUrl
    settings.sessionSecret = process.env.SESSIONSECRET
    settings.jwtKey = process.env.JWTKEY

    const missingKeys = requiredKeys.filter((key) => !settings[key])
    if (missingKeys.length) {
        throw new Error("These configuration values are required but are currently missing: " + missingKeys.join(", "))
    }
    return settings
}
