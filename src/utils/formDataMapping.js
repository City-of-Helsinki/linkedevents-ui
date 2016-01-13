import _ from 'lodash'
import constants from 'src/constants.js'
import moment from 'moment'
import 'moment-timezone'

export {
    mapUIDataToAPIFormat,
    mapAPIDataToUIFormat
}

function mapUIDataToAPIFormat(values) {

    let obj = {}

    // General data
    obj.name = _pickLangFieldValuesIntoObject(values, 'headline')
    obj.short_description = _pickLangFieldValuesIntoObject(values, 'short_description')
    obj.description = _pickLangFieldValuesIntoObject(values, 'description')
    obj.info_url = _pickLangFieldValuesIntoObject(values, 'info_url')
    obj.provider = _pickLangFieldValuesIntoObject(values, 'provider')

    // Location data
    if(values.location_id) {
        obj.location = { '@id': `/v0.1/place/${values.location_id}/`}
    }

    obj.location_extra_info = _pickLangFieldValuesIntoObject(values, 'location_extra_info')
    obj.event_status = constants.EVENT_STATUS.SCHEDULED

    // Price data
    obj.offers = [{
        is_free: values.offers_is_free,
        price: _pickLangFieldValuesIntoObject(values, 'offers_price'),
        description: _pickLangFieldValuesIntoObject(values, 'offers_description'),
        info_url: _pickLangFieldValuesIntoObject(values, 'offers_info_url')
    }]

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
    'keywords': [
        {'@id': keyword_id(data_source, 'simple')},
        {'@id': keyword_id(data_source, 'test')},
        {'@id': keyword_id(data_source, 'keyword')},
    ],

    'date_published': DATETIME, // Not required at the moment...

    // === hel_main ===
    if (d.hel_main) {
        for (var j = 0, val; j < d.hel_main.length; j++) {
            // TODO: implement
            val = d.hel_main[j];
            undefined;
        }
        delete d.hel_main;
    }

    */
}

export function mapAPIDataToUIFormat() {

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
