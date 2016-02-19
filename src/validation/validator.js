import constants from '../constants'
import validationFn from './validationRules'

// Validations for event draft
const draftValidations = {
    name: ['requiredMulti']
}

// Validations for published event
const publicValidations = {
    name: ['requiredMulti'],
    location: ['requiredAtId'],
    hel_main: ['atLeastOne'],
    start_time: ['requiredString'] // Datetime is saved as ISO string 
    //end_time: [after('start_time')]
}

/**
 * Run draft/public validations depending which document
 * @return {object} Validation errors object
 */
export function doValidations(values) {
    // Public validations
    if(values.publication_status === constants.PUBLICATION_STATUS.PUBLIC) {
      return runValidationWithSettings(values, publicValidations)
    }

    // Do draft validations
    else if (values.publication_status === constants.PUBLICATION_STATUS.DRAFT) {
        return runValidationWithSettings(values, draftValidations)
    }

    else {
        return {
            publication_status: 'required'
        }
    }
}

function runValidationWithSettings(values, settings) {
    let obj = {}

    _.each(settings, (validations, key) => {
        // Returns an array of validation errors (array of nulls if validation passed)
        let errors = validations.map(validation =>
            (validationFn[validation](null, values[key]) ? null : validation)
        )
        // Remove nulls
        _.remove(errors, i => i === null)

        obj[key] = errors
    })

    obj = _.pick(obj, validationErrors => validationErrors.length > 0)

    return obj
}
