import constants from '../constants'

const initialState = {
    flashMsg: null, // Used to control showing flash messages
    confirmAction: {} // Used to control modal
}

function update(state = initialState, action) {

    if(action.type === constants.APP_SET_FLASHMSG) {
        if(action.msg && action.msg.length) {
            return Object.assign({}, state, {
                flashMsg: { msg: action.msg, type: action.msgType, data: action.data }
            })
        } else {
            return Object.assign({}, state, {
                flashMsg: null
            })
        }
    }

    if(action.type === constants.APP_CLEAR_FLASHMSG) {
        return Object.assign({}, state, {
            flashMsg: null
        })
    }

    return state
}

export default update
