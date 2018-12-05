import fetch from 'isomorphic-fetch'
import moment from 'moment';
import {includes, keys} from 'lodash';

import constants from '../constants'
import {
    mapUIDataToAPIFormat,
    calculateSuperEventTime,
    combineSubEventsFromEditor,
} from '../utils/formDataMapping'
import {emptyField} from '../utils/helpers'

import {push} from 'react-router-redux'
import {setFlashMsg, confirmAction} from './app'

import {doValidations} from 'src/validation/validator.js'

/**
 * Set editor form data
 * @param {obj} formValues      new form values
 */
export function setData(values) {
    return {
        type: constants.EDITOR_SETDATA,
        values,
    }
}

export function updateSubEvent(value, property, eventKey) {
    return {
        type: constants.EDITOR_UPDATE_SUB_EVENT,
        value,
        property,
        eventKey,
    }
}
export function deleteSubEvent(event) {
    return {
        type: constants.EDITOR_DELETE_SUB_EVENT,
        event,
    }
}
export function sortSubEvents() {
    return {
        type: constants.EDITOR_SORT_SUB_EVENTS,
    }
}
export function setEventData(values, key) {
    return {
        type: constants.EDITOR_SETDATA,
        key,
        values,
        event: true,
    }
}
export function setOfferData(values, key) {
    return {
        type: constants.EDITOR_SETDATA,
        key,
        values,
        offer: true,
    }
}
export function addOffer(values) {
    return {
        type: constants.EDITOR_ADD_OFFER,
        values,
    }
}
export function deleteOffer(offerKey) {
    return {
        type: constants.EDITOR_DELETE_OFFER,
        offerKey,
    }
}
export function setFreeOffers(isFree) {
    return {
        type: constants.EDITOR_SET_FREE_OFFERS,
        isFree,
    }
}
export function setLanguages(languages) {
    return {
        type: constants.EDITOR_SETLANGUAGES,
        languages: languages,
    }
}

/**
 * Replace all editor values
 * @param  {obj} formValues     new form values to replace all existing values
 */
export function replaceData(formValues) {
    return (dispatch, getState) => {
        const {contentLanguages} = getState().editor
        let formObject = formValues
        const publicationStatus = formValues.publication_status || constants.PUBLICATION_STATUS.PUBLIC

        // run the validation before copy to a draft
        const validationErrors = doValidations(formValues, contentLanguages, publicationStatus)

        // empty any field that has validation errors
        keys(validationErrors).map(field => {
            formObject = emptyField(formObject, field)
        })

        dispatch(validateFor(publicationStatus))
        dispatch(setValidationErrors({}))
        dispatch({
            type: constants.EDITOR_REPLACEDATA,
            values: formObject,
        })
    }
}

/**
 * Clear all editor form data
 */
export function clearData() {
    return {
        type: constants.EDITOR_CLEARDATA,
    }
}

/**
 * Set validation errors for editor (shown with validation popovers)
 * @param {obj} errors
 */
export function setValidationErrors(errors) {
    return (dispatch) => {
        dispatch({
            type: constants.SET_VALIDATION_ERRORS,
            errors: errors,
        })
    }
}

export function validateFor(publicationStatus) {
    if(publicationStatus === constants.PUBLICATION_STATUS.PUBLIC || publicationStatus === constants.PUBLICATION_STATUS.DRAFT) {
        return {
            type: constants.VALIDATE_FOR,
            validateFor: publicationStatus,
        }
    } else {
        return {
            type: constants.VALIDATE_FOR,
            validateFor: null,
        }
    }
}

/**
 * Send form values data. A UI to API data mapping is done before sending the values
 * @param  {[type]} formValues              [description]
 * @param  {[type]} user                    [description]
 * @param  {[type]} updateExisting = false  [description]
 * @param  {[type]} publicationStatus       [description]
 * @return {[type]}                         [description]
 */

const multiLanguageFields = ['name', 'description', 'short_description', 'provider', 'location_extra_info']

