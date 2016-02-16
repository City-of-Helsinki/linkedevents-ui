import constants from '../constants'

const initialState = {
    flashMsg: null, // Used to control showing flash messages
    confirmAction: null // Used to control modal
}

function update(state = initialState, action) {

    if(action.type === constants.APP_SET_FLASHMSG) {
        if(action.msg && action.msg.length) {
            return Object.assign({}, state, {
                flashMsg: { msg: action.msg, style: action.style, data: action.data }
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

    if(action.type === constants.APP_CONFIRM_ACTION) {
        if(action.msg && action.msg.length) {
            return Object.assign({}, state, {
                confirmAction: { msg: action.msg, style: action.style, actionButtonLabel: action.actionButtonLabel, data: action.data }
            })
        } else {
            return Object.assign({}, state, {
                confirmAction: null
            })
        }
    }

    if(action.type === constants.APP_DO_ACTION) {
        // Clear confirmAction data.
        return Object.assign({}, state, {
            confirmAction: null
        })
    }

    if(action.type === constants.APP_CANCEL_ACTION) {
        // Clear confirmAction data.
        return Object.assign({}, state, {
            confirmAction: null
        })
    }

    return state
}

export default update
