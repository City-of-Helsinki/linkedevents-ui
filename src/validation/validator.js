import CONSTANTS from '../constants'
import validationFn from './validationRules'
import {getCharacterLimitByRule} from '../utils/helpers'
import {each, remove, pickBy} from 'lodash'

const {
    VALIDATION_RULES,
    PUBLICATION_STATUS,
} = CONSTANTS


// Validations for draft
const draftValidations = {
    name: [VALIDATION_RULES.REQUIRE_MULTI],
    end_time: [VALIDATION_RULES.AFTER_START_TIME, VALIDATION_RULES.IN_THE_FUTURE],
    price: [VALIDATION_RULES.HAS_PRICE],
    short_description: [VALIDATION_RULES.SHORT_STRING],
    medium_description: [VALIDATION_RULES.MEDIUM_STRING],
    description: [VALIDATION_RULES.LONG_STRING],
    info_url: [VALIDATION_RULES.IS_URL],
    extlink_facebook: [VALIDATION_RULES.IS_URL],
    extlink_twitter: [VALIDATION_RULES.IS_URL],
    extlink_instagram: [VALIDATION_RULES.IS_URL],
    audience_min_age: [VALIDATION_RULES.REQUIRED, VALIDATION_RULES.IS_INT],
    audience_max_age: [VALIDATION_RULES.REQUIRED, VALIDATION_RULES.IS_INT],
    enrolment_start_time: [VALIDATION_RULES.REQUIRED_STRING],
    enrolment_end_time: [VALIDATION_RULES.AFTER_START_TIME, VALIDATION_RULES.IN_THE_FUTURE],
    minimum_attendee_capacity: [VALIDATION_RULES.REQUIRED, VALIDATION_RULES.IS_INT],
    maximum_attendee_capacity: [VALIDATION_RULES.REQUIRED, VALIDATION_RULES.IS_INT],
}

// Validations for published event
const publicValidations = {
    name: [VALIDATION_RULES.REQUIRE_MULTI, VALIDATION_RULES.REQUIRED_IN_CONTENT_LANGUAGE],
    location: [VALIDATION_RULES.REQUIRE_AT_ID],
    hel_main: [VALIDATION_RULES.AT_LEAST_ONE],
    start_time: [VALIDATION_RULES.REQUIRED_STRING], // Datetime is saved as ISO string
    end_time: [VALIDATION_RULES.AFTER_START_TIME, VALIDATION_RULES.IN_THE_FUTURE],
    price: [VALIDATION_RULES.HAS_PRICE],
    short_description: [VALIDATION_RULES.REQUIRE_MULTI, VALIDATION_RULES.REQUIRED_IN_CONTENT_LANGUAGE, VALIDATION_RULES.SHORT_STRING],
    description: [VALIDATION_RULES.REQUIRE_MULTI, VALIDATION_RULES.REQUIRED_IN_CONTENT_LANGUAGE, VALIDATION_RULES.LONG_STRING],
    info_url: [VALIDATION_RULES.IS_URL],
    extlink_facebook: [VALIDATION_RULES.IS_URL],
    extlink_twitter: [VALIDATION_RULES.IS_URL],
    extlink_instagram: [VALIDATION_RULES.IS_URL],
    audience_min_age: [VALIDATION_RULES.REQUIRED, VALIDATION_RULES.IS_INT],
    audience_max_age: [VALIDATION_RULES.REQUIRED, VALIDATION_RULES.IS_INT],
    enrolment_start_time: [VALIDATION_RULES.REQUIRED_STRING],
    enrolment_end_time: [VALIDATION_RULES.AFTER_START_TIME, VALIDATION_RULES.IN_THE_FUTURE],
    minimum_attendee_capacity: [VALIDATION_RULES.REQUIRED, VALIDATION_RULES.IS_INT],
    maximum_attendee_capacity: [VALIDATION_RULES.REQUIRED, VALIDATION_RULES.IS_INT],
}

/**
 * Run draft/public validations depending which document
 * @return {object} Validation errors object
 */
export function doValidations(values, languages, validateFor) {
    // Public validations
    if(validateFor === PUBLICATION_STATUS.PUBLIC) {
        return runValidationWithSettings(values, languages, publicValidations)
    }

    // Do draft validations
    else if (validateFor === PUBLICATION_STATUS.DRAFT) {
        return runValidationWithSettings(values, languages, draftValidations)
    }

    else {
        return {}
    }
}

function runValidationWithSettings(values, languages, settings) {
    let obj = {}

    // Add content languages to values to have them available in the validations
    const valuesWithLanguages = Object.assign({}, values, {
        _contentLanguages: languages,
    })

    each(settings, (validations, key) => {
        // Returns an array of validation errors (array of nulls if validation passed)
        let errors = validations.map(validation => {
            if (key === 'offer_description' || key === 'price' || key === 'info_url') {
                return validateCollection(valuesWithLanguages, key, validation, 'offers')
            }
            return validationFn[validation](valuesWithLanguages, values[key]) ? null : validation
        })

        // Remove nulls
        remove(errors, i => i === null)

        obj[key] = errors
    })
    obj = pickBy(obj, validationErrors => validationErrors.length > 0)
    return obj
}

function validateCollection(values, key, validationRule, type) {
    const targetKey = key === 'offer_description' ? 'description' : key
    const valueByType = values[type]
    let validations = []
    for (const index in valueByType) {
        if (!validationFn[validationRule](values, valueByType[index], targetKey)) {
            validations.push({key: index, validation: validationRule})
        }
    }
    return validations.length ? validations : null
}
