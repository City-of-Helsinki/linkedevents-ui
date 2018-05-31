import nconf from 'nconf'
import jade from 'jade'
import GitRevisionPlugin from 'git-revision-webpack-plugin';
import path from 'path';
import common from '../config/webpack/common.js'

const gitRevisionPlugin = new GitRevisionPlugin();
const jsonConfigKeys = ['api_base', 'local_storage_user_expiry_time', 'nocache', 'raven_id', 'commit_hash'];
const templateConfigKeys = ['LE_PRODUCTION_INSTANCE', 'APP_MODE'];


nconf.env({ parseValues: true, whitelist: jsonConfigKeys.concat(templateConfigKeys)});
nconf.defaults({
    'LE_PRODUCTION_INSTANCE': '#',
    'APP_MODE': 'production',
});
nconf.file({file: 'config_dev.json'})
nconf.set('commit_hash', gitRevisionPlugin.commithash());
nconf.required(jsonConfigKeys.concat(templateConfigKeys));


const indexTemplate = jade.compileFile(path.join(common.paths.SRC, 'index.jade'), { pretty: true })

// We only want a subset of the read variables in configJson passed
// to template. Nconf only allows for fetching one variable or all
var configJson = {};
for (var key of jsonConfigKeys) {
    configJson[key] = nconf.get(key);
}

export default indexTemplate({
    APP_MODE: nconf.get('APP_MODE'),
    LE_PRODUCTION_INSTANCE: nconf.get('LE_PRODUCTION_INSTANCE'),
    configJson: JSON.stringify(configJson),
    NODE_ENV: process.env.NODE_ENV,
})