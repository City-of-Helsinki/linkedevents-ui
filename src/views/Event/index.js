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
import {
    appendEventDataWithSubEvents,
    EventQueryParams,
    fetchEvent,
    getEventsWithSubEvents,
} from '../../utils/events'
import {getBadge, scrollToTop} from '../../utils/helpers'

import './index.scss'

const {
    USER_TYPE,
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
        // loading is true initially because we always fetch event data when the component is mounted
        loading: true,
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

        const queryParams = new EventQueryParams()
        queryParams.include = 'keywords,location,audience,in_language,external_links,sub_events'

        fetchEvent(eventId, queryParams, true)
            .then(eventData => {
                const [event, subEvents, superEvent] = eventData
                this.setState({event, subEvents, superEvent, loading: false})
            })
            .catch(() => this.setState({loading: false}))
    }

    /**
     * Opens the editor with the event data in given mode
     * @param mode  Whether event is copied as a template or being updated. Can be either 'copy' or 'update'
     */
    openEventInEditor = (mode = 'update') => {
        const {replaceData, routerPush} = this.props
        const {event} = this.state

        const route = mode === 'copy'
            ? 'create/new'
            : `update/${event.id}`

        if (event) {
            replaceData(event)
            routerPush(`/event/${route}`)
            scrollToTop()
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
     * Returns a div containing all the action buttons for the view
     * @returns {*}
     */
    getEventActions = () => {
        const {user} = this.props
        const {event, loading} = this.state

        const userType = get(user, 'userType')
        const isDraft = event.publication_status === PUBLICATION_STATUS.DRAFT
        const isAdmin = userType === USER_TYPE.ADMIN
        const editEventButton = this.getActionButton('edit', this.openEventInEditor)
        const publishEventButton = this.getActionButton('publish')
        const cancelEventButton = this.getActionButton('cancel')
        const deleteEventButton = this.getActionButton('delete')

        return  <div className="event-actions">
            <div className="cancel-delete-btn">
                {cancelEventButton}
                {deleteEventButton}
            </div>
            <div className="edit-copy-btn">
                {isAdmin && isDraft && publishEventButton}
                {editEventButton}
                <Button
                    raised
                    disabled={loading || isDraft}
                    color="default"
                    onClick={() => this.openEventInEditor('copy')}
                >
                    <FormattedMessage id="copy-event-to-draft"/>
                </Button>
            </div>
        </div>
    }

    /**
     * Returns a button for the given action
     * @param action    Action to run
     * @param onClick   onClick function that should be used instead of the default one
     * @returns {*}
     */
    getActionButton = (action, onClick) => {
        const {user, intl} = this.props
        const {event, loading} = this.state
        const formattedEvent = mapAPIDataToUIFormat(event)
        const {editable, explanationId} = checkEventEditability(user, formattedEvent, action)
        const disabled = !editable || loading

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

        return disabled && explanationId
            ? <Tooltip title={intl.formatMessage({id: explanationId})}>
                <span>{button}</span>
            </Tooltip>
            : button
    }

    /**
     * Opens a confirmation modal and runs the given action
     * @param action    Action to run
     */
    confirmAction = (action) => {
        const {confirm, intl, routerPush} = this.props;
        const {event, subEvents} = this.state
        const eventData = [{...event}, ...subEvents]

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

        // // get the id's of events that have sub events
        // // don't re-fetch sub event data for the event that the action is run for, as we already have it
        const eventsWithSubEvents = getEventsWithSubEvents(eventData)
            .filter(eventId => eventId !== event.id)

        // // we need to append the event data with sub events of recurring events,
        // // when we're running the action for an umbrella event
        eventsWithSubEvents.length > 0
            ? appendEventDataWithSubEvents(eventData, eventsWithSubEvents)
                .then((appendedData) => doConfirm(appendedData))
            : doConfirm(eventData)
    }

    render() {
        const {event, superEvent, loading, publisher} = this.state

        const formattedEvent = mapAPIDataToUIFormat(this.state.event)
        const isUmbrellaEvent = event.super_event_type === SUPER_EVENT_TYPE_UMBRELLA
        const isRecurringEvent = event.super_event_type === SUPER_EVENT_TYPE_RECURRING
        const isDraft = event.publication_status === PUBLICATION_STATUS.DRAFT
        const isCancelled = event.event_status === EVENT_STATUS.CANCELLED
        const publishedText = this.getPublishedText();

        return (
            <div className="event-page container">
                <header>
                    <h1>
                        {loading
                            ? <CircularProgress size={60}/>
                            : getStringWithLocale(event, 'name')
                        }
                    </h1>
                    <h4>
                        {isCancelled && getBadge('cancelled')}
                        {isDraft && getBadge('draft')}
                        {isUmbrellaEvent && getBadge('umbrella')}
                        {isRecurringEvent && getBadge('series')}
                    </h4>
                </header>
                {this.getEventActions()}
                <div className="published-information">
                    {publishedText}
                </div>
                <EventDetails
                    values={formattedEvent}
                    superEvent={superEvent}
                    rawData={event}
                    publisher={publisher}
                />
                <footer>
                    {this.getEventActions()}
                </footer>
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

const mapDispatchToProps = (dispatch) => ({
    replaceData: (event) => dispatch(replaceDataAction(event)),
    routerPush: (url) => dispatch(push(url)),
    confirm: (msg, style, actionButtonLabel, data) => dispatch(confirmAction(msg, style, actionButtonLabel, data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(EventPage))
