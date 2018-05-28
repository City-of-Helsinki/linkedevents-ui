
var Raven = require('raven-js');
if (appSettings.raven_id) {
    Raven.config(appSettings.raven_id).install();
}

export function report (data) {
    Raven.captureMessage('reporting', {extra: {data: data}});
}
