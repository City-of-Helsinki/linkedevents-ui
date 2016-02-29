import constants from '../constants'

// Is fetching checks?
const initialState = {
    isFetching: false,
    fetchComplete: false,
    items: [],
    eventError: null,
    eventsError: null
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
            isFetching: false,
            fetchComplete: true,
            event: action.event,
            eventError: null
        });
    }

    if(action.type === constants.RECEIVE_EVENT_DETAILS_ERROR) {
        return Object.assign({}, state, {
            isFetching: false,
            fetchComplete: false,
            event: null,
            eventError: action.error
        });
    }

    if (action.type === constants.REQUEST_EVENTS) {
        return Object.assign({}, state, {
            isFetching: true,
            fetchComplete: false,
            items: []
        });
    }

    if (action.type === constants.REQUEST_EVENT) {
        return Object.assign({}, state, {
            isFetching: true,
            fetchComplete: false,
            eventError: null,
            event: null
        });
    }

    return state
}

export default update
