import constants from '../constants'

// Is fetching checks?
const initialState = {
    items: []
}

function update(state = initialState, action) {
    if(action.type === constants.RECEIVE_EVENTS) {
        return Object.assign({}, state, {
            items: action.items
        });
    }

    if(action.type === constants.RECEIVE_EVENT_DETAILS) {
        return Object.assign({}, state, {
            event: action.event
        });
    }

    return state
}

export default update
