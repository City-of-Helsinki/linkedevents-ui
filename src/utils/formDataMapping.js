import _ from 'lodash'
import constants from 'src/constants.js'
import moment from 'moment'
import 'moment-timezone'

export {
    mapUIDataToAPIFormat,
    mapAPIDataToUIFormat
}

// TODO: Refactoring form components to output and accept the correct format (like <MultiLanguageField>)

function mapUIDataToAPIFormat(values) {

    let obj = {}

    // General data
    obj.name = _pickLangFieldValuesIntoObject(values, 'name')
    obj.short_description = _pickLangFieldValuesIntoObject(values, 'short_description')
    obj.description = _pickLangFieldValuesIntoObject(values, 'description')
    obj.info_url = _pickLangFieldValuesIntoObject(values, 'info_url')
    obj.provider = _pickLangFieldValuesIntoObject(values, 'provider')
    obj.event_status = constants.EVENT_STATUS.SCHEDULED
    obj.publication_status = constants.PUBLICATION_STATUS.DRAFT

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

    // Time formatting
    if(values.starting_date) {
        let start_datetime = moment(values.starting_date).second(0).tz('Europe/Helsinki').format()

        if (values.starting_time) {
            let starting_time = moment(values.starting_time).second(0).tz('Europe/Helsinki').format()
            start_datetime = start_datetime.split('T')[0] + 'T' + starting_time.split('T')[1]
        }

        obj.start_time = start_datetime
    }

    if(values.ending_date) {
        let end_datetime = moment(values.starting_date).second(0).tz('Europe/Helsinki').format()

        if (values.ending_time) {
            let starting_time = moment(values.starting_time).second(0).tz('Europe/Helsinki').format()
            end_datetime = end_datetime.split('T')[0] + 'T' + starting_time.split('T')[1]
        }

        obj.end_time = end_datetime
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
        offers.offers_is_free = values.offers.is_free
        Object.assign(offers, _createLangFieldsFromObject(values.offers, 'price', 'offers_price'))
        Object.assign(offers, _createLangFieldsFromObject(values.offers, 'description', 'offers_description'))
        Object.assign(offers, _createLangFieldsFromObject(values.offers, 'info_url', 'offers_info_url'))

        // Assign offer values to return object
        Object.assign(obj, offers)
    }

    // Keywords, audience, languages
    obj.keywords = _.map(values.keywords, (item) => ({ value: item['id'], label: (item['name'].fi || item['name'].se || item['name'].en || item['id']) }))

    // TODO: Filter hel_main categories from keywords, non-hel_main categories from hel_main
    obj.hel_main = _.map(obj.keywords, item => item.value)

    if(values.audience) {
        obj.hel_target = _.map(values.audience, item => item['id'])
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
