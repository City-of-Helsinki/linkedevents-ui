import React from 'react'
import {connect} from 'react-redux'
import EventDetails from 'src/components/EventDetails'
import moment from 'moment'
import PropTypes from 'prop-types'
import {FormattedMessage, injectIntl, intlShape} from 'react-intl'
import {Button, CircularProgress} from 'material-ui'
import Tooltip from 'material-ui/Tooltip'
import {push} from 'react-router-redux'
import {replaceData as replaceDataAction} from 'src/actions/editor.js'
import {confirmAction} from 'src/actions/app.js'
import {getStringWithLocale} from 'src/utils/locale'
import {mapAPIDataToUIFormat} from 'src/utils/formDataMapping.js'
import {checkEventEditability} from 'src/utils/checkEventEditability.js'
import client from '../../api/client'
import constants from 'src/constants'
import showConfirmationModal from '../../utils/confirm'
import {get} from 'lodash'
import {fetchEvent, fetchEvents, getEventIdFromUrl, getEventsWithSubEvents} from '../../utils/events'
import {getBadge} from '../../utils/helpers'

import './index.scss'

const {
    PUBLICATION_STATUS,
    EVENT_STATUS,
    SUPER_EVENT_TYPE_UMBRELLA,
    SUPER_EVENT_TYPE_RECURRING,
} = constants

class EventPage extends React.Component {

    state = {
        event: {},
        superEvent: {},
        subEvents: [],
        loading: false,
        publisher: null,
    }

    componentDidMount() {
        this.fetchEventData()
    }

    componentDidUpdate(prevProps, prevState) {
        const {event} = this.state

        const publisherId = get(event, 'publisher')
        const oldPublisherId = get(prevState, ['event', 'publisher'])
        const eventId = get(this.props.match, ['params', 'eventId'])
        const oldEventId = get(prevProps, ['match', 'params', 'eventId'])

        if (eventId !== oldEventId) {
            this.fetchEventData()
        }

        if (publisherId && publisherId !== oldPublisherId) {
            client.get(`organization/${publisherId}`)
                .then(response => this.setState({publisher: response.data}))
        }
    }

    /**
     * Fetches the event, sub event and super event data
     */
    fetchEventData = () => {
        const eventId = get(this.props, ['match', 'params', 'eventId'])

        if (!eventId) {
            return
        }

        this.setState({loading: true})

        fetchEvent(eventId, 'keywords,location,audience,in_language,external_links,sub_events')
            .then(response => {
                const event = response.data
                let subEvents = event.sub_events
                let superEvent = {}
                const superEventUrl = get(event, ['super_event', '@id'])
                const superEventId = getEventIdFromUrl(superEventUrl)

                // event doesn't have a super event, set data
                if (!superEventId) {
                    this.setState({event, superEvent, subEvents, loading: false})
                    return
                }

                // fetch super event data
                fetchEvent(superEventId)
                    .then(value => {
                        superEvent = value.data

                        this.setState({event, superEvent, subEvents})
                    })
                    .finally(() => this.setState({loading: false}))
            })
    }

    copyAsTemplate = () => {
        const {replaceData, routerPush} = this.props
        const {event} = this.state

        if (event) {
            replaceData(event)
            routerPush(`/event/create/new`)
        }
    }

    editEvent = () => {
        const {replaceData, routerPush} = this.props
        const {event} = this.state

        if (event) {
            replaceData(event)
            routerPush(`/event/update/${event.id}`)
        }
    }

    /**
     * Returns the publisher & creator info text
     * @returns {null|*}
     */
    getPublishedText = () => {
        const {event, publisher} = this.state

        if (!publisher) {
            return null
        }

        const createdBy = get(event, 'created_by')
        const publishedAt = moment(event.last_modified_time).format('D.M.YYYY HH:mm')
        let creator, email

        if (createdBy) {
            [creator, email] = createdBy.split(' - ')
        }

        return (
            <span>
                <FormattedMessage id="event-publisher-info" values={{publisher: publisher.name}}/>
                {creator && email &&
                    <React.Fragment>
                        <span> | {creator} | </span>
                        <a href={`mailto:${email}`}>{email}</a>
                    </React.Fragment>
                }
                <span> | {publishedAt}</span>
            </span>
        )
    }

    /**
     * Returns a button for the given action
     * @param action    Action to run
     * @param onClick   onClick function that should be used instead of the default one
     * @returns {*}
     */
    getActionButton = (action, onClick) => {
        const {user} = this.props
        const event = mapAPIDataToUIFormat(this.state.event)
        const {eventIsEditable, eventEditabilityExplanation} = checkEventEditability(user, event)
        const isDraft = event.publication_status === PUBLICATION_STATUS.DRAFT
        const disabled = action === 'cancel'
            ? isDraft || !eventIsEditable
            : !eventIsEditable

        let color

        switch (action) {
            case 'publish':
            case 'edit':
                color = 'primary'
                break
            case 'cancel':
            case 'delete':
                color = 'accent'
                break
        }

        const button = <Button
            raised
            disabled={disabled}
            onClick={() => onClick ? onClick() : this.confirmAction(action)}
            color={color}
        >
            <FormattedMessage id={`${action}-event`}/>
        </Button>

        return eventIsEditable
            ? <React.Fragment>{button}</React.Fragment>
            : <Tooltip title={eventEditabilityExplanation}>
                <span>{button}</span>
            </Tooltip>
    }

