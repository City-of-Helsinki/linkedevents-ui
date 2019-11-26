import client from '../api/client'
import moment from 'moment'
import constants from '../constants'
import {get, set} from 'lodash'
import {getIsUserOfType, getUser} from './user'

const {PUBLICATION_STATUS, EVENT_STATUS} = constants

/**
 * Fetches an event based on given ID
 * @param eventId   ID of event to fetch
 * @param include   Include query parameter value
 * @returns {Promise<*>}
 */
export const fetchEvent = async (eventId, include) => {
    const queryParams = {
        include: include,
    }

    try {
        return await client.get(`event/${eventId}`, queryParams)
    } catch (e) {
        throw Error(e)
    }
}

/**
 * Fetches events based on given parameters
 * @param superEvent
 * @param publicationStatus
 * @param publisher
 * @param page
 * @param pageSize
 * @param sortDirection
 * @param sortBy
 * @param include
 * @returns {Promise<*>}
 */
export const fetchEvents = async (
    superEvent,
    publicationStatus,
    publisher,
    page,
    pageSize,
    sortBy,
    sortDirection,
    include,
) => {
    const queryParams = {
        super_event: superEvent,
        admin_user: getIsUserOfType(getUser(), 'admin'),
        publication_status: publicationStatus,
        publisher: publisher && publisher.join(),
        page: page,
        page_size: pageSize,
        sort: sortDirection === 'desc' ? `-${sortBy}` : sortBy,
        include: include,
    }

    // remove all empty values
    Object.keys(queryParams)
        .forEach(key => !queryParams[key] && delete queryParams[key])

    try {
        return await client.get('event', queryParams)
    } catch (e) {
        throw Error(e)
    }
}

/**
 * Publishes an event
 * @param eventData  Event that should be published
 * @returns {Promise}
 */
export const publishEvent = async (eventData) => {
    const updatedEventData = {
        ...eventData,
        date_published: moment().utc().format(),
        publication_status: PUBLICATION_STATUS.PUBLIC,
    }

    try {
        return await client.put(`event/${eventData.id}`, updatedEventData)
    } catch (e) {
        throw Error(e)
    }
}

/**
 * Publishes given events
 * @param eventData  Event data
 * @returns {Promise}
 */
export const publishEvents = async (eventData) => Promise.all(eventData.map(publishEvent))

/**
 * Deletes an event
 * @param eventId  ID of event that should be deleted
 * @returns {Promise}
 */
export const deleteEvent = async (eventId) => {
    try {
        return await client.delete(`event/${eventId}`)
    } catch (e) {
        throw Error(e)
    }
}

/**
 * Deletes given events
 * @param eventIds  List of ID's that should be deleted
 * @returns {Promise}
 */
export const deleteEvents = async (eventIds) => Promise.all(eventIds.map(deleteEvent))

/**
 * Cancels an event
 * @param eventData  Data for the event that should be canceled
 * @returns {Promise}
 */
export const cancelEvent = async (eventData) => {
    const updatedEventData = {
        ...eventData,
        event_status: EVENT_STATUS.CANCELLED,
    }

    try {
        return await client.put(`event/${eventData.id}`, updatedEventData)
    } catch (e) {
        throw Error(e)
    }
}

/**
 * Cancels given events
 * @param eventData  Data for the events that should be canceled
 * @returns {Promise}
 */
export const cancelEvents = async (eventData) => Promise.all(eventData.map(cancelEvent))

/**
 * Returns the data for the given ID's
 * @param ids   ID's that the data is filtered based on
 * @param data  Data to be filtered
 * @returns {object[]}
 */
export const getEventDataFromIds = (ids, data) => data.filter(item => ids.includes(item.id))


/**
 * Returns the event id from given URL
 * @param url   URL to get the event ID from
 * @returns {string|undefined}    Event ID
 */
export const getEventIdFromUrl = url  => {
    return typeof url === 'string'
        ? url.substring(url.indexOf('/event/') + '/event/'.length, url.lastIndexOf('/'))
        : undefined
}

/**
 * Returns the sub event ID's for the given event
 * @param event   Event data
 * @returns {object[]}
 */
export const getSubEventIds = (event) => {
    const subEventUrls = get(event, 'sub_events', []).map(item => item['@id'])
    return subEventUrls.map(url => getEventIdFromUrl(url))
}

/**
 * Returns the ID's of events that have sub events
 * @param eventData   Event data
 * @returns {string[]}
 */
export const getEventsWithSubEvents = (eventData) => eventData
    .reduce((acc, event) => {
        const getSuperEventId = (_event) => {
            const subEvents = get(_event, 'sub_events', [])

            if (subEvents.length > 0) {
                acc.push(getEventIdFromUrl(_event['@id']))
                subEvents.forEach(getSuperEventId)
            }
        }

        getSuperEventId(event)
        return acc
    }, [])

/**
 * Recursively maps sub event data to super events (umbrella & recurring)
 * @param eventData   Event data containing all the events
 * @returns {object[]}
 */
export const mapSubEventDataToSuperEvents = (eventData) => {
    // array containing ID's of sub events
    let subEvents = []

    return eventData
        .reduce((acc, event) => {
            const updatedEvent = {...event}

            const updateEvent = (_event, depth = 0, subEventIndex = 0, subEventIndexes = []) => {
                const subEventIds = getSubEventIds(_event)
                const hasSubEvents = get(_event, 'sub_events', []).length > 0

                if (hasSubEvents) {
                    // push sub event id's to the array, so that they can be filtered out later
                    subEvents.push(...subEventIds)
                    // sub event data that should be set
                    const subEventDataToSet = subEventIds.map(subEventId => eventData.find(item => item.id === subEventId))

                    // we need to get the path to the event that we're updating if it isn't a top level sub event
                    if (depth > 0) {
                        subEventIndexes.push(subEventIndex)
                        // the path is built based on the sub event indexes. consider the following event structure:
                        // umbrella_event: {
                        //     sub_events: [
                        //         regular_event: {} (depth = 1, index = 0)
                        //         recurring_event: { (depth = 1, index = 1)
                        //             sub_events: [
                        //                 recurring_event: {...} (depth = 2, index = 0)
                        //                 regular_event: {...} (depth = 2, index = 1)
                        //             ]
                        //         }
                        //     ]
                        // }
                        // if we were to set the sub event data of the recurring event at depth 2,
                        // then subEventIndexes would be [1, 0] and the resulting path would be ['1', 'sub_events', '0', 'sub_events']
                        const path = subEventIndexes
                            .reduce((acc, index) => [...acc, `${index}`, 'sub_events'], [])

                        set(updatedEvent.sub_events, path, subEventDataToSet)
                    } else {
                        updatedEvent.sub_events = subEventDataToSet
                    }

                    // update sub events
                    _event.sub_events.forEach((subEvent, index) =>
                        updateEvent(subEvent, depth + 1, index, [...subEventIndexes]))
                }
            }

            updateEvent(event)
            return [...acc, updatedEvent]
        }, [])
        // filter out sub events from the event data
        .filter(event => !subEvents.includes(event.id))
}