const prepareFormValues = (formValues, contentLanguages, user, updateExisting, publicationStatus, dispatch) => {
    dispatch({type: constants.EDITOR_SENDDATA})
    let recurring = false;
    if(formValues.sub_events) {
        recurring = keys(formValues.sub_events).length > 0
    }
    // Run validations
    let validationErrors = doValidations(formValues, contentLanguages, publicationStatus)

    // There are validation errors, don't continue sending
    if (keys(validationErrors).length > 0) {
        return dispatch(setValidationErrors(validationErrors))
    }

    const multiLanguageValues = {}
    // Language fields not included in contentLanguages should not be posted, they aren't validated anyway
    for (var field of multiLanguageFields) {
        for (const lang in formValues[field]) {
            if (!(field in multiLanguageValues)) {
                multiLanguageValues[field] = {}
            }
            if (contentLanguages.includes(lang)) {
                multiLanguageValues[field][lang] = formValues[field][lang]
            } else {
                // Null is needed here to overwrite any existing strings in the backend
                multiLanguageValues[field][lang] = null
            }
        }
    }

    // Format descriptions to HTML
    const descriptionTexts = formValues.description
    for (const lang in formValues.description) {
        if (formValues.description[lang]) {
            const desc = formValues.description[lang].replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>').replace(/&/g, '&amp;')
            if (desc.indexOf('<p>') === 0 && desc.substr(desc.length - 4) === '</p>') {
                descriptionTexts[lang] = desc
            } else {
                descriptionTexts[lang] = `<p>${desc}</p>`
            }
        }
    }
    // Check for 'palvelukeskuskortti' in audience
    if (formValues.audience && includes(formValues.audience, `${appSettings.api_base}/keyword/helsinki:aflfbat76e/`)) {
        const specialDescription = '<p>Tapahtuma on tarkoitettu vain eläkeläisille ja työttömille, joilla on <a href="https://www.hel.fi/sote/fi/palvelut/palvelukuvaus?id=3252" target="_blank">palvelukeskuskortti</a>.</p>'
        if (formValues.description && formValues.description.fi && descriptionTexts.fi) {
            if (!includes(formValues.description.fi, 'https://www.hel.fi/sote/fi/palvelut/palvelukuvaus?id=3252')) { // Don't repeat insertion
                descriptionTexts.fi = specialDescription + formValues.description.fi
            }
        } else {
            descriptionTexts.fi = specialDescription
        }
    }

    let data = Object.assign({}, formValues, multiLanguageValues, {publication_status: publicationStatus, description: descriptionTexts})
    
    // specific processing for event with multiple dates
    if (recurring) {
        data = combineSubEventsFromEditor(data)
        // calculate the super event's start_time and end_time based on its sub events
        const superEventTime = calculateSuperEventTime(data.sub_events)
        data = Object.assign({}, data, {
            super_event_type: 'recurring',
            ...superEventTime,
        })
    }

    return mapUIDataToAPIFormat(data)
}

const executeSendRequest = (formValues, contentLanguages, user, updateExisting, publicationStatus, dispatch) => {
    // check publication to decide whether allow the request to happen
    publicationStatus = publicationStatus || formValues.publication_status

    if(!publicationStatus) {
        return
    }

    // prepare the body of the request (event object/array)
    let preparedFormValues
    if(!Array.isArray(formValues)) {
        preparedFormValues = {}
        const newValues = prepareFormValues(formValues, contentLanguages, user, updateExisting, publicationStatus, dispatch)
        if(newValues !== undefined) {
            preparedFormValues = newValues
        } else {
            return
        }
    } else if(Array.isArray(formValues) && formValues.length > 0) {
        preparedFormValues = []
        formValues.map(formObject => {
            const newValues = prepareFormValues(formObject, contentLanguages, user, updateExisting, publicationStatus, dispatch)
            if(newValues !== undefined) {
                preparedFormValues.push(newValues)
            } else {
                return
            }
        })
    }

    // prepare other needed information for request matedata
    let url = `${appSettings.api_base}/event/`
    if(updateExisting) {
        const updateId = formValues.id || formValues[0].id
        url += `${updateId}/`
    }

    let token = ''
    if(user) {
        token = user.token
    }

    dispatch(validateFor(publicationStatus))
    return fetch(url, {
        method: updateExisting ? 'PUT' : 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + token,
        },
        body: JSON.stringify(preparedFormValues),
    }).then(response => {
        let jsonPromise = response.json()

        jsonPromise.then(json => {
            let actionName = updateExisting ? 'update' : 'create'
            if(Array.isArray(json)) {
                json = json[0]
            }
            // The publication_status was changed to public. The event was published!
            if(json.publication_status === constants.PUBLICATION_STATUS.PUBLIC && json.publication_status !== formValues.publication_status) {
                actionName = 'publish'
            } else if ( json.publication_status === constants.PUBLICATION_STATUS.PUBLIC ) {
                actionName = 'savepublic'
            } else if ( json.publication_status === constants.PUBLICATION_STATUS.DRAFT ) {
                actionName = 'savedraft'
            }

            if(response.status === 200 || response.status === 201) {
                // create sub events after creaing super event successfully
                if (json.super_event_type === 'recurring') {
                    const formWithAllSubEvents = combineSubEventsFromEditor(formValues)
                    dispatch(
                        sendRecurringData(formWithAllSubEvents, contentLanguages, user, updateExisting, publicationStatus, json['@id'])
                    )
                } else {
                    dispatch(sendDataComplete(json, actionName))
                }
            }
            // Validation errors
            else if(response.status === 400) {
                json.apiErrorMsg = 'validation-error'
                json.response = response
                dispatch(sendDataComplete(json, actionName))
            }

            // Auth errors
            else if(response.status === 401 || response.status === 403) {
                json.apiErrorMsg = 'authorization-required'
                json.response = response
                dispatch(sendDataComplete(json, actionName))
            }

            else {
                json.apiErrorMsg = 'server-error'
                json.response = response
                dispatch(sendDataComplete(json, actionName))
            }
        })
    })
        .catch(e => {
            // Error happened while fetching ajax (connection or javascript)
        })
}

