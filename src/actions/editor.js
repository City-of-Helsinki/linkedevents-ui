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
import {emptyField, nullifyMultiLanguageValues, scrollToTop} from '../utils/helpers'

import {push} from 'react-router-redux'
import {setFlashMsg, clearFlashMsg} from './app'

import {doValidations} from 'src/validation/validator.js'
import getContentLanguages from '../utils/language'
import client from '../api/client'
import {getSuperEventId} from '../utils/events'

const {PUBLICATION_STATUS, SUPER_EVENT_TYPE_RECURRING, EVENT_CREATION} = constants

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
    return (dispatch, getState) => {
        const {keywordSets} = getState().editor
        let formObject = mapAPIDataToUIFormat(formData)
        const publicationStatus = formObject.publication_status || PUBLICATION_STATUS.PUBLIC

        // run only draft level validation before copying
        const validationErrors = doValidations(formObject, getContentLanguages(formObject), PUBLICATION_STATUS.DRAFT, keywordSets)

        // empty id, event_status, and any field that has validation errors
        keys(validationErrors).map(field => {
            formObject = emptyField(formObject, field)
        })
        delete formObject.id
        delete formObject.event_status
        delete formObject.super_event_type
        formObject.sub_events = {}

        // here, we do more thorough validation
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
    if(publicationStatus === PUBLICATION_STATUS.PUBLIC || publicationStatus === PUBLICATION_STATUS.DRAFT) {
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
 * Prepares and validates the form values
 * @param formValues        Form data
 * @param contentLanguages  Form languages
 * @param user              User data
 * @param updateExisting    Whether we're updating an existing event
 * @param publicationStatus Publication status
 * @param dispatch
 * @param keywordSets       Keyword sets that are passed to the validator, so that we can validate against them
 * @returns {{}|*}
 */
export const prepareFormValues = (
    formValues,
    contentLanguages,
    user,
    updateExisting,
    publicationStatus,
    dispatch,
    keywordSets,
) => {
    // exclude all existing sub events from editing form
    if (updateExisting) {
        formValues.sub_events = pickBy(formValues.sub_events, event => !event['@id'])
    }

    let recurring = false;

    if(formValues.sub_events) {
        recurring = keys(formValues.sub_events).length > 0
    }

    // nullify language fields that are not included in contentLanguages as they should not be posted
    // merge the "cleaned" multi-language value fields with the form values
    const cleanedFormValues = {...formValues, ...nullifyMultiLanguageValues(formValues, contentLanguages)}

    // Run validations
    const validationErrors = doValidations(cleanedFormValues, contentLanguages, publicationStatus, keywordSets)

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
            super_event_type: SUPER_EVENT_TYPE_RECURRING,
            ...superEventTime,
        })
    }

    return mapUIDataToAPIFormat(data)
}

/**
 * Sends the prepared form values to the backend
 * @param formValues        Form data
 * @param updateExisting    Whether we're updating an existing event
 * @param publicationStatus Publication status
 * @param subEvents         Sub event data
 * @param updatingSubEvents Whether we're updating sub events
 * @returns {Function}
 */
