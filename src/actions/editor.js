import fetch from 'isomorphic-fetch'
import {includes, keys, pickBy, isUndefined, isNil, get} from 'lodash';

import constants from '../constants'
import {
    mapAPIDataToUIFormat,
    mapUIDataToAPIFormat,
    calculateSuperEventTime,
    combineSubEventsFromEditor,
    createSubEventsFromFormValues,
    updateSubEventsFromFormValues,
} from '../utils/formDataMapping'
import {emptyField, getEventIdFromUrl, nullifyMultiLanguageValues} from '../utils/helpers'

import {push} from 'react-router-redux'
import {setFlashMsg, clearFlashMsg} from './app'

import {doValidations} from 'src/validation/validator.js'
import {fetchSubEventsForSuper} from './subEvents';
import getContentLanguages from '../utils/language'
import {receiveEventDetails, fetchSuperEventDetails, clearSuperEventDetails} from './events'
import client from '../api/client'

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
 * @param  {obj} formData     new form values to replace all existing values
 */
export function replaceData(formData) {
    return (dispatch) => {
        let formObject = mapAPIDataToUIFormat(formData)
        const publicationStatus = formObject.publication_status || constants.PUBLICATION_STATUS.PUBLIC

        // run the validation before copy to a draft
        const validationErrors = doValidations(formObject, getContentLanguages(formObject), publicationStatus)

        // empty id, event_status, and any field that has validation errors
        keys(validationErrors).map(field => {
            formObject = emptyField(formObject, field)
        })
        delete formObject.id
        delete formObject.event_status
        delete formObject.super_event_type
        
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
export const clearData = () =>  ({type: constants.EDITOR_CLEARDATA})

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

const prepareFormValues = (formValues, contentLanguages, user, updateExisting, publicationStatus, dispatch) => {
    // exclude all existing sub events from editing form
    if (updateExisting) {
        formValues.sub_events = pickBy(formValues.sub_events, event => !event['@id'])
    }
    dispatch({type: constants.EDITOR_SENDDATA})
    let recurring = false;
    if(formValues.sub_events) {
        recurring = keys(formValues.sub_events).length > 0
    }

    // nullify language fields that are not included in contentLanguages as they should not be posted
    // merge the "cleaned" multi-language value fields with the form values
    const cleanedFormValues = {...formValues, ...nullifyMultiLanguageValues(formValues, contentLanguages)}

    // Run validations
    const validationErrors = doValidations(cleanedFormValues, contentLanguages, publicationStatus)

    // There are validation errors, don't continue sending
    if (keys(validationErrors).length > 0) {
        return dispatch(setValidationErrors(validationErrors))
    }

    // Format descriptions to HTML
    const descriptionTexts = cleanedFormValues.description
    for (const lang in descriptionTexts) {
        if (descriptionTexts[lang]) {
            const desc = descriptionTexts[lang].replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>').replace(/&/g, '&amp;')
            if (desc.indexOf('<p>') === 0 && desc.substring(desc.length - 4) === '</p>') {
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

    let data = {...cleanedFormValues, publication_status: publicationStatus, description: descriptionTexts}

    // specific processing for event with multiple dates
    if (recurring) {
        data = combineSubEventsFromEditor(data, updateExisting)
        // calculate the super event's start_time and end_time based on its sub events
        const superEventTime = calculateSuperEventTime(data.sub_events)
        data = Object.assign({}, data, {
            super_event_type: constants.SUPER_EVENT_TYPE_RECURRING,
            ...superEventTime,
        })
    }

    return mapUIDataToAPIFormat(data)
}

const executeSendRequest = (formValues, contentLanguages, user, updateExisting, publicationStatus, updatingSubEvents = false) => {
    return (dispatch, getState) => {
        // check publication to decide whether allow the request to happen
        publicationStatus = publicationStatus || formValues.publication_status
        if(!publicationStatus) {
            return
        }
        // prepare the body of the request (event object/array)
        let preparedFormValues
        if (!Array.isArray(formValues)) {
            preparedFormValues = prepareFormValues(formValues, contentLanguages, user, updateExisting, publicationStatus, dispatch)

            if (!preparedFormValues || !keys(preparedFormValues).length > 0) {
                return
            }
        } else if (Array.isArray(formValues) && formValues.length > 0) {
            preparedFormValues = formValues
                .map(formObject => prepareFormValues(formObject, contentLanguages, user, updateExisting, publicationStatus, dispatch))
                .filter(preparedFormObject => !isUndefined(preparedFormObject))

            if (!preparedFormValues.length > 0) {
                return
            }
        }

        // prepare other needed information for request metadata
        let url = `${appSettings.api_base}/event/`
        if (updateExisting && !updatingSubEvents) {
            const updateId = formValues.id || formValues[0].id
            url += `${updateId}/`
        }

        let token = ''
        if (user) {
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
                    // create or update sub events after creating/updating super event successfully
                    if (json.super_event_type === constants.SUPER_EVENT_TYPE_RECURRING) {
                        dispatch(sendRecurringData(formValues, contentLanguages, user, updateExisting, publicationStatus, json['@id']))
                    } else {
                        // re-fetch sub events for a series if done editing non-super events
                        if (updateExisting) {
                            const allSuperEventIds = Object.keys(getState().subEvents.bySuperEventId);
                            const editedEventSuperId = json.super_event
                                && allSuperEventIds.find(id => json.super_event['@id'].includes(id));

                            if (editedEventSuperId) {
                                dispatch(fetchSubEventsForSuper(editedEventSuperId));
                            }
                        }
                    }
                    dispatch(sendDataComplete(json, actionName))
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
}

export function sendData(updateExisting = false, publicationStatus) {
    return (dispatch, getState) => {
        // get needed information from the stat
        const {values: formValues, contentLanguages} = getState().editor
        const user = getState().user

        // prepare and execute the request
        dispatch(executeSendRequest(formValues, contentLanguages, user, updateExisting, publicationStatus))
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

export function sendRecurringData(formValues, contentLanguages, user, updateExisting, publicationStatus, superEventUrl) {
    return (dispatch, getState) => {
        // this tells the executeSendRequest method whether we're updating sub events
        const updatingSubEvents = updateExisting
        let subEventsToSend = updateExisting
            ? updateSubEventsFromFormValues(formValues, getState().subEvents.items)
            : createSubEventsFromFormValues(formValues, updateExisting, superEventUrl)

        if(subEventsToSend.length > 0) {
            dispatch(executeSendRequest(subEventsToSend, contentLanguages, user, updateExisting, publicationStatus, updatingSubEvents))
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
export const fetchEventForEditing = eventID => {
    return async (dispatch) => {
        try {
            const response = await client.get(`event/${eventID}/`, {
                include: 'keywords,location,audience,in_language,external_links,image',
                nocache: Date.now(),
            })
            const data = response.data
            const superEventUrl = get(data, ['super_event', '@id'])

            dispatch(receiveEventForEditing(data))
            dispatch(receiveEventDetails(data))
            // update editor content languages based on received event data
            dispatch(setLanguages(getContentLanguages(data)))

            // fetch super event for the received event if it has one,
            // otherwise clear existing one from store
            !isNil(superEventUrl)
                ? dispatch(fetchSuperEventDetails(getEventIdFromUrl(superEventUrl)))
                : dispatch(clearSuperEventDetails())
        } catch (error) {
            new Error(error)
        }
    }
}

// Receive data for updating
export function receiveEventForEditing(json) {
    return {
        type: constants.RECEIVE_EVENT_FOR_EDITING,
        event: json,
    }
}

// recursively cancel an event and its sub events
export function cancelEvent(eventId, user, values) {
    const isSuperEvent = values.super_event_type === constants.SUPER_EVENT_TYPE_RECURRING;

    return (dispatch, getState) => {

        let url = `${appSettings.api_base}/event/${eventId}/`

        let token = ''
        if(user) {
            token = user.token
        }
        // this should be an event object that matchs api event scheme
        const data = Object.assign({}, values, {event_status: constants.EVENT_STATUS.CANCELLED})

        return fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token,
            },
            body: JSON.stringify(data),
        }).then(response => {
            let jsonPromise = response.json()

            jsonPromise.then(json => {
                let actionName = 'cancel'

                if(response.status === 200 || response.status === 201) {
                    if (isSuperEvent) {
                        const subEvents = getState().subEvents.items;
                        subEvents.forEach(event => dispatch(cancelEvent(event.id, user, event)));
                        dispatch(fetchSubEventsForSuper(json.id));
                    }
                    const allSuperEventIds = Object.keys(getState().subEvents.bySuperEventId);
                    const cancelledEventSuperId = json.super_event
                        && allSuperEventIds.find(id => json.super_event['@id'].includes(id));
                    // re-fetch sub events data after cancelling non-super event
                    if (cancelledEventSuperId) {
                        dispatch(fetchSubEventsForSuper(cancelledEventSuperId));
                    }
                    dispatch(sendDataComplete(json, actionName));
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

export function postDeleteEvent (values) {
    return (dispatch) => {
        // reset/update redux app state, data clearance
        dispatch(clearData());
        dispatch(push('/'));
        dispatch(eventDeleted(values));
        dispatch(setFlashMsg(constants.EVENT_CREATION.DELETE_SUCCESS));
    }
}

// recursively delete super event and its sub events
export function deleteEvent(eventID, user, values, recursing = false) {
    let url = `${appSettings.api_base}/event/${eventID}/`

    let token = ''
    if(user) {
        token = user.token
    }
    const isSuperEvent = values.super_event_type === constants.SUPER_EVENT_TYPE_RECURRING;

    return (dispatch, getState) => {
        return fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token,
            },
        }).then(response => {

            if(response.status === 200 || response.status === 201 || response.status === 203 || response.status === 204) {
                if (isSuperEvent) {
                    // if the previously deleted is a super event, continue to delete its sub events recursively
                    const subEvents = getState().subEvents.items;
                    subEvents.forEach(event => dispatch(deleteEvent(event.id, user, event, true)));
                }
                // only redirect if done deleting the whole series (when recursion stops)
                if (!recursing) {
                    dispatch(postDeleteEvent(values));
                }
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

export function setEditorAuthFlashMsg () {
    return (dispatch, getState) => {
        const {router, user} = getState()
        const pathName = get(router, ['location', 'pathname'])
        const isEditorRoute = ['/event/update/', '/event/create/'].some(path => pathName.includes(path))

        if (isEditorRoute) {
            isNil(user)
                ? dispatch(setFlashMsg('editor-authorization-required', 'error', {sticky: true}))
                : dispatch(clearFlashMsg())
        }
    }
}