export function sendData(updateExisting = false, publicationStatus) {
    return (dispatch, getState) => {
        // get needed information from the state
        const {values: formValues, contentLanguages} = getState().editor
        const user = getState().user
        // prepare and execute the request
        executeSendRequest(formValues, contentLanguages, user, updateExisting, publicationStatus, dispatch)
    }
}

export function sendDataComplete(json, action) {
    return (dispatch) => {
        if(json.apiErrorMsg) {
            console.log('The api returned json', json)
            dispatch(setFlashMsg(json.apiErrorMsg, 'error', json))
            dispatch({
                type: constants.EDITOR_SENDDATA_ERROR,
                data: json,
                action: action,
            })
        }
        else {
            dispatch(push(`/event/done/${action}/${json.id}`))
            dispatch({
                type: constants.EDITOR_SENDDATA_SUCCESS,
                createdAt: Date.now(),
                data: json,
            })
        }
    }
}

export function sendRecurringData(formValues, contentLanguages, user, updateExisting = false, publicationStatus, superEventId) {
    return (dispatch) => {
        const subEvents = Object.assign({}, formValues.sub_events)
        const baseEvent = Object.assign({}, formValues, {sub_events: {}, super_event: {'@id': superEventId}})
        const newValues = []
        for (const key in subEvents) {
            if (subEvents.hasOwnProperty(key)) {
                newValues.push(Object.assign({}, baseEvent, {start_time: subEvents[key].start_time, end_time: subEvents[key].end_time}))
            }
        }
        if(newValues.length > 0) {
            executeSendRequest(newValues, contentLanguages, user, updateExisting = false, publicationStatus, dispatch)
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
                // Error happened while fetching ajax (connection or javascript)
            })
    }
}

// Receive Hel.fi main category and audience keywords
export function receiveKeywordSets(json) {
    localStorage.setItem('KEYWORDSETS', JSON.stringify(json.data))

    return {
        type: constants.EDITOR_RECEIVE_KEYWORDSETS,
        keywordSets: json.data,
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
                // Error happened while fetching ajax (connection or javascript)
            })
    }
}

// Receive Hel.fi main category and audience keywords
export function receiveLanguages(json) {
    localStorage.setItem('LANGUAGES', JSON.stringify(json.data))

    return {
        type: constants.EDITOR_RECEIVE_LANGUAGES,
        languages: json.data,
    }
}

// Fetch data for updating
export function fetchEventForEditing(eventID, user = {}) {
    let url = `${appSettings.api_base}/event/${eventID}/?include=keywords,location,audience,in_language,external_links,image`

    if(appSettings.nocache) {
        url += `&nocache=${Date.now()}`
    }

    let options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }

    if(user && user.token) {
        Object.assign(options.headers, {
            'Authorization': 'JWT ' + user.token,
        })
    }

    return (dispatch) => {
        return fetch(url, options)
            .then(response => response.json())
            .then(json => dispatch(receiveEventForEditing(json)))
            .catch(e => {
                // Error happened while fetching ajax (connection or javascript)
            })
    }
}

// Receive data for updating
export function receiveEventForEditing(json) {
    return {
        type: constants.RECEIVE_EVENT_FOR_EDITING,
        event: json,
    }
}

export function cancelEvent(eventId, user, values) {
    return (dispatch) => {

        let url = `${appSettings.api_base}/event/${values.id}/`

        let token = ''
        if(user) {
            token = user.token
        }

        let data = Object.assign({}, values, {event_status: constants.EVENT_STATUS.CANCELLED})

        return fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token,
            },
            body: JSON.stringify(mapUIDataToAPIFormat(data)),
        }).then(response => {
            //console.log('Received', response)
            let jsonPromise = response.json()

            jsonPromise.then(json => {
                let actionName = 'cancel'

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
                // Error happened while fetching ajax (connection or javascript)
            })
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
            },
        }).then(response => {

            if(response.status === 200 || response.status === 201 || response.status === 203 || response.status === 204) {
                dispatch(clearData())
                dispatch(push(`/event/done/delete/${eventID}`))
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
                // Error happened while fetching ajax (connection or javascript)
            })
    }
}

// Receive data for updating
export function eventDeleted(values, error) {
    return {
        type: constants.EVENT_DELETED,
        values: values,
        error: error,
    }
}
