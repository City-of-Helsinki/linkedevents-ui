import constants from '../constants'

// Is fetching checks?
const initialState = {
    isFetching: false,
    fetchComplete: false,
    items: [],
    error: null
}

function update(state = initialState, action) {
    if(action.type === constants.REQUEST_USER_EVENTS) {
        return Object.assign({}, state, {
            isFetching: true,
            fetchComplete: false,
            items: [],
            error: null
        })
    }

    if(action.type === constants.RECEIVE_USER_EVENTS) {
        return Object.assign({}, state, {
            isFetching: false,
            fetchComplete: true,
            items: action.items,
            error: null
        });
    }

    if(action.type === constants.RECEIVE_USER_EVENTS_ERROR) {
        return Object.assign({}, state, {
            isFetching: false,
            fetchComplete: false,
            items: [],
            error: action.error
        });
    }

    return state
}

export default update
