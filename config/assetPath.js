const path = require('path');
const nconf = require('nconf');

let cityConfig;
let cityAssets;
/**
 * city_theme package could have the following folders
 * some-ui /
 * assets /
 * -----> main.scss
 * -----> some scss files that are imported to main.scss
 * images /
 * -----> images that are used in the scss rules??
 * plus whatever
 */

if (nconf.get('city_theme')) {
    // used in development, checks from config_dev.json
    cityConfig = path.resolve(__dirname, `../node_modules/${nconf.get('city_theme')}/`);
    cityAssets = path.resolve(cityConfig, 'assets/');
}
else if (process.env.city_theme) {
    // used in production(???), checks from process.env
    cityConfig = path.resolve(__dirname, `../node_modules/${process.env.city_theme}/`);
    cityAssets = path.resolve(cityConfig, 'assets/');
}
else {
    // used when no city_theme is available
    cityConfig = path.resolve(__dirname, '../src/assets/default/');
    cityAssets = path.resolve(cityConfig, 'assets/');
}
module.exports = {cityConfig, cityAssets};
