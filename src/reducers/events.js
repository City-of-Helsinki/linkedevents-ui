import constants from '../constants'

const initialState = {
    isFetching: false,
    items: []
}

function update(state = initialState, action) {
    if(action.type === constants.RECEIVE_EVENTS) {
        var object = Object.assign({}, state, {
            isFetching: false,
            items: action.items
        });
        console.log('test', object);
        return object;
    }
    return state
}

export default update
