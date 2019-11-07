import {isArray, isNil, isNull, set, some, get, keys} from 'lodash';
import CONSTANTS from '../constants'
import moment from 'moment';

const {VALIDATION_RULES, CHARACTER_LIMIT} = CONSTANTS
/**
 * Get text limit base on it's rule
 * @param {string} Rulename - Validation rule
 * @return {number} Character limit 
 * @return {null} Return false if they're not string count rules
 */
export const getCharacterLimitByRule = (ruleName) => {
    if(ruleName === VALIDATION_RULES.SHORT_STRING) {
        return CHARACTER_LIMIT.SHORT_STRING
    }
    if(ruleName === VALIDATION_RULES.MEDIUM_STRING) {
        return CHARACTER_LIMIT.MEDIUM_STRING
    }
    if(ruleName === VALIDATION_RULES.LONG_STRING) {
        return CHARACTER_LIMIT.LONG_STRING
    }
    return null
}

/**
 * Check if text input is reaching the limit
 * @param  {object || string } value
 * @param  {int} limit
 * @return {boolean} validation status
 */
export const textLimitValidator = (value, limit) => {
    if (typeof value === 'object') {
        return !some(value, item => !isNull(item) && item.length > limit)
    } else if (typeof value === 'string') {
        return value.length <= limit
    }
    return true
}

// set a property of an object to empty value based on its type
export const emptyField = (object, field) => {
    let value = object[field];
    const fieldValueType = isArray(value) ? 'array' : typeof value;
    
    switch (fieldValueType) {
        case 'array':
            value = []
            break
        case 'object':
            value = {}
            break
        case 'string':
        case 'number':
            value = ''
            break
        default:
    }

    return Object.assign({}, object, {[field]: value})
}

/**
 * Nullifies multi language fields based on selected languages
 * @param   {object}    formValues          form containing the multi language field that will be nullified
 * @param   {array}     contentLanguages    selected languages
 * @return  {boolean}                       nullified multi language fields for unselected languages
 */
export const nullifyMultiLanguageValues = (formValues, contentLanguages) => {
    const multiLanguageFields = ['name', 'description', 'short_description', 'provider', 'location_extra_info', 'info_url', 'offers']

    const nullifyField = value => Object.keys(value)
        .reduce((acc, key) => set(acc, key, contentLanguages.includes(key) ? value[key] : null), {})

    const multiLanguageValues = {}

    for (const field of multiLanguageFields) {
        const fieldValue = formValues[field];
        // some multi-language fields might not have a value
        if (isNil(fieldValue)) {
            continue
        }
        if (field === 'offers') {
            multiLanguageValues[field] = []
            // nullify multi-language fields for every offer
            fieldValue.forEach((offer, index) => {
                multiLanguageValues[field].push(offer)
                Object.keys(offer)
                    // filter out the is_free key
                    .filter(key => key !== 'is_free')
                    .forEach(key => multiLanguageValues[field][index][key] = !isNil(offer[key]) ? nullifyField(offer[key]) : null)
            })
            continue
        }
        multiLanguageValues[field] = nullifyField(fieldValue)
    }
    return multiLanguageValues
}

/**
 * Returns the additional markup for the confirmation dialog based on given action type
 * @param action        Either 'update', 'delete' or 'cancel'
 * @param intl          React Intl
 * @param subEvents     Possible sub events for the event
 * @returns {string}    Markup for the confirmation dialog
 */
export const getConfirmationMarkup = (action, intl, subEvents = [])  => {
    const warningText = `<p>${intl.formatMessage({id: `editor-${action}-warning`})}</p>`
    let subEventWarningText = intl.formatMessage({id: `editor-${action}-subevents-warning`})
    subEventWarningText = subEventWarningText === `editor-${action}-subevents-warning`
        ? ''
        : `<p>${subEventWarningText}</p>`
    const subEventNames = subEvents
        // sort sub events by start time
        .sort((a, b) => moment(a.start_time).unix() - moment(b.start_time).unix())
        .map((subEvent, index) => `${index === 0 ? '' : '</br>'}<strong>${subEvent.name.fi}</strong> (${moment(subEvent.start_time).format('DD.MM.YYYY')})`)

    return subEventNames.length > 0
        ? `${warningText}${subEventWarningText}${subEventNames}`
        : warningText
}

/**
 * Returns the event id from given URL
 * @param url                     URL to get the event ID from
 * @returns {string|undefined}    Event ID
 */
export const getEventIdFromUrl = url  => {
    return typeof url === 'string'
        ? url.substring(url.indexOf('/event/') + '/event/'.length, url.lastIndexOf('/'))
        : undefined
}

/**
 * Scrolls to the top of the page
 */
export const scrollToTop = ()  => window.scrollTo(0, 0)

/**
 * Returns the first defined value of a multi-language field
 * @param field             Multi-language field to get the value from
 * @param contentLanguages  Optional. If given, the value will only be looked for, for the given languages
 * @returns {string}
 */
export const getFirstMultiLanguageFieldValue = (field, contentLanguages = null) => {
    return isArray(contentLanguages)
        ? get(field, keys(field).filter(key => contentLanguages.includes(key)).find(key => !isNil(field[key])), '')
        : get(field, keys(field).find(key => !isNil(field[key])), '')
}
