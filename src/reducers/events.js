import constants from '../constants'

// Is fetching checks?
const initialState = {
    isFetching: false,
    fetchComplete: false,
    items: []
}

function update(state = initialState, action) {
    if(action.type === constants.RECEIVE_EVENTS) {
        return Object.assign({}, state, {
            isFetching: false,
            fetchComplete: true,
            items: action.items
        });
    }

    if(action.type === constants.RECEIVE_EVENT_DETAILS) {
        return Object.assign({}, state, {
            event: action.event
        });
    }
    if (action.type === constants.REQUEST_EVENTS) {
        return Object.assign({}, state, {
            isFetching: true,
            fetchComplete: false,
            items: [],
        });
    }
    return state
}

export default update
