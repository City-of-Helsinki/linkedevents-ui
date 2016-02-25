import constants from '../constants'

// Saved in store.user
const initialState = null

function update(state = initialState, action) {
    switch(action.type) {
        // Login
        case constants.RECEIVE_USERDATA:

            if(action.payload && action.payload.id) {
                // TODO: get from payload
                return Object.assign({}, action.payload);
            }

            else {
                return state
            }
        break

        // Logout
        case constants.CLEAR_USERDATA:
            return null
        break

        default:
        return state
    }
}

export default update
