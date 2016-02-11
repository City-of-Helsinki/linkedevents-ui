import constants from '../constants'

export function setFlashMsg(msg, type = 'message', data = {}) {
    // type can be 'message' or 'error'
    return {
        type: constants.APP_SET_FLASHMSG,
        msg: msg,
        msgType: type,
        data: data
    }
}

export function clearFlashMsg() {
    return {
        type: constants.APP_CLEAR_FLASHMSG
    }
}
