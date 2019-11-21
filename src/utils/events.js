import client from '../api/client'
import moment from 'moment'
import constants from '../constants'
import {get} from 'lodash'
import {getIsUserOfType, getUser} from './user'

const {PUBLICATION_STATUS} = constants

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
 * @param eventId  Event of ID that should be deleted
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
