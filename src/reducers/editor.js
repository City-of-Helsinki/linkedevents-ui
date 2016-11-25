import constants from '../constants'
import { omit, get as getIfExists } from 'lodash'
import updater from 'immutability-helper';

import {mapAPIDataToUIFormat} from 'src/utils/formDataMapping.js'
import getContentLanguages from 'src/utils/language'

import {doValidations} from 'src/validation/validator.js'

let editorValues = {
    sub_events: {}
}
let languages = {}
let keywordSets = {}

try {
    // Local storage form value loading and saving disabled for now
    // editorValues = JSON.parse(localStorage.getItem('EDITOR_VALUES'))
    keywordSets = JSON.parse(localStorage.getItem('KEYWORDSETS'))
    languages = JSON.parse(localStorage.getItem('LANGUAGES'))
    //
} catch(e) {
    editorValues = {}
}

const initialState = {
    values: editorValues || {},
    languages: languages,
    contentLanguages: ['fi'],
    keywordSets: keywordSets,
    validationErrors: {},
    validateFor: null
}

function clearEventDataFromLocalStorage() {
    localStorage.setItem('EDITOR_VALUES', JSON.stringify({}))
}

function update(state = initialState, action) {
    if(action.type === constants.EDITOR_SETDATA) {
        if (action.event) {
            return updater(state, {
                values: {
                    sub_events: {
                        [action.key]: { $set: action.values[action.key] }
                    }
                }
            });
        }
        // Merge new values to existing values
        let newValues = Object.assign({}, state.values, action.values)

        // Local storage saving disabled for now
        // localStorage.setItem('EDITOR_VALUES', JSON.stringify(newValues))

        let validationErrors = Object.assign({}, state.validationErrors)
        // If there are validation errors, check if they are fixed
        if (_.keys(state.validationErrors).length > 0) {
            validationErrors = doValidations(newValues, state.contentLanguages, state.validateFor)
        }

        return Object.assign({}, state, {
            values: newValues,
            validationErrors: validationErrors
        })
    }
    if (action.type === constants.EDITOR_DELETE_SUB_EVENT) {
        const oldSubEvents = Object.assign({}, state.values.sub_events);
        const newSubEvents = _.omit(oldSubEvents, action.event);
        return updater(state, {
            values: {
                sub_events: {
                    $set: newSubEvents
                }
            }
        });
    }
    if (action.type === constants.EDITOR_UPDATE_SUB_EVENT) {
        return updater(state, {
            values: {
                sub_events: {
                    [action.eventKey]: {
                        [action.property]: { $set: action.value }
                    }
                }
            }
        })
    }
    if (action.type === constants.EDITOR_SETLANGUAGES) {
        return Object.assign({}, state, {
            contentLanguages: action.languages
        });
    }

    if(action.type === constants.VALIDATE_FOR) {
        return Object.assign({}, state, {
            validateFor: action.validateFor
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
            values: {},
            validationErrors: {},
            validateFor: null,
            validationStatus: constants.VALIDATION_STATUS.CLEARED
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
        return state;
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
            values: newValues,
            contentLanguages: getContentLanguages(action.event),
        })
    }

    if (action.type === constants.SELECT_IMAGE_BY_ID) {
        let newVal = getIfExists(action, 'img', null)
        // Merge new values to existing values
        let newValues = Object.assign({}, state.values, {image: newVal})
        return Object.assign({}, state, {
            values: newValues
        })
    }

    if(action.type === constants.SET_VALIDATION_ERRORS) {
        return Object.assign({}, state, {
            validationErrors: action.errors,
            validationStatus: constants.VALIDATION_STATUS.RESOLVE
        })
    }

    return state
}

export default update
