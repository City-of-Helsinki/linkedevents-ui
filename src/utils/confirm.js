import {getFirstMultiLanguageFieldValue} from './helpers'
import {deleteEvents, getSubEventIds, publishEvents} from './events'
import constants from '../constants'
import moment from 'moment'
import {get, isUndefined} from 'lodash'

const {PUBLICATION_STATUS, SUPER_EVENT_TYPE_RECURRING, SUPER_EVENT_TYPE_UMBRELLA} = constants

/**
 * Used with the Array sort method to sort events according to start time.
 * @param a Event A data
 * @param b Event B data
 * @returns {number}
 */
const compareDates = (a, b) => moment(a.start_time).unix() - moment(b.start_time).unix()

/**
 * Returns a string containing html markup that lists given sub events in an unsorted list
 * @param subEvents Sub event data
 * @returns {string}
 */
const getSubEventListing = (subEvents) =>
    `<ul>${subEvents
        // sort events by start time
        .sort(compareDates)
        .map((event => `<li>${getFirstMultiLanguageFieldValue(event.name)} (${moment(event.start_time).format('DD.MM.YYYY')})</li>`))
        .join(' ')}
    </ul>`

/**
 * Returns a string containing html markup displaying the event hierarchy of all the given events
 * @param subEventsMappedToEvents   Array containing the events whose hierarchies should be returned
 * @param events                    Array containing data of all the events that are being modified
 * @param intl
 * @returns {string}
 */
const getEventListing = (subEventsMappedToEvents, events, intl) =>
    subEventsMappedToEvents
        // sort events by start time
        .sort(compareDates)
        .map(event => {
            const eventListing = []

            // returns the event label and super event type badge where appropriate
            const getEventLabel = (_event) => {
                return `
                    ${_event.super_event_type === SUPER_EVENT_TYPE_RECURRING ? `<span class="badge badge-success text-uppercase tag-space">${intl.formatMessage({id: 'series'})}</span>` : ''}
                    ${_event.super_event_type === SUPER_EVENT_TYPE_UMBRELLA ? `<span class="badge badge-info text-uppercase tag-space">${intl.formatMessage({id: 'umbrella'})}</span>` : ''}
                    <strong>${getFirstMultiLanguageFieldValue(_event.name)}</strong> (${moment(_event.start_time).format('DD.MM.YYYY')})`
            }

            const getListing = (_event, topLevel = true) => {
                const hasSubEvents = get(_event, 'sub_events', []).length > 0
                const superEventUrl = get(_event, ['super_event', '@id'])
                const hasSuperEvent = !isUndefined(superEventUrl)
                const superEvent = events.find(item => item['@id'] === superEventUrl)
                const superEventType = superEvent ? superEvent.super_event_type : null

                if (hasSubEvents) {
                    // get label for top level events (umbrella & recurring), then recursively get the sub event listing
                    if (topLevel) {
                        // don't show default sub event listing for umbrella sub events as they might contain recurring events
                        const subEventHasSubEvents = !!_event.sub_events
                            .find(subEvent => get(subEvent, 'sub_events', []).length > 0)

                        eventListing.push(`
                            ${getEventLabel(_event)}
                            ${!subEventHasSubEvents ? getSubEventListing(_event.sub_events) : ''}
                        `)
                        // get listing for sub events
                        _event.sub_events.forEach(subEvent => getListing(subEvent, false))
                    // events that are not top level in the event hierarchy need to be wrapped in an <ul> for correct indentation
                    } else {
                        eventListing.push(`
                            <ul>
                                <li>${getEventLabel(_event)}</li>
                                ${getSubEventListing(_event.sub_events)}
                            </ul>
                        `)
                    }
                // wrap regular events that are sub events of umbrella events in an <ul>
                } else if (!hasSubEvents && superEventType === SUPER_EVENT_TYPE_UMBRELLA) {
                    eventListing.push(`<ul><li>${getEventLabel(_event)}</li></ul>`)
                // just show the label if the event is a regular event
                } else if (!hasSubEvents && !hasSuperEvent) {
                    eventListing.push(getEventLabel(_event))
                }
            }

            getListing(event)
            return eventListing.join(' ')
        })
        .join('<hr>')

/**
 * Returns the additional markup for the confirmation dialog based on given action type
 * @param action        Either 'update', 'delete' or 'cancel'
 * @param intl          React Intl
 * @param events        Possible sub events for the event
 * @returns {string}    Markup for the confirmation dialog
 */
export const getConfirmationMarkup = (action, intl, events = [])  => {
    const warningText = `<p>${intl.formatMessage({id: `editor-${action}-warning`})}</p>`
    let extraWarningText = intl.formatMessage({id: `editor-${action}-extra-warning`})
    extraWarningText = extraWarningText === `editor-${action}-extra-warning` ? '' : `<p>${extraWarningText}</p>`

    // array containing ID's of sub events
    let subEvents = []
    // todo: ASK RIKU ABOUT RECURSIVE SUB_EVENT DATA
    const subEventsMappedToEvents = events
        // map sub event data to their super events
        .reduce((acc, event) => {
            const updatedEvent = {...event}
            const subEventIds = getSubEventIds(event)

            if (subEventIds.length > 0) {
                updatedEvent.sub_events = events.filter(item => subEventIds.includes(item.id))
                subEvents.push(...subEventIds)
            }

            return [...acc, updatedEvent]
        }, [])
        // filter out sub events
        .filter(event => !subEvents.includes(event.id))

    const eventListing = getEventListing(subEventsMappedToEvents, events, intl)

    return eventListing.length > 0
        ? `${warningText}${extraWarningText}${eventListing}`
        : warningText
}

/**
 * Displays a confirmation modal.
 * The modal texts and action that will be run are determined by the given parameters.
 * @param eventData             Event data
 * @param action                Action to run
 * @param confirm               Confirm method
 * @param intl                  React intl
 * @param publicationStatus     Publication status
 * @returns {Promise}
 */
const showConfirmationModal = (
    eventData,
    action,
    confirm,
    intl,
    publicationStatus = PUBLICATION_STATUS.PUBLIC
) => new Promise((resolve) => {
    const eventIds = eventData.map(item => item.id)
    const multipleEvents = eventData.length > 1
    let message, style, actionButtonLabel
    let warningMessage = action

    if (publicationStatus === PUBLICATION_STATUS.DRAFT) {
        warningMessage = `${action}-draft`
    }

    const confirmActionMapping = {
        publish() {
            console.log(`${action} events: `, eventData)
            resolve(publishEvents(eventData))
        },
        update() {
            console.log(`${action} events: `, eventData)
        },
        cancel() {
            console.log(`${action} events`, eventData)
        },
        delete() {
            console.log(`${action} events`, eventIds)
            resolve(deleteEvents(eventIds))
        },
    }

    // set the modal texts based on the action to run
    if (action === 'publish') {
        message = multipleEvents ? 'confirm-publish-multi' : 'confirm-publish'
        style = 'message'
        actionButtonLabel = multipleEvents ? 'publish-events' : 'publish-event'
    }
    if (action === 'update') {
        // todo
    }
    if (action === 'delete' || action === 'delete-draft') {
        message = multipleEvents ? 'confirm-delete-multi' : 'confirm-delete'
        style = 'warning'
        actionButtonLabel = multipleEvents ? 'delete-events' : 'delete-event'
    }
    if (action === 'cancel') {
        // todo
    }

    confirm(
        message,
        style,
        actionButtonLabel,
        {
            action: confirmActionMapping[action],
            additionalMarkup: getConfirmationMarkup(warningMessage, intl, eventData),
        }
    )
})

export default showConfirmationModal
