import constants from '../constants'

// Is fetching checks?
const initialState = {
    isFetching: false,
    fetchComplete: false,
    items: [],
    selected: {},
}

function update(state = initialState, action) {
    if(action.type === constants.RECEIVE_IMAGES) {
        return Object.assign({}, state, {
            isFetching: false,
            fetchComplete: true,
            items: action.items,
        });
    }

    if (action.type === constants.RECEIVE_IMAGES_ERROR) {
        return Object.assign({}, state, {
            isFetching: false,
            fetchComplete: true,
            items: action.items,
        })
    }

    if (action.type === constants.REQUEST_IMAGES) {
        return Object.assign({}, state, {
            isFetching: true,
            fetchComplete: false,
            items: [],
        });
    }

    if(action.type === constants.IMAGE_UPLOAD_SUCCESS) {
        return Object.assign({}, state, {
            selected: action.data,
            fetchComplete: false,
        })
    }

    return state
}

export default update
