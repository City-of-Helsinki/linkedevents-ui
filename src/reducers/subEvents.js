import constants from '../constants'

const initialState = {
    isFetching: false,
    fetchComplete: false,
    items: [],
    error: null,
    bySuperEventId: {},
    fetchingFromSuperId: '',
}

function update(state = initialState, action) {
    if(action.type === constants.REQUEST_SUB_EVENTS) {
        return Object.assign({}, state, {
            isFetching: true,
            fetchComplete: false,
            items: [],
            error: null,
        })
    }

    if(action.type === constants.RECEIVE_SUB_EVENTS) {
        return Object.assign({}, state, {
            isFetching: false,
            fetchComplete: true,
            items: action.events,
            error: null,
        });
    }

    if(action.type === constants.RECEIVE_SUB_EVENTS_ERROR) {
        return Object.assign({}, state, {
            isFetching: false,
            fetchComplete: false,
            items: [],
            error: action.error,
            fetchingFromSuperId: '',
        });
    }

    if (action.type === constants.REQUEST_SUB_EVENTS_FROM_SUPER) {
        return Object.assign({}, state, {
            fetchingFromSuperId: action.superEventId,
        })
    }

    if (action.type === constants.RECEIVE_SUB_EVENTS_FROM_SUPER) {
        const {subEvents, superEventId} = action
        const bySuperEventId = Object.assign({}, state.bySuperEventId, {
            [superEventId]: subEvents,
        })

        return Object.assign({}, state, {
            bySuperEventId,
            isFetching: false,
            fetchComplete: true,
            error: null,
            fetchingFromSuperId: '',
        })
    }

    if(action.type === constants.CLEAR_SUB_EVENTS) {
        return {
            ...state,
            items: [],
        }
    }

    return state
}

export default update
