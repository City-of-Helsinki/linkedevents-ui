import fetch from 'isomorphic-fetch'

import constants from '../constants'
import {mapUIDataToAPIFormat} from 'src/utils/formDataMapping.js'

import { pushPath } from 'redux-simple-router'
import { setFlashMsg, confirmAction } from './app'

// Set data and save it to localStorage
export function setData(formValues) {
    return {
        type: constants.EDITOR_SETDATA,
        values: formValues
    }
}

// Set data and save it to localStorage
export function replaceData(formValues) {
    return {
        type: constants.EDITOR_REPLACEDATA,
        values: formValues
    }
}

// Clear editor data. Called explicitly by the user or
export function clearData() {
    return {
        type: constants.EDITOR_CLEARDATA
    }
}

// Send data and create sendDataComplete event afterwards
// NOTE: values are passed from the editor view. There's no apparent way to access state from here
export function sendData(formValues, user, updateExisting = false) {
    return (dispatch) => {
        //console.log('Sending: ', mapUIDataToAPIFormat(formValues))

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
        let url = `${appSettings.api_base}/keywordset/?include=keywords`

        return fetch(url).then((response) => {
            if (response.status >= 400) {
                return {
                    apiErrorMsg: 'server-error'
                }
            }
            return response.json()
        })
        .then(json => {
            // console.log('Received', json)
            return dispatch(receiveKeywordSets(json))
        })
    }
}

// Receive Hel.fi main category and audience keywords
export function receiveKeywordSets(json) {
    return {
        type: constants.EDITOR_RECEIVE_KEYWORDSETS,
        keywordSets: json.data
    }
}

// Fetch Hel.fi languages
export function fetchLanguages() {
    return (dispatch) => {
        let url = `${appSettings.api_base}/language/`

        return fetch(url).then((response) => {
            if (response.status >= 400) {
                return {
                    apiErrorMsg: 'server-error'
                }
            }
            return response.json()
        })
        .then(json => {
            // console.log('Received', json)
            return dispatch(receiveLanguages(json))
        })
    }
}

// Receive Hel.fi main category and audience keywords
export function receiveLanguages(json) {
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
