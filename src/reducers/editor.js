import constants from '../constants'

let editorValues = {}

try {
    editorValues = JSON.parse(localStorage.getItem('EDITOR_VALUES'))
} catch(e) {
    editorValues = {}
}

const initialState = {
    values: editorValues || {}
}

console.log('Editor values: ', initialState)

function update(state = initialState, action) {
    if(action.type === constants.EDITOR_SETDATA) {

        // Merge new values to existing values
        let newValues = Object.assign({}, state.values, action.values)

        localStorage.setItem('EDITOR_VALUES', JSON.stringify(newValues))

        return Object.assign({}, state, {
            values: newValues
        })
    }

    if(action.type === constants.EDITOR_CLEARDATA) {
        localStorage.setItem('EDITOR_VALUES', JSON.stringify({}))

        return Object.assign({}, state, {
            values: {}
        })
    }

    if(action.type === constants.EDITOR_SENDDATA_SUCCESS) {
        return Object.assign({}, state, {
            createdEvent: action.data.event,
            createdAt: action.data.createdAt,
            values: {}
        })
    }

    return state
}

export default update
