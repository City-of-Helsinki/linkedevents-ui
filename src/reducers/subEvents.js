import constants from '../constants'

const initialState = {
    isFetching: false,
    fetchComplete: false,
    items: [],
    error: null
}

function update(state = initialState, action) {
    if(action.type === constants.REQUEST_SUB_EVENTS) {
        return Object.assign({}, state, {
            isFetching: true,
            fetchComplete: false,
            items: [],
            error: null
        })
    }

    if(action.type === constants.RECEIVE_SUB_EVENTS) {
        return Object.assign({}, state, {
            isFetching: false,
            fetchComplete: true,
            items: action.events,
            error: null
        });
    }

    if(action.type === constants.RECEIVE_SUB_EVENTS_ERROR) {
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
