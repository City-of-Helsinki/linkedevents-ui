import fetch from 'isomorphic-fetch'

import constants from '../constants'
import {mapUIDataToAPIFormat} from 'src/utils/formDataMapping.js'

import { pushPath } from 'redux-simple-router'

// Clear editor data. Called explicitly by the user or
export function clearFlashMsg() {
    return {
        type: constants.EDITOR_CLEAR_FLASHMSG
    }
}

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
                if(response.status === 200 || response.status === 201) {
                    dispatch(sendDataComplete(json))
                }
                // Validation errors
                else if(response.status === 400) {
                    json.apiErrorMsg = 'validation-error'
                    dispatch(sendDataComplete(json))
                }

                // Auth errors
                else if(response.status === 401 || response.status === 403) {
                    json.apiErrorMsg = 'authorization-required'
                    dispatch(sendDataComplete(json))
                }

                else {
                    json.apiErrorMsg = 'server-error'
                    dispatch(sendDataComplete(json))
                }
            })
        })
    }
}

export function sendDataComplete(json) {
    return (dispatch) => {
        if(json.apiErrorMsg) {
            dispatch({
                type: constants.EDITOR_SENDDATA_ERROR,
                apiErrorMsg: json.apiErrorMsg,
                data: json
            })
        }
        else {
            dispatch(pushPath(`/event/created/${json.id}`))
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
    let url = `${appSettings.api_base}/event/${eventID}/?include=keywords,location,audience,in_language`
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