    /**
     * Opens a confirmation modal and runs the given action
     * @param action    Action to run
     */
    confirmAction = (action) => {
        const {confirm, intl, routerPush} = this.props;
        const {event, subEvents} = this.state
        let eventData = [event, ...subEvents]

        // opens the confirm modal
        const doConfirm = (data) => {
            showConfirmationModal(data, action, confirm, intl, event.publication_status)
                .then(() => {
                    // navigate to event listing after delete action
                    if (action === 'delete') {
                        routerPush('/')
                    }
                    // re-fetch event data after cancel or publish action
                    if (action === 'cancel' || action === 'publish') {
                        this.fetchEventData()
                    }
                })
        }

        // get the id's of events that have sub events
        // don't re-fetch sub event data for the event that the action is run for, as we already have it
        const eventsWithSubEvents = getEventsWithSubEvents(eventData)
            .filter(eventId => eventId !== event.id)

        // we need to append the event data with sub events of recurring events,
        // if we're running the action for an umbrella event
        if (eventsWithSubEvents.length > 0) {
            fetchEvents(eventsWithSubEvents.join())
                .then(response => {
                    const fetchedSubEventData = response.data.data
                    eventData = [...eventData, ...fetchedSubEventData]
                    doConfirm(eventData)
                })
        } else {
            doConfirm(eventData)
        }
    }

    render() {
        const {event, superEvent, loading, publisher} = this.state
        const formattedEvent = mapAPIDataToUIFormat(this.state.event)

        // display loading text + spinner while data is being fetched
        if (loading) {
            return (
                <header className="header">
                    <div className="container">
                        <h3><FormattedMessage id="event-page-loading"/><CircularProgress style={{margin: '0 10px'}}/></h3>
                    </div>
                </header>
            )
        }

        const isUmbrellaEvent = event.super_event_type === SUPER_EVENT_TYPE_UMBRELLA
        const isRecurringEvent = event.super_event_type === SUPER_EVENT_TYPE_RECURRING
        const isDraft = event.publication_status === PUBLICATION_STATUS.DRAFT
        const isCancelled = event.event_status === EVENT_STATUS.CANCELLED
        const editEventButton = this.getActionButton('edit', this.editEvent)
        const publishEventButton = this.getActionButton('publish')
        const cancelEventButton = this.getActionButton('cancel')
        const deleteEventButton = this.getActionButton('delete')
        const publishedText = this.getPublishedText();

        return (
            <div className="event-page container">
                <header className="header">
                    <h1>
                        {getStringWithLocale(event, 'name')}
                    </h1>
                    <h4>
                        {isCancelled && getBadge('cancelled')}
                        {isDraft && getBadge('draft')}
                        {isUmbrellaEvent && getBadge('umbrella')}
                        {isRecurringEvent && getBadge('series')}
                    </h4>
                </header>
                <div className="event-actions">
                    <div className="cancel-delete-btn">
                        {cancelEventButton}
                        {deleteEventButton}
                    </div>
                    <div className="edit-copy-btn">
                        {isDraft && publishEventButton}
                        {editEventButton}
                        <Button
                            raised
                            disabled={isDraft}
                            color="default"
                            onClick={e => this.copyAsTemplate(e)}
                        >
                            <FormattedMessage id="copy-event-to-draft"/>
                        </Button>
                    </div>
                </div>
                <div className="published-information">
                    {publishedText}
                </div>
                <EventDetails
                    values={formattedEvent}
                    superEvent={superEvent}
                    rawData={event}
                    publisher={publisher}
                />
            </div>
        )
    }
}

EventPage.propTypes = {
    intl: intlShape.isRequired,
    user: PropTypes.object,
    match: PropTypes.object,
    events: PropTypes.object,
    superEvent: PropTypes.object,
    subEvents: PropTypes.object,
    loading: PropTypes.bool,
    replaceData: PropTypes.func,
    routerPush: PropTypes.func,
    confirm: PropTypes.func,
}

const mapStateToProps = (state) => ({
    user: state.user,
})

// todo: delete unused methods from redux
const mapDispatchToProps = (dispatch) => ({
    // fetchEventDetails: (eventId, user) => dispatch(fetchEventDetailsAction(eventId, user)),
    replaceData: (event) => dispatch(replaceDataAction(event)),
    routerPush: (url) => dispatch(push(url)),
    confirm: (msg, style, actionButtonLabel, data) => dispatch(confirmAction(msg, style, actionButtonLabel, data)),
    // deleteEvent: (eventId, user, values) => dispatch(deleteEventAction(eventId, user, values)),
    // cancelEvent: (eventId, user, values) => dispatch(cancelEventAction(eventId, user, values)),
    // fetchSubEvents: (user, superEventId) => dispatch(fetchSubEventsAction(user, superEventId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(EventPage))
