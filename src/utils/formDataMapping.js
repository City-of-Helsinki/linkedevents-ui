import {find, clone, map, lastIndexOf, forOwn, every, includes, isEmpty, cloneDeep, remove, values, set} from 'lodash'
import constants from 'src/constants.js'
import moment from 'moment'
import 'moment-timezone'
import {getStringWithLocale} from './locale'

export {
    mapUIDataToAPIFormat,
    mapAPIDataToUIFormat,
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
    let audiences = clone(original_audiences)

    const audienceIds = map(audiences, function(audience) {
    // parse keyword ID from keyword URL
        return audience.slice(lastIndexOf(audience, '/', audience.length - 2) + 1, -1)
    })

    // iterate hel.fi keywords
    forOwn(helFiYsoAudienceMapping, function(ysoIDs, helFiID) {

    // check that every YSO keyword for the current hel.fi keyword is selected
        const containsEveryYso = every(ysoIDs, function(ysoID) {
            return includes(audienceIds, ysoID)
        })
        if (containsEveryYso) {
            audiences.push(`${appSettings.api_base}/keyword/` + helFiID + '/')
        }
    })
    return audiences
}

function _nullifyEmptyStrings(multiLangObject) {
    forOwn(multiLangObject, function(value, language) {

    // do not send empty strings to the backend, as this will set the null language field to non-null
        if (value === '') {
            multiLangObject[language] = null
        }
    })
    return multiLangObject
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
    obj.name = _nullifyEmptyStrings(values.name)
    obj.short_description = _nullifyEmptyStrings(values.short_description)
    obj.description = _nullifyEmptyStrings(values.description)
    obj.info_url = _nullifyEmptyStrings(values.info_url)
    obj.provider = _nullifyEmptyStrings(values.provider)
    obj.event_status = values.event_status || constants.EVENT_STATUS.SCHEDULED
    obj.publication_status = values.publication_status || constants.PUBLICATION_STATUS.DRAFT
    obj.super_event_type = values.super_event_type
    obj.super_event = values.super_event
    obj.publisher = values.organization

    // Location data
    obj.location = values.location
    obj.location_extra_info = _nullifyEmptyStrings(values.location_extra_info)

    // Image data
    obj.images = []
    if(values.image && !isEmpty(values.image)) {
        obj.images[0] = values.image
    }

    // Price data
    if (values.offers === undefined) {
        obj.offers = []
    }
    if(values.offers && values.offers.length && !values.offers[0].is_free) {
        obj.offers = values.offers
    } else {
        obj.offers = [{is_free: true}]
    }

    // Keywords, audience, languages
    if(values.keywords && values.keywords.length !== undefined) {
        obj.keywords = map(values.keywords, (item) => ({'@id': item.value}))
    }

    if(values.hel_main && values.hel_main.length !== undefined) {
        obj.keywords = obj.keywords || []
        obj.keywords = obj.keywords.concat(map(values.hel_main, (item) => ({'@id': item})))
    }

    if(values.audience && values.audience.length !== undefined) {
        const audiences = _addHelFiAudienceKeywords(values.audience)
        obj.audience = map(audiences, (item) => ({'@id': item}))
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
                language: 'fi', // TODO: Which languages here?
            })
        }
    })

    if(values.start_time) {
        obj.start_time = values.start_time
    }

    if(values.end_time) {
        obj.end_time = values.end_time
    }

    if (values.audience_min_age) {
        obj.audience_min_age = parseInt(values.audience_min_age, 10)
    }
    if (values.audience_max_age) {
        obj.audience_max_age = parseInt(values.audience_max_age, 10)
    }

    // course extension fields
    const courseFields = {}
    if (values.enrolment_start_time) {
        courseFields.enrolment_start_time = values.enrolment_start_time
    }
    if (values.enrolment_end_time) {
        courseFields.enrolment_end_time = values.enrolment_end_time
    }
    if (values.minimum_attendee_capacity) {
        courseFields.minimum_attendee_capacity = parseInt(values.minimum_attendee_capacity, 10)
    }
    if (values.maximum_attendee_capacity) {
        courseFields.maximum_attendee_capacity = parseInt(values.maximum_attendee_capacity, 10)
    }
    obj.extension_course = courseFields

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
    obj.super_event_type = values.super_event_type

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

    // Subevents: from array to object
    obj.sub_events = {...values.sub_events}

    // TODO: Filter hel_main categories from keywords, non-hel_main categories from hel_main
    //
    let keywords = cloneDeep(values.keywords)

    let hel_main_items = remove(keywords, item => {
        return (item.id.indexOf('helfi:') > -1)
    })

    obj.hel_main = map(hel_main_items, (item) => { return item['@id'] })

    // Keywords, audience, languages
    obj.keywords = map(keywords, (item) => ({value: item['@id'], label: (getStringWithLocale(item, 'name') || item['id'])}))

    // Filter somehow the hel_main keyword values from keywords
    // obj.keywords = filter(obj.keywords, (item) => {
    //     console.log(obj.hel_main.indexOf(item.value) === -1)
    //     return (obj.hel_main.indexOf(item.value) === -1)
    // });

    if(values.audience) {
        obj.audience = map(values.audience, item => item['@id'])
    }

    if(values.in_language) {
        obj.in_language = map(values.in_language, lang => lang['@id'])
    }

    // External links
    if(values.external_links) {
        let externalLinkFields = ['extlink_facebook', 'extlink_twitter', 'extlink_instagram']
        externalLinkFields.forEach(item => {
            let extlink = find(values.external_links, {name: item})
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

    if (values.audience_min_age) {
        obj.audience_min_age = values.audience_min_age
    }
    if (values.audience_max_age) {
        obj.audience_max_age = values.audience_max_age
    }

    // course extension fields
    if (appSettings.ui_mode === 'courses' && values.hasOwnProperty('extension_course')) {
        const courseFields = [
            'enrolment_start_time', 'enrolment_end_time', 'minimum_attendee_capacity', 'maximum_attendee_capacity',
        ];
        courseFields.forEach(field => {
            const value = values['extension_course'][field]
            if (value) {
                obj[field] = value
            }
        })
    }

    return obj
}

/*
    take an array of sub events, return start and end time for the
    corresponding super event with:
    - earliest date of sub events as start_time
    - latest date of sub events as end_time
*/
export const calculateSuperEventTime = (subEvents) => {
    let startTimes = []
    let endTimes = []
    values(subEvents).filter(event => {
        if (event.start_time) {
            startTimes.push(moment(event.start_time))
        }
        if (event.end_time) {
            endTimes.push(moment(event.end_time))
        }
    })
    // in case there is no end_time in sub events should return the
    // midnight of the day after the latest start time as super event endtime
    const superEventStartTime = startTimes.length <= 0 ? undefined : moment.min(startTimes);
    let superEventEndTime = endTimes.length <= 0
        ? startTimes.length <= 0
            ? undefined    
            : moment.max(startTimes).endOf('day')
        : moment.max(endTimes)
    return {
        start_time: superEventStartTime
            ? moment.tz(superEventStartTime, 'Europe/Helsinki').utc().toISOString()
            : undefined,
        end_time: superEventEndTime
            ? moment.tz(superEventEndTime, 'Europe/Helsinki').utc().toISOString()
            : undefined,
    }
}

// combine all dates in the editor form to get a collection of sub events under super
export const combineSubEventsFromEditor = (formValues, updateExisting = false) => {
    let subEvents
    if (updateExisting) {
        subEvents = formValues.sub_events
    } else {
        subEvents = {
            '0': {start_time: formValues.start_time, end_time: formValues.end_time},
            ...formValues.sub_events,
        }
    }

    return Object.assign({}, formValues, {
        sub_events: subEvents,
        id: undefined,
    })
}

export const createSubEventsFromFormValues = (formValues, updateExisting, superEventUrl) => {
    const formWithAllSubEvents = combineSubEventsFromEditor(formValues, updateExisting)
    const baseEvent = {...formWithAllSubEvents, sub_events: {}, super_event: {'@id': superEventUrl}}
    const subEvents = {...formWithAllSubEvents.sub_events}
    return Object.keys(subEvents)
        .map(key => ({...baseEvent, start_time: subEvents[key].start_time, end_time: subEvents[key].end_time}))
}

export const updateSubEventsFromFormValues = (formValues, subEventsToUpdate) => {
    const keysToUpdate = ['start_time', 'end_time', 'id', 'super_event', 'super_event_type']
    // update form data with sub event data where applicable
    return subEventsToUpdate.map(subEvent =>
        keysToUpdate.reduce((acc, key) => set(acc, key, subEvent[key]), {...formValues}))
}
