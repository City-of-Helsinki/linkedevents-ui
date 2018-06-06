const readConfig = require('../config/readConfig');
const configKeys = ['port', 'publicUrl', 'helsinkiAuthId', 'helsinkiAuthSecret', 'helsinkiTargetApp', 'sessionSecret'];

export default function getOptions() {
    return readConfig(configKeys);
}
