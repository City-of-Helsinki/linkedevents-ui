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

function clearEventDataFromLocalStorage() {
    localStorage.setItem('EDITOR_VALUES', JSON.stringify({}))
}

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
        clearEventDataFromLocalStorage()

        return Object.assign({}, state, {
            values: {}
        })
    }

    if(action.type === constants.EDITOR_CLEAR_FLASHMSG) {
        return Object.assign({}, state, {
            flashMsg: null
        })
    }

    if(action.type === constants.EDITOR_SENDDATA_SUCCESS) {
        clearEventDataFromLocalStorage()

        return Object.assign({}, {
            createdEvent: action.data.event,
            createdAt: action.data.createdAt,
            flashMsg: { msg: 'event-posted', type: 'success' },
            values: {}
        })
    }

    if(action.type === constants.EDITOR_SENDDATA_ERROR) {
        return Object.assign({}, state, {
            flashMsg: { msg: action.apiErrorMsg, type: 'error', data: action.data }
        })
    }

    if(action.type === constants.EDITOR_RECEIVE_KEYWORDSETS) {
        console.log('Reduced keywordsets', action.keywordSets)
        return Object.assign({}, state, {
            keywordSets: action.keywordSets
        })
    }

    return state
}

export default update
