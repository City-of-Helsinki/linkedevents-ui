import CONSTANTS from '../constants'
import validationFn from './validationRules'
import {getCharacterLimitByRule} from '../utils/helpers'
import {each, remove, pickBy, isEmpty, omitBy} from 'lodash'
import moment from 'moment'

const {
    VALIDATION_RULES,
    PUBLICATION_STATUS,
} = CONSTANTS


// Validations for draft
const draftValidations = {
    name: [VALIDATION_RULES.REQUIRE_MULTI, VALIDATION_RULES.REQUIRED_IN_CONTENT_LANGUAGE],
    location: [VALIDATION_RULES.REQUIRE_AT_ID],
    start_time: [VALIDATION_RULES.REQUIRED_STRING, VALIDATION_RULES.IS_DATE],
    end_time: [VALIDATION_RULES.AFTER_START_TIME, VALIDATION_RULES.IN_THE_FUTURE],
    price: [VALIDATION_RULES.HAS_PRICE],
    short_description: [VALIDATION_RULES.REQUIRE_MULTI, VALIDATION_RULES.REQUIRED_IN_CONTENT_LANGUAGE, VALIDATION_RULES.SHORT_STRING],
    description: [VALIDATION_RULES.REQUIRE_MULTI, VALIDATION_RULES.REQUIRED_IN_CONTENT_LANGUAGE, VALIDATION_RULES.LONG_STRING],
    info_url: [VALIDATION_RULES.IS_URL],
    extlink_facebook: [VALIDATION_RULES.IS_URL],
    extlink_twitter: [VALIDATION_RULES.IS_URL],
    extlink_instagram: [VALIDATION_RULES.IS_URL],
    audience_min_age: [VALIDATION_RULES.IS_INT],
    audience_max_age: [VALIDATION_RULES.IS_INT],
    enrolment_end_time: [VALIDATION_RULES.AFTER_ENROLMENT_START_TIME, VALIDATION_RULES.IN_THE_FUTURE],
    minimum_attendee_capacity: [VALIDATION_RULES.IS_INT],
    maximum_attendee_capacity: [VALIDATION_RULES.IS_INT],
    videos: {
        url: [VALIDATION_RULES.IS_URL, VALIDATION_RULES.REQUIRED_VIDEO_FIELD],
        name: [VALIDATION_RULES.SHORT_STRING, VALIDATION_RULES.REQUIRED_VIDEO_FIELD],
        alt_text: [VALIDATION_RULES.MEDIUM_STRING, VALIDATION_RULES.REQUIRED_VIDEO_FIELD],
    },
}

// Validations for published event
const publicValidations = {
    name: [VALIDATION_RULES.REQUIRE_MULTI, VALIDATION_RULES.REQUIRED_IN_CONTENT_LANGUAGE],
    location: [VALIDATION_RULES.REQUIRE_AT_ID],
    start_time: [VALIDATION_RULES.REQUIRED_STRING, VALIDATION_RULES.IS_DATE, VALIDATION_RULES.DEFAULT_END_IN_FUTURE], // Datetime is saved as ISO string
    end_time: [VALIDATION_RULES.AFTER_START_TIME, VALIDATION_RULES.IS_DATE, VALIDATION_RULES.IN_THE_FUTURE],
    price: [VALIDATION_RULES.HAS_PRICE],
    short_description: [VALIDATION_RULES.REQUIRE_MULTI, VALIDATION_RULES.REQUIRED_IN_CONTENT_LANGUAGE, VALIDATION_RULES.SHORT_STRING],
    description: [VALIDATION_RULES.REQUIRE_MULTI, VALIDATION_RULES.REQUIRED_IN_CONTENT_LANGUAGE, VALIDATION_RULES.LONG_STRING],
    info_url: [VALIDATION_RULES.IS_URL],
    extlink_facebook: [VALIDATION_RULES.IS_URL],
    extlink_twitter: [VALIDATION_RULES.IS_URL],
    extlink_instagram: [VALIDATION_RULES.IS_URL],
    sub_events: {
        start_time: [VALIDATION_RULES.REQUIRED_STRING, VALIDATION_RULES.IS_DATE, VALIDATION_RULES.DEFAULT_END_IN_FUTURE],
        end_time: [VALIDATION_RULES.AFTER_START_TIME, VALIDATION_RULES.IS_DATE, VALIDATION_RULES.IN_THE_FUTURE],
    },
    keywords: [VALIDATION_RULES.AT_LEAST_ONE_MAIN_CATEGORY],
    audience_min_age: [VALIDATION_RULES.IS_INT],
    audience_max_age: [VALIDATION_RULES.IS_INT],
    enrolment_end_time: [VALIDATION_RULES.AFTER_ENROLMENT_START_TIME, VALIDATION_RULES.IN_THE_FUTURE],
    minimum_attendee_capacity: [VALIDATION_RULES.IS_INT],
    maximum_attendee_capacity: [VALIDATION_RULES.IS_INT],
    videos: {
        url: [VALIDATION_RULES.IS_URL, VALIDATION_RULES.REQUIRED_VIDEO_FIELD],
        name: [VALIDATION_RULES.SHORT_STRING, VALIDATION_RULES.REQUIRED_VIDEO_FIELD],
        alt_text: [VALIDATION_RULES.MEDIUM_STRING, VALIDATION_RULES.REQUIRED_VIDEO_FIELD],
    },
}

