import constants from '../constants'

// Is fetching checks?
const initialState = {
    isFetching: false,
    fetchComplete: false,
    items: [],
    selected: {}
}

function update(state = initialState, action) {
    if(action.type === constants.RECEIVE_IMAGES) {
        return Object.assign({}, state, {
            isFetching: false,
            fetchComplete: true,
            items: action.items
        });
    }
    //
    // if(action.type === constants.RECEIVE_EVENT_DETAILS) {
    //     return Object.assign({}, state, {
    //         event: action.event
    //     });
    // }

    if (action.type === constants.SELECT_IMAGE_BY_ID) {
        console.log(action)
        return Object.assign({}, state, {
            selected: action.img
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
        console.log('Image uploaded in reducer')
        console.log(action.data)
        return Object.assign({}, state, {
            selected: action.data,
        })
    }

    if(action.type === constants.IMAGE_UPLOAD_ERROR) {
        console.log('Image upload failed in reducer')
        return Object.assign({}, state, {
            flashMsg: {msg: 'upload failed', type: 'error', data: action.data}
        })
    }

    return state
}

export default update
