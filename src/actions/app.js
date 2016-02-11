import constants from '../constants'

export function setFlashMsg(msg, style = 'message', data = {}) {
    // type can be 'message' or 'error'
    return {
        type: constants.APP_SET_FLASHMSG,
        msg: msg,
        style: style,
        data: data
    }
}

export function clearFlashMsg() {
    return {
        type: constants.APP_CLEAR_FLASHMSG
    }
}

export function confirmAction(msg, style = 'warning', data = {}) {
    // type can be 'message' or 'error'
    //
    // data is an obj {
    //    action: function to run if confirmed
    // }
    return {
        type: constants.APP_CONFIRM_ACTION,
        msg: msg,
        style: style,
        data: data
    }
}

export function doAction(data) {
    if(data && data.action && typeof data.action === 'function') {
        data.action()
    }

    return {
        type: constants.APP_DO_ACTION
    }
}

export function cancelAction() {
    return {
        type: constants.APP_CANCEL_ACTION
    }
}
