var Raven = require('raven-js');

if (appSettings.raven_id) {
    Raven.config(appSettings.raven_id).install();
}

/**
 * Send an error report to Sentry
 * @param windowObject
 * @param message
 * @param commitHash
 */
export function report(windowObject, message, commitHash) {
    Raven.captureMessage('reporting', {
        extra: {
            data: {
                xdata: JSON.stringify(windowObject),
                user: (windowObject.user) ? windowObject.user.emails[0].value : null,
                message: message,
                commitHash: commitHash,
            },
        },
    });
}
