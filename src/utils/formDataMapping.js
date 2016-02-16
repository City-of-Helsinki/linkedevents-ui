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

    if(!values) {
        return {}
    }

    let obj = {}

    if(values.id) {
        obj.id = values.id
    }

    // General data
    obj.name = values.name
    obj.short_description = values.short_description
    obj.description = values.description
    obj.info_url = values.info_url
    obj.provider = values.provider
    obj.event_status = constants.EVENT_STATUS.SCHEDULED
    obj.publication_status = values.publication_status || values.PUBLICATION_STATUS.DRAFT

    // Location data
    obj.location = values.location

    // Image data
    if(values.image_id) {
        obj.image = { '@id': `/v0.1/image/${values.image_id}/`}
    }

    // Price data
    if(values.offers) {
        obj.offers = values.offers
    }

    // Keywords, audience, languages
    if(values.keywords && values.keywords.length !== undefined) {
        obj.keywords = _.map(values.keywords, (item) => ({ '@id': item.value }))
    }

    if(values.hel_main && values.hel_main.length !== undefined) {
        obj.keywords = obj.keywords || []
        obj.keywords = obj.keywords.concat(_.map(values.hel_main, (item) => ({ '@id': item })))
    }

    if(values.hel_target && values.hel_target.length !== undefined) {
        obj.audience = _.map(values.hel_target, (item) => ({ '@id': item }))
    }

    if(values.in_language) {
        obj.in_language = values.in_language.map(lang => ({'@id': lang}))
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

    return obj

    /*
    'date_published': DATETIME, // Not required at the moment...
    */
}

export function mapAPIDataToUIFormat(values) {
    if(!values) {
        return {}
    }

    let obj = {}

    // General data
    obj.id = values.id
    obj.name = values.name
    obj.short_description = values.short_description
    obj.description = values.description
    obj.info_url = values.info_url
    obj.provider = values.provider

    // Statuses
    obj.event_status = values.event_status
    obj.publication_status = values.publication_status

    // Location data
    obj.location = values.location

    obj.location_extra_info = values.location_extra_info

    if(values.offers) {
        obj.offers = values.offers
    }

    // TODO: Filter hel_main categories from keywords, non-hel_main categories from hel_main
    //
    let keywords = _.cloneDeep(values.keywords)

    let hel_main_items = _.remove(keywords, item => {
        return (item.id.indexOf('helfi:') > -1)
    })

    obj.hel_main = _.map(hel_main_items, (item) => (`/v0.1/keyword/${item.id}/`))

    // Keywords, audience, languages
    obj.keywords = _.map(keywords, (item) => ({ value: `/v0.1/keyword/${item.id}/`, label: (item['name'].fi || item['name'].se || item['name'].en || item['id']) }))

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

    // External links
    if(values.external_links) {
        let externalLinkFields = ['extlink_facebook', 'extlink_twitter', 'extlink_instagram']
        externalLinkFields.forEach(item => {
            let extlink = _.findWhere(values.external_links, {name: item})
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

    return obj
}