/**
 * Run draft/public validations depending which document
 * @return {object} Validation errors object
 */
export function doValidations(values, languages, validateFor, keywordSets) {

    // Public validations
    if(validateFor === PUBLICATION_STATUS.PUBLIC) {
        return runValidationWithSettings(values, languages, publicValidations, keywordSets)
    }

    // Do draft validations
    else if (validateFor === PUBLICATION_STATUS.DRAFT) {
        return runValidationWithSettings(values, languages, draftValidations, keywordSets)
    }

    else {
        return {}
    }
}

function runValidationWithSettings(values, languages, settings, keywordSets) {
    let obj = {}

    // Add content languages to values to have them available in the validations
    const valuesWithLanguages = Object.assign({}, values, {
        _contentLanguages: languages,
    })

    each(settings, (validations, key) => {
        // Returns an array of validation errors (array of nulls if validation passed)
        let errors = []

        // validate sub events
        if (key === 'sub_events') {
            errors = {}
            each(values['sub_events'], (subEvent, eventKey) => {
                const subEventError = runValidationWithSettings(subEvent, languages, settings.sub_events)
                const error = isEmpty(subEventError) ? null : subEventError
                errors[eventKey] = error
            })
        // validate offers
        } else if (key === 'price') {
            errors = validateOffers(valuesWithLanguages)
        // validate keywords
        } else if (key === 'keywords') {
            errors = validations.map(validation => validationFn[validation](valuesWithLanguages, valuesWithLanguages[key], keywordSets) ? null : validation)
        // validate videos
        } else if (key === 'videos') {
            errors = values && values.videos && values.videos.length
                ? validateVideos(values.videos, validations)
                : {}
        } else {
            errors = validations.map(validation => validationFn[validation](valuesWithLanguages, valuesWithLanguages[key]) ? null : validation)
        }

        // Remove nulls
        if (key === 'sub_events') {
            errors = omitBy(errors, i => i === null)
        } else {
            remove(errors, i => i === null)
        }

        // handle offers separately
        if (key === 'price') {
            obj = {...obj, ...errors}
        } else {
            obj[key] = errors
        }
    })
    obj = pickBy(obj, (validationErrors, key) => {
        if (key === 'sub_events' || key === 'videos') {
            return !isEmpty(validationErrors)
        }
        return validationErrors.length > 0
    })
    return obj
}

const validateOffers = values => {
    const offers = values['offers']

    if (!offers) {
        return null
    }
    // validation rules used for the offer fields
    const offerValidationRules = {
        price: VALIDATION_RULES.HAS_PRICE,
        description: VALIDATION_RULES.LONG_STRING,
        info_url: VALIDATION_RULES.IS_URL,
    }
    // prepends key names with prefix where applicable
    const prependKeyName = key => {
        const offerPrefix = 'offer_'

        return key === 'info_url' || key === 'description'
            ? `${offerPrefix}${key}`
            : key
    }

    let errors = {}

    // loop through all offers and get validation errors for each one
    offers.forEach((offer, index) => {
        const offerValidationErrors = Object.keys(offer)
            .reduce((acc, key) => {
                const validationRule = offerValidationRules[key]

                if (validationRule) {
                    // the data we need to pass to the validation function differs for description fields
                    const valid = key === 'description'
                        ? validationFn[validationRule](offer, offer[key], key)
                        : validationFn[validationRule](values, offer, key)

                    if (!valid) {
                        acc[prependKeyName(key)] = [{key: `${index}`, validation: validationRule}]
                    }
                }
                return acc
            }, {})

        // add validation errors to the errors object
        each(offerValidationErrors, (value, key) => {
            Object.getOwnPropertyNames(errors).includes(key)
                ? errors[key][0].push(...value)
                : errors[key] = [value]
        })
    })
    return errors
}

const validateVideos = (values, validations) => {
    const errors = {}

    if (!values) {
        return errors
    }

    // loop through all video items to get the validation errors
    for (const [index, videoItem] of values.entries()) {
        // validate each field of the item
        const validationResult = Object.entries(videoItem)
            .reduce((acc, [key, itemValue]) => {
                acc[key] = validations[key]
                    // get the result for each validation rule
                    .map(validation =>
                        validation === VALIDATION_RULES.REQUIRED_VIDEO_FIELD
                            ? validationFn[validation](videoItem, itemValue, key) ? null : validation
                            : validationFn[validation](values, itemValue) ? null : validation
                    )
                    // filter out null values
                    .filter(Boolean)

                return acc
            }, {})

        // remove empty arrays
        Object.entries(validationResult)
            .forEach(([key, item]) => {
                if (isEmpty(item)) delete validationResult[key]
            })

        // continue if there are no errors
        if (Object.entries(validationResult).length === 0) continue

        // set the errors for the item
        errors[index] = validationResult
    }

    return errors
}
