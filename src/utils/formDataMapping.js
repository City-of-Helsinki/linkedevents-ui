import _ from 'lodash'
import constants from 'src/constants.js'
import moment from 'moment'
import 'moment-timezone'

import {mapLanguagesSetToForm} from 'src/utils/apiDataMapping.js'

export {
    mapUIDataToAPIFormat,
    mapAPIDataToUIFormat
}

// TODO: Refactoring form components to output and accept the correct format (like <MultiLanguageField> to output {fi: name, se: namn})

function mapUIDataToAPIFormat(values) {

    let obj = {}

    if(values.id) {
        obj.id = values.id
    }

    // General data
    obj.name = _pickLangFieldValuesIntoObject(values, 'name')
    obj.short_description = _pickLangFieldValuesIntoObject(values, 'short_description')
    obj.description = _pickLangFieldValuesIntoObject(values, 'description')
    obj.info_url = _pickLangFieldValuesIntoObject(values, 'info_url')
    obj.provider = _pickLangFieldValuesIntoObject(values, 'provider')
    obj.event_status = constants.EVENT_STATUS.SCHEDULED
    obj.publication_status = values.publication_status || values.PUBLICATION_STATUS.DRAFT

    // Location data
    if(values.location_id) {
        obj.location = { '@id': `/v0.1/place/${values.location_id}/`}
    }

    obj.location_extra_info = _pickLangFieldValuesIntoObject(values, 'location_extra_info')

    // Price data
    obj.offers = [{
        is_free: values.offers_is_free,
        price: _pickLangFieldValuesIntoObject(values, 'offers_price'),
        description: _pickLangFieldValuesIntoObject(values, 'offers_description'),
        info_url: _pickLangFieldValuesIntoObject(values, 'offers_info_url')
    }]

    // Keywords, audience, languages
    if(values.keywords && values.keywords.length > 0) {
        obj.keywords = _.map(values.keywords, (item) => ({ '@id': item.value }))
    }

    if(values.hel_main && values.hel_main.length > 0) {
        obj.keywords = obj.keywords || []
        obj.keywords = obj.keywords.concat(_.map(values.hel_main, (item) => ({ '@id': item })))
    }

    if(values.hel_target && values.hel_target.length > 0) {
        obj.audience = _.map(values.hel_target, (item) => ({ '@id': item }))
    }

    // External links
    obj.external_links = []

    let externalLinkFields = ['extlink_facebook', 'extlink_twitter', 'extlink_instagram']
    externalLinkFields.forEach((field) => {
        if(values[field]) {
            obj.external_links.push({
                name: field,
                link: values[field],
                language: 'fi' // TODO: Which languages here?
            })
        }
    })

    if(values.start_time) {
        obj.start_time = values.start_time
    }

    if(values.end_time) {
        obj.end_time = values.end_time
    }

    if(values.in_language) {
        obj.in_language = values.in_language.map(lang => ({'@id': lang}))
    }

    return obj

    /*
    'date_published': DATETIME, // Not required at the moment...
    */
}

export function mapAPIDataToUIFormat(values) {
    let obj = {}

    obj.id = values.id

    // General data
    Object.assign(obj, _createLangFieldsFromObject(values, 'name'))
    Object.assign(obj, _createLangFieldsFromObject(values, 'short_description'))
    Object.assign(obj, _createLangFieldsFromObject(values, 'description'))
    Object.assign(obj, _createLangFieldsFromObject(values, 'info_url'))
    Object.assign(obj, _createLangFieldsFromObject(values, 'provider'))

    //
    obj.event_status = values.event_status
    obj.publication_status = values.publication_status

    // Location data
    if(values.location) {
        obj.location_id = values.location['id']
    }

    Object.assign(obj, _createLangFieldsFromObject(values, 'location_extra_info'))

    // Price information
    if(values.offers) {
        let offers = {}
        obj.offers_is_free = values.offers[0].is_free
        Object.assign(offers, _createLangFieldsFromObject(values.offers[0], 'price', 'offers_price'))
        Object.assign(offers, _createLangFieldsFromObject(values.offers[0], 'description', 'offers_description'))
        Object.assign(offers, _createLangFieldsFromObject(values.offers[0], 'info_url', 'offers_info_url'))

        // Assign offer values to return object
        Object.assign(obj, offers)
    }

    // External links
    if(values.external_links) {
        let externalLinkFields = ['extlink_facebook', 'extlink_twitter', 'extlink_instagram']
        externalLinkFields.forEach(item => {
            let extlink = _.findWhere(obj.external_links, {name: item})
            if(extlink) {
                obj[item] = extlink.link
            }
        })
    }

    if(values.start_time) {
        obj.start_time = values.start_time
    }

    if(values.end_time) {
        obj.end_time = values.end_time
    }

    // TODO: Filter hel_main categories from keywords, non-hel_main categories from hel_main
    obj.hel_main = _.map(values.keywords, (item) => (`/v0.1/keyword/${item.id}/`))

    // Keywords, audience, languages
    obj.keywords = _.map(values.keywords, (item) => ({ value: `/v0.1/keyword/${item.id}/`, label: (item['name'].fi || item['name'].se || item['name'].en || item['id']) }))

    // Filter somehow the hel_main keyword values from keywords
    // obj.keywords = _.filter(obj.keywords, (item) => {
    //     console.log(obj.hel_main.indexOf(item.value) === -1)
    //     return (obj.hel_main.indexOf(item.value) === -1)
    // });

    if(values.audience) {
        obj.hel_target = _.map(values.audience, item => `/v0.1/keyword/${item.id}/`)
    }

    if(values.in_language) {
        obj.in_language = _.map(values.in_language, lang => `/v0.1/language/${lang.id}/`)
    }

    return obj
}

// Picks fields starting with fieldprefix and clumps them into an obj
function _pickLangFieldValuesIntoObject(values, fieldprefix) {
    let fields = _.pick(values, function(item, key) {
        return (key.indexOf(fieldprefix) === 0)
    })

    if(_.keys(fields).length === 0) {
        return {}
    }

    return _.mapKeys(fields, function(value, key) {
        return key.replace(fieldprefix + '_', '')
    })
}

// Picks fields starting with fieldprefix and clumps them into an obj
function _createLangFieldsFromObject(values, field, toField) {
    if(!field) { return {} }
    toField = toField || field

    let obj = {}
    if(typeof values[field] === 'object') {
        _.forEach(values[field], (value,lang) => {
            obj[`${toField}_${lang}`] = value
        })
    }
    return obj
}
