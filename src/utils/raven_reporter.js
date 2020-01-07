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

export function report(windowArgumentsObject, message, commitHash) {
    const reportObject = {
        extra: {
            data: {
                message: message,
                commitHash: commitHash,
                router: windowArgumentsObject.router,
                userAgent: navigator.userAgent,
                currentUrl: window.location.href,
                timestamp: new Date(),
            },
        },
    };
    
    // User is logged in
    if (windowArgumentsObject.user !== null) {
        reportObject.extra.data.user = (windowArgumentsObject.user.emails[0].value !== undefined) ? windowArgumentsObject.user.emails[0].value : null;
        
        // When user is editing an event
        if (windowArgumentsObject.editor.values !== undefined && windowArgumentsObject.editor.values.hasOwnProperty('id')) {
            reportObject.extra.data.editorValues = windowArgumentsObject.editor.values;
        }
    }
    
    Raven.captureMessage('reporting', reportObject);
}
