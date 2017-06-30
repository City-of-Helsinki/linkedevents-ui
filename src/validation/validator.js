import constants from '../constants'
import validationFn from './validationRules'

// Validations for draft
const draftValidations = {
    name: ['requiredMulti'],
    start_time: ['inTheFuture'],
    end_time: ['afterStartTime', 'inTheFuture'],
    offer_description: ['hasPrice'],
    price: ['hasPrice'],
    short_description: ['shortString'],
    description: ['longString'],
    info_url: ['isUrl'],
    extlink_facebook: ['isUrl'],
    extlink_twitter: ['isUrl'],
    extlink_instagram: ['isUrl']
}

// Validations for published event
const publicValidations = {
    name: ['requiredMulti', 'requiredInContentLanguages'],
    location: ['requiredAtId'],
    hel_main: ['atLeastOne'],
    start_time: ['requiredString', 'inTheFuture'], // Datetime is saved as ISO string
    end_time: ['afterStartTime', 'inTheFuture'],
    offer_description: ['hasPrice'],
    price: ['hasPrice'],
    short_description: ['requiredMulti', 'requiredInContentLanguages', 'shortString'],
    description: ['requiredMulti', 'requiredInContentLanguages', 'longString'],
    info_url: ['isUrl'],
    extlink_facebook: ['isUrl'],
    extlink_twitter: ['isUrl'],
    extlink_instagram: ['isUrl'],
}

/**
 * Run draft/public validations depending which document
 * @return {object} Validation errors object
 */
export function doValidations(values, languages, validateFor) {
    // Public validations
    if(validateFor === constants.PUBLICATION_STATUS.PUBLIC) {
        return runValidationWithSettings(values, languages, publicValidations)
    }

    // Do draft validations
    else if (validateFor === constants.PUBLICATION_STATUS.DRAFT) {
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
        _contentLanguages: languages
    })

    _.each(settings, (validations, key) => {
        // Returns an array of validation errors (array of nulls if validation passed)
        let errors = validations.map(validation => {
            if (key === 'offer_description' || key === 'price') {
                return validateCollection(valuesWithLanguages, key, validation, 'offers')
            }
            return validationFn[validation](valuesWithLanguages, values[key]) ? null : validation
        })

        // Remove nulls
        _.remove(errors, i => i === null)

        obj[key] = errors
    })

    obj = _.pick(obj, validationErrors => validationErrors.length > 0)

    return obj
}

function validateCollection(values, key, validationRule, type) {
    const targetKey = key === 'offer_description' ? 'description' : key
    const valueByType = values[type]
    let validations = []
    for (const index in valueByType) {
        if (!validationFn[validationRule](values, valueByType[index], targetKey)) {
          validations.push({ key: index, validation: validationRule })
        }
    }
    return validations.length ? validations : null
}
