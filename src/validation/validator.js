import constants from '../constants'
import validationFn from './validationRules'

// Validations for draft
const draftValidations = {
    name: ['requiredMulti'],
    end_time: ['afterStartTime'],
    short_description: ['shortString']
}

// Validations for published event
const publicValidations = {
    name: ['requiredMulti'],
    location: ['requiredAtId'],
    hel_main: ['atLeastOne'],
    start_time: ['requiredString'], // Datetime is saved as ISO string
    end_time: ['afterStartTime'],
    short_description: ['shortString']
}

/**
 * Run draft/public validations depending which document
 * @return {object} Validation errors object
 */
export function doValidations(values, validateFor) {
    // Public validations
    if(validateFor === constants.PUBLICATION_STATUS.PUBLIC) {
        return runValidationWithSettings(values, publicValidations)
    }

    // Do draft validations
    else if (validateFor === constants.PUBLICATION_STATUS.DRAFT) {
        return runValidationWithSettings(values, draftValidations)
    }

    else {
        return {}
    }
}

function runValidationWithSettings(values, settings) {
    let obj = {}

    _.each(settings, (validations, key) => {
        // Returns an array of validation errors (array of nulls if validation passed)
        let errors = validations.map(validation =>
            (validationFn[validation](values, values[key]) ? null : validation)
        )
        // Remove nulls
        _.remove(errors, i => i === null)

        obj[key] = errors
    })

    obj = _.pick(obj, validationErrors => validationErrors.length > 0)

    return obj
}
