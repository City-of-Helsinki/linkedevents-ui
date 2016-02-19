import fetch from 'isomorphic-fetch'

import constants from '../constants'
import {mapUIDataToAPIFormat} from 'src/utils/formDataMapping.js'

import { pushPath } from 'redux-simple-router'
import { setFlashMsg, confirmAction } from './app'

import {doValidations} from 'src/validation/validator.js'

/**
 * Set editor form data
 * @param {obj} formValues      new form values
 */
export function setData(formValues) {
    return {
        type: constants.EDITOR_SETDATA,
        values: formValues
    }
}

/**
 * Replace all editor values
 * @param  {obj} formValues     new form values to replace all existing values
 */
export function replaceData(formValues) {
    return {
        type: constants.EDITOR_REPLACEDATA,
        values: formValues
    }
}

/**
 * Clear all editor form data
 */
export function clearData() {
    return {
        type: constants.EDITOR_CLEARDATA
    }
}

/**
 * Set validation errors for editor (shown with validation popovers)
 * @param {obj} errors
 * @param {string} validateFor    the publication status of the document
 */
export function setValidationErrors(errors, validateFor) {
    return {
        type: constants.SET_VALIDATION_ERRORS,
        errors: errors
    }
}

// Send data and create sendDataComplete event afterwards
export function sendData(formValues, user, updateExisting = false) {
    return (dispatch) => {
        // Set publication status for editor values. This is used by the validation to determine
        // which set of rules to use
        dispatch(setData({publication_status: formValues.publication_status}))

        // Run validations
        let validationErrors = doValidations(formValues)

        // There are validation errors, don't continue sending
        if (_.keys(validationErrors).length > 0) {
            return dispatch(setValidationErrors(validationErrors))
        }

        let url = `${appSettings.api_base}/event/`

        if(updateExisting) {
            url += `${formValues.id}/`
        }

        let token = ''
        if(user) {
             token = user.token
        }

        return fetch(url, {
            method: updateExisting ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token,
            },
            body: JSON.stringify(mapUIDataToAPIFormat(formValues))
        }).then(response => {
            //console.log('Received', response)
            let jsonPromise = response.json()

            jsonPromise.then(json => {
                let actionName = updateExisting ? 'update' : 'create'

                if(response.status === 200 || response.status === 201) {
                    dispatch(sendDataComplete(json, actionName))
                }
                // Validation errors
                else if(response.status === 400) {
                    json.apiErrorMsg = 'validation-error'
                    dispatch(sendDataComplete(json, actionName))
                }

                // Auth errors
                else if(response.status === 401 || response.status === 403) {
                    json.apiErrorMsg = 'authorization-required'
                    dispatch(sendDataComplete(json, actionName))
                }

                else {
                    json.apiErrorMsg = 'server-error'
                    dispatch(sendDataComplete(json, actionName))
                }
            })
        })
        .catch(e => {
            dispatch(setFlashMsg('no-connection', 'error'))
        })
    }
}

export function sendDataComplete(json, action) {
    return (dispatch) => {
        if(json.apiErrorMsg) {
            dispatch(setFlashMsg(json.apiErrorMsg, 'error', json))
            dispatch({
                type: constants.EDITOR_SENDDATA_ERROR,
                data: json,
                action: action
            })
        }
        else {
            dispatch(pushPath(`/event/done/${action}/${json.id}`))
            dispatch({
                type: constants.EDITOR_SENDDATA_SUCCESS,
                createdAt: Date.now(),
                data: json
            })
        }
    }
}

// Fetch Hel.fi main category and audience keywords
export function fetchKeywordSets() {
    return (dispatch) => {
        let url = `${appSettings.api_base}/keyword_set/?include=keywords`
        return fetch(url).then((response) => {

            // Try again after a delay
            if (response.status >= 400) {
                setTimeout(e => dispatch(fetchKeywordSets()), 5000);
                return null
            }
            return response.json()
        })
        .then(json => {
            if(json) {
                return dispatch(receiveKeywordSets(json))
            }
        })
        .catch(e => {
            dispatch(setFlashMsg('no-connection', 'error'))
        })
    }
}

// Receive Hel.fi main category and audience keywords
export function receiveKeywordSets(json) {
    localStorage.setItem('KEYWORDSETS', JSON.stringify(json.data))

    return {
        type: constants.EDITOR_RECEIVE_KEYWORDSETS,
        keywordSets: json.data
    }
}

// Fetch Hel.fi languages
export function fetchLanguages() {
    return (dispatch) => {
        let url = `${appSettings.api_base}/language/`

        // Try again after a delay
        return fetch(url).then((response) => {
            if (response.status >= 400) {
                setTimeout(e => dispatch(fetchLanguages()), 5000);
                return null
            } else {
                return response.json()
            }
        })
        .then(json => {
            if(json) {
                return dispatch(receiveLanguages(json))
            }
        })
        .catch(e => {
            dispatch(setFlashMsg('no-connection', 'error'))
        })
    }
}

// Receive Hel.fi main category and audience keywords
export function receiveLanguages(json) {
    localStorage.setItem('LANGUAGES', JSON.stringify(json.data))

    return {
        type: constants.EDITOR_RECEIVE_LANGUAGES,
        languages: json.data
    }
}

// Fetch data for updating
export function fetchEventForEditing(eventID) {
    let url = `${appSettings.api_base}/event/${eventID}/?include=keywords,location,audience,in_language,external_links`

    if(appSettings.nocache) {
        url += `&nocache=${Date.now()}`
    }

    return (dispatch) => {
        return fetch(url)
            .then(response => response.json())
            .then(json => dispatch(receiveEventForEditing(json)))
            .catch(e => {
                dispatch(setFlashMsg('no-connection', 'error'))
            })
    }
}

// Receive data for updating
export function receiveEventForEditing(json) {
    return {
        type: constants.RECEIVE_EVENT_FOR_EDITING,
        event: json
    }
}

// Fetch data for updating
export function deleteEvent(eventID, user, values) {
    let url = `${appSettings.api_base}/event/${eventID}/`

    let token = ''
    if(user) {
         token = user.token
    }

    return (dispatch) => {
        return fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token,
            }
        }).then(response => {

            if(response.status === 200 || response.status === 201 || response.status === 203 || response.status === 204) {
                dispatch(clearData())
                dispatch(pushPath(`/event/done/delete/${eventID}`))
                dispatch(eventDeleted(values))
            }

            // Auth errors
            else if(response.status === 401 || response.status === 403) {
                let apiErrorMsg = 'authorization-required'
                dispatch(eventDeleted(values, apiErrorMsg))
            }

            // No resource
            else if(response.status === 404) {
                let apiErrorMsg = 'not-found'
                dispatch(eventDeleted(values, apiErrorMsg))
            }

            else {
                let apiErrorMsg = 'server-error'
                dispatch(eventDeleted(values, apiErrorMsg))
            }

        })
        .catch(e => {
            dispatch(setFlashMsg('no-connection', 'error'))
        })
    }
}

// Receive data for updating
export function eventDeleted(values, error) {
    return {
        type: constants.EVENT_DELETED,
        values: values,
        error: error
    }
}
