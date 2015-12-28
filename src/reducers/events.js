import constants from '../constants'

const initialState = {
    isFetching: false,
    items: []
}

function update(state = initialState, action) {
    if(action.type === constants.RECEIVE_EVENTS) {
        return Object.assign({}, state, {
            isFetching: false,
            items: action.items
        });
    }
    return state
}

export default update
