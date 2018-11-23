import {get} from 'lodash'

/**
 * A safe getter for multi language field
 *
 * Example usage:
 * // let label = getStringWithLocale(this.props, 'editor.values.name', 'fi')
 *
 * @param  {object} obj    multi language field
 * @param  {string} fieldpath  string path for the field
 * @param  {string} locale 'fi', 'sv' or 'en'
 * @return {string}        language string
 */
export function getStringWithLocale(obj, fieldpath = '', locale = 'fi', defaultValue = '') {
    let field = get(obj, fieldpath, {})

    if(typeof field === 'object' && field) {
        return field[locale] || field.fi || field.sv || field.en || defaultValue
    }

    return defaultValue
}
