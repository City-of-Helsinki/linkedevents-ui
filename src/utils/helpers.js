import CONSTANTS from '../constants'

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

export function textLimitValidator(value, limit) {
    if(typeof value === 'object') {
        let hasOneOverLimit = false
        _.each(value, item => {
            if(item.length > limit) {
                hasOneOverLimit = true
            }
        })
        return !hasOneOverLimit

    } else if(typeof value === 'string') {
        if(value.length > limit) {
            return false
        }
    }
    return true
}
