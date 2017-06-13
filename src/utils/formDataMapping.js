import _ from 'lodash'
import constants from 'src/constants.js'
import moment from 'moment'
import 'moment-timezone'

import { getStringWithLocale } from './locale'
import {mapLanguagesSetToForm} from 'src/utils/apiDataMapping.js'

export {
    mapUIDataToAPIFormat,
    mapAPIDataToUIFormat
}

// hel.fi audience keywords that correspond to YSO audience keywords need to be posted also for now

const helFiYsoAudienceMapping = {
    'helfi:1': ['yso:p4354', 'yso:p13050'],
    'helfi:2': ['yso:p11617'],
    'helfi:3': ['yso:p6165'],
    'helfi:4': ['yso:p7179'],
    'helfi:5': ['yso:p2434'],
    'helfi:6': ['yso:p3128'],
    'helfi:7': ['yso:p1393'],
}

function _addHelFiAudienceKeywords(original_audiences) {
    let audiences = _.clone(original_audiences)

    const audienceIds = _.map(audiences, function(audience) {
        // parse keyword ID from keyword URL
        return audience.slice(_.lastIndexOf(audience, '/', audience.length - 2) + 1, -1)
    })

    // iterate hel.fi keywords
    _.forOwn(helFiYsoAudienceMapping, function(ysoIDs, helFiID) {

        // check that every YSO keyword for the current hel.fi keyword is selected
        const containsEveryYso = _.every(ysoIDs, function(ysoID) {
            return _.contains(audienceIds, ysoID)
        })
        if (containsEveryYso) {
            audiences.push(`${appSettings.api_base}/keyword/` + helFiID + '/')
        }
    })
    return audiences
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
    obj.event_status = values.event_status || constants.EVENT_STATUS.SCHEDULED
    obj.publication_status = values.publication_status || constants.PUBLICATION_STATUS.DRAFT
    obj.super_event_type = values.super_event_type
    obj.super_event = values.super_event
    // Location data
    obj.location = values.location
    obj.location_extra_info = values.location_extra_info

    // Image data
    if(values.image) {
        // obj.image = { '@id': `/v0.1/image/${values.image_id}/`}
        obj.image = values.image
    }

    // Price data
    if (values.offers === undefined) {
        obj.offers = []
    }
    if(values.offers.length && !values.offers[0].is_free) {
        obj.offers = values.offers
    } else {
        obj.offers = [{ is_free: true }]
    }

    // Keywords, audience, languages
    if(values.keywords && values.keywords.length !== undefined) {
        obj.keywords = _.map(values.keywords, (item) => ({ '@id': item.value }))
    }

    if(values.hel_main && values.hel_main.length !== undefined) {
        obj.keywords = obj.keywords || []
        obj.keywords = obj.keywords.concat(_.map(values.hel_main, (item) => ({ '@id': item })))
    }

    if(values.audience && values.audience.length !== undefined) {
        const audiences = _addHelFiAudienceKeywords(values.audience)
        obj.audience = _.map(audiences, (item) => ({ '@id': item }))
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

function mapAPIDataToUIFormat(values) {
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
    obj.organization = values.publisher

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

    obj.hel_main = _.map(hel_main_items, (item) => { return item['@id'] })

    // Keywords, audience, languages
    obj.keywords = _.map(keywords, (item) => ({ value: item['@id'], label: (getStringWithLocale(item, 'name') || item['id']) }))

    // Filter somehow the hel_main keyword values from keywords
    // obj.keywords = _.filter(obj.keywords, (item) => {
    //     console.log(obj.hel_main.indexOf(item.value) === -1)
    //     return (obj.hel_main.indexOf(item.value) === -1)
    // });

    if(values.audience) {
        obj.audience = _.map(values.audience, item => item['@id'])
    }

    if(values.in_language) {
        obj.in_language = _.map(values.in_language, lang => lang['@id'])
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

    if(values.images) {
        obj.image = values.images[0]
    }

    return obj
}
