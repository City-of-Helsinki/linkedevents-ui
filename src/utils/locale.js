import _ from 'lodash'

/**
 * A safe getter for multi language field
 * @param  {object} obj    multi language field
 * @param  {string} locale 'fi', 'se' or 'en'
 * @return {string}        language string
 */
export function getStringWithLocale(obj, locale) {
    if(typeof obj === 'object' && obj) {
        return obj[locale] || obj.fi || obj.se || obj.en
    }
    return ''
}
