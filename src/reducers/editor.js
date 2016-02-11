import constants from '../constants'

import {mapAPIDataToUIFormat} from 'src/utils/formDataMapping.js'

let editorValues = {}

try {
    // Local storage loading and saving disabled for now
    // editorValues = JSON.parse(localStorage.getItem('EDITOR_VALUES'))
} catch(e) {
    editorValues = {}
}

const initialState = {
    values: editorValues || {}
}

function clearEventDataFromLocalStorage() {
    localStorage.setItem('EDITOR_VALUES', JSON.stringify({}))
}

function update(state = initialState, action) {
    if(action.type === constants.EDITOR_SETDATA) {

        // Merge new values to existing values
        let newValues = Object.assign({}, state.values, action.values)

        // Local storage saving disabled for now
        // localStorage.setItem('EDITOR_VALUES', JSON.stringify(newValues))

        return Object.assign({}, state, {
            values: newValues
        })
    }

    if(action.type === constants.EDITOR_REPLACEDATA) {

        // Replace new values to existing values
        let newValues = Object.assign({}, action.values)

        // Local storage saving disabled for now
        // localStorage.setItem('EDITOR_VALUES', JSON.stringify(newValues))

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

    if(action.type === constants.EDITOR_SENDDATA_SUCCESS) {
        clearEventDataFromLocalStorage()

        return Object.assign({}, state, {
            createdEvent: action.data.event,
            createdAt: action.data.createdAt,
            values: {}
        })
    }

    if(action.type === constants.EDITOR_SENDDATA_ERROR) {
        // return Object.assign({}, state, {
        //     flashMsg: { msg: action.apiErrorMsg, msgType: 'error', data: action.data }
        // })
    }

    if(action.type === constants.EDITOR_RECEIVE_KEYWORDSETS) {
        return Object.assign({}, state, {
            keywordSets: action.keywordSets
        })
    }

    if(action.type === constants.EDITOR_RECEIVE_LANGUAGES) {
        return Object.assign({}, state, {
            languages: action.languages
        })
    }

    if(action.type === constants.RECEIVE_EVENT_FOR_EDITING) {
        let newValues = Object.assign({}, mapAPIDataToUIFormat(action.event))

        return Object.assign({}, state, {
            values: newValues
        })
    }

    return state
}

export default update