export const executeSendRequest = (
    formValues,
    updateExisting,
    publicationStatus,
    subEvents,
    updatingSubEvents = false,
) => async (dispatch, getState) => {

    // get needed information from the state
    const {keywordSets, contentLanguages} = getState().editor
    const user = getState().user

    // check publication status to decide whether to allow the request to happen
    publicationStatus = publicationStatus || formValues.publication_status

    if (!publicationStatus || !formValues) {
        return
    }

    dispatch(validateFor(publicationStatus))

    // prepare the body of the request (event object/array)
    let preparedFormValues

    if (!Array.isArray(formValues)) {
        preparedFormValues = prepareFormValues(formValues, contentLanguages, user, updateExisting, publicationStatus, dispatch, keywordSets)

        if (!preparedFormValues || !keys(preparedFormValues).length > 0) {
            return
        }
    } else if (Array.isArray(formValues) && formValues.length > 0) {
        preparedFormValues = formValues
            .map(formObject => prepareFormValues(formObject, contentLanguages, user, updateExisting, publicationStatus, dispatch, keywordSets))
            .filter(preparedFormObject => !isUndefined(preparedFormObject))

        if (!preparedFormValues.length > 0) {
            return
        }
    }

    const url = updateExisting && !updatingSubEvents
        ? `event/${formValues.id}`
        : 'event'

    try {
        const response = updateExisting
            ? await client.put(url, preparedFormValues)
            : await client.post(url, preparedFormValues)

        let data = response.data
        let createdEventId = data.id
        let actionName = updateExisting ? 'update' : 'create'

        // if data is an array, then we can assume that we created/updated sub events.
        // use the first item to get the publication status and super event ID.
        if (Array.isArray(data)) {
            data = data[0]
            createdEventId = getSuperEventId(data)
        }

        // flash message is shown according to the actionName value
        if (
            data.publication_status === PUBLICATION_STATUS.PUBLIC
            && data.publication_status !== formValues.publication_status
        ) {
            actionName = EVENT_CREATION.PUBLISH
        } else if (data.publication_status === PUBLICATION_STATUS.PUBLIC ) {
            actionName = EVENT_CREATION.SAVE_PUBLIC
        } else if (data.publication_status === PUBLICATION_STATUS.DRAFT ) {
            actionName = EVENT_CREATION.SAVE_DRAFT
        }

        // handle sub events if we created/updated a recurring event
        if (!isNil(data) && data.super_event_type === SUPER_EVENT_TYPE_RECURRING) {
            dispatch(sendRecurringData(
                formValues,
                updateExisting,
                publicationStatus,
                data['@id'],
                subEvents
            ))
            return
        }

        // validation errors
        if (response.status === 400) {
            data.apiErrorMsg = 'validation-error'
            data.response = response
        }

        // auth errors
        if (response.status === 401 || response.status === 403) {
            data.apiErrorMsg = 'authorization-required'
            data.response = response
        }

        dispatch(sendDataComplete(createdEventId, data, actionName))
    } catch (error) {
        dispatch(setFlashMsg('server-error', 'error', error))
        new Error(error)
    }
}

/**
 *
 * @param createdEventId
 * @param data
 * @param action
 */
export const sendDataComplete = (createdEventId, data, action) => (dispatch) => {
    if (data.apiErrorMsg) {
        dispatch(setFlashMsg(data.apiErrorMsg, 'error', data))
    }
    else {
        dispatch(push(`/event/done/${action}/${createdEventId}`))
        dispatch({type: constants.EDITOR_SENDDATA_SUCCESS})
        scrollToTop()
    }
}

export const sendRecurringData = (
    formValues,
    updateExisting,
    publicationStatus,
    superEventUrl,
    subEvents
) => (dispatch) => {
    // this tells the executeSendRequest method whether we're updating sub events
    const updatingSubEvents = updateExisting
    const subEventsToSend = updateExisting
        ? updateSubEventsFromFormValues(formValues, subEvents)
        : createSubEventsFromFormValues(formValues, updateExisting, superEventUrl)

    if (subEventsToSend.length > 0) {
        dispatch(executeSendRequest(
            subEventsToSend,
            updateExisting,
            publicationStatus,
            null,
            updatingSubEvents
        ))
    }
}

// Fetch keyword sets
export const fetchKeywordSets = () => async (dispatch) => {
    try {
        const response = await client.get('keyword_set', {include: 'keywords'})
        const keywordSets = response.data.data

        dispatch(receiveKeywordSets(keywordSets))
    } catch (e) {
        throw Error(e)
    }
}

// Receive Hel.fi main category and audience keywords
export const receiveKeywordSets = (keywordSets) => {
    localStorage.setItem('KEYWORDSETS', JSON.stringify(keywordSets))

    return {
        type: constants.EDITOR_RECEIVE_KEYWORDSETS,
        keywordSets,
    }
}

// Fetch languages
export const fetchLanguages = () => async (dispatch) => {
    try {
        const response = await client.get('language')
        const languages = response.data.data

        dispatch(receiveLanguages(languages))
    } catch (e) {
        throw Error(e)
    }
}

// Receive languages
export const receiveLanguages = (languages) => {
    localStorage.setItem('LANGUAGES', JSON.stringify(languages))

    return {
        type: constants.EDITOR_RECEIVE_LANGUAGES,
        languages,
    }
}

export const setEventForEditing = (eventData) => {
    return (dispatch) => {
        dispatch({
            type: constants.RECEIVE_EVENT_FOR_EDITING,
            event: eventData,
        })
        dispatch(setLanguages(getContentLanguages(eventData)))
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
