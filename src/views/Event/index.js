import React from 'react'
import {connect} from 'react-redux'
import EventDetails from 'src/components/EventDetails'
import moment from 'moment'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import {FormattedMessage, injectIntl, intlShape} from 'react-intl'
import {Button} from 'material-ui'
import Tooltip from 'material-ui/Tooltip'
import {push} from 'react-router-redux'
import classNames from 'classnames'

import {fetchEventDetails as fetchEventDetailsAction} from 'src/actions/events'
import {
    replaceData as replaceDataAction,
    deleteEvent as deleteEventAction,
    cancelEvent as cancelEventAction,
} from 'src/actions/editor.js'
import {fetchSubEvents as fetchSubEventsAction} from 'src/actions/subEvents'
import {confirmAction} from 'src/actions/app.js'
import {getStringWithLocale} from 'src/utils/locale'
import {mapAPIDataToUIFormat} from 'src/utils/formDataMapping.js'
import {checkEventEditability} from 'src/utils/checkEventEditability.js'
import client from '../../api/client'
import constants from 'src/constants'

import './index.scss'

class EventPage extends React.Component {
    state = {
        publisher: null,
    }

    componentDidMount() {
        const {
            match,
            fetchEventDetails,
            user,
            fetchSubEvents,
        } = this.props

        fetchEventDetails(match.params.eventId, user)
        fetchSubEvents(this.props.match.params.eventId, user)
    }

    componentDidUpdate(prevProps) {
        const publisherId = get(this.props, 'events.event.publisher')
        const oldPublisherId = get(prevProps, 'events.event.publisher')

        if (publisherId && publisherId !== oldPublisherId) {
            client.get(`organization/${publisherId}`).then(response => {
                this.setState({
                    publisher: response.data,
                })
            })
        }
    }

    copyAsTemplate() {
        const {events: {event}, replaceData, routerPush} = this.props
        if (event) {
            replaceData(event)
            routerPush(`/event/create/new`)
        }
    }

    editEvent() {
        const {events: {event}, replaceData, routerPush} = this.props
        if (event) {
            replaceData(event)
            routerPush(`/event/update/${event.id}`)
        }
    }

    getActionButtons() {
        let {eventIsEditable, eventEditabilityExplanation} = checkEventEditability(this.props.user, this.props.events.event)
        let buttons = <div className="actions">
            {this.getDeleteButton(!eventIsEditable)}
            {this.getCancelButton(!eventIsEditable)}
        </div>
        return (
            <div>
                {eventIsEditable ? buttons :
                    <Tooltip title={eventEditabilityExplanation}>
                        <span>{buttons}</span>
                    </Tooltip>
                }
            </div>
        )
    }

    confirmCancel() {
        const {user, events, cancelEvent} = this.props
        const eventId = this.props.match.params.eventId
        // TODO: maybe do a decorator for confirmable actions etc...?
        this.props.confirm(
            'confirm-cancel',
            'warning',
            'cancel-events',
            {
                action: () => cancelEvent(eventId, user, events.event),
                additionalMsg: getStringWithLocale(this.props, 'editor.values.name', 'fi'),
                additionalMarkup: this.getWarningMarkup('cancel'),
            }
        )
    }

    confirmDelete() {
        // TODO: maybe do a decorator for confirmable actions etc...?
        const eventId = this.props.match.params.eventId
        const {user, deleteEvent, events} = this.props

        this.props.confirm(
            'confirm-delete',
            'warning',
            'delete-events',
            {
                action: () => deleteEvent(eventId, user, events.event),
                additionalMsg: getStringWithLocale(this.props, 'editor.values.name', 'fi'),
                additionalMarkup: this.getWarningMarkup('delete'),
            }
        )
    }

    // action: either 'delete' or 'cancel'
    getWarningMarkup(action) {
        let warningText = this.props.intl.formatMessage({id: `editor-${action}-warning`}) + '<br/>'
        let subEventWarning = ''
        if (this.props.subEvents.items && this.props.subEvents.items.length) {
            const subEventNames = []
            for (const subEvent of this.props.subEvents.items) {
                subEventNames.push(`</br><strong>${subEvent.name.fi}</strong> (${moment(subEvent.start_time).format('DD.MM.YYYY')})`)
            }
            subEventWarning = `</br>${this.props.intl.formatMessage({id: `editor-${action}-subevents-warning`})}</br>${subEventNames}`
        }
        return warningText + subEventWarning
    }

    getPublishedText = () => {
        const {events: {event}, intl} = this.props
        const {publisher} = this.state

        if (!publisher) {
            return null
        }

        const values = {
            publisher: publisher.name,
            createdBy: get(event, 'created_by', ''),
            publishedAt: moment(event.last_modified_time).format('D.M.YYYY HH:mm'),
        }

        return intl.formatMessage({
            id: values.createdBy ? 'event-publisher-info-with-created-by' : 'event-publisher-info',
        }, values);
    }

    render() {
        const {user} = this.props
        let event = mapAPIDataToUIFormat(this.props.events.event)

        if (!event || !event.name) {
            return (
                <header className="header">
                    <div className="container">
                        <h3><FormattedMessage id="event-page-loading"/></h3>
                    </div>
                </header>
            )
        }

        if (this.props.events.eventError) {
            return (
                <header className="header">
                    <div className="container">
                        <h3><FormattedMessage id="event-page-error"/></h3>
                    </div>
                </header>
            )
        }

        // Tooltip is empty if the event is editable
        let {eventIsEditable, eventEditabilityExplanation} = checkEventEditability(user, event)

        const isDraft = event.publication_status === constants.PUBLICATION_STATUS.DRAFT
        const isCancelled = event.publication_status === constants.EVENT_STATUS.CANCELLED

        const editEventButton = <Button raised onClick={e => this.editEvent(e)} disabled={!eventIsEditable}
            color="primary"><FormattedMessage id="edit-events"/></Button>
        const cancelEventButton = <Button raised disabled={!eventIsEditable} onClick={(e) => this.confirmCancel(e)}
            color="accent"><FormattedMessage id="cancel-events"/></Button>
        const deleteEventButton = <Button raised disabled={!eventIsEditable} onClick={(e) => this.confirmDelete(e)}
            color="accent"><FormattedMessage id="delete-events"/></Button>

        const publishedText = this.getPublishedText();
        return (
            <div className={classNames('event-page', {
                'draft': isDraft,
                'cancelled': isCancelled,
            })}>
                <div className="container">
                    <header className="header">
                        <h1>
                            {isCancelled && <span className="badge badge-danger tag-space"><FormattedMessage id="cancelled"/></span>}
                            {isDraft && <span className="badge badge-warning warn tag-space"><FormattedMessage id="draft"/></span>}
                            {getStringWithLocale(event, 'name')}
                        </h1>
                    </header>
                    <div className="event-actions">
                        <div className="cancel-delete-btn">
                            {eventIsEditable ? cancelEventButton :
                                <Tooltip title={eventEditabilityExplanation}>
                                    <span>{cancelEventButton}</span>
                                </Tooltip>
                            }
                            {eventIsEditable ? deleteEventButton :
                                <Tooltip title={eventEditabilityExplanation}>
                                    <span>{deleteEventButton}</span>
                                </Tooltip>
                            }
                        </div>
                        <div className="edit-copy-btn">
                            {eventIsEditable ? editEventButton :
                                <Tooltip title={eventEditabilityExplanation}>
                                    <span>{editEventButton}</span>
                                </Tooltip>
                            }
                            <Button raised onClick={e => this.copyAsTemplate(e)} color="default">
                                <FormattedMessage id="copy-event-to-draft"/>
                            </Button>
                        </div>
                    </div>
                    <div className="published-information">
                        {publishedText}
                    </div>
                    <EventDetails
                        values={event}
                        rawData={this.props.events.event}
                        publisher={this.state.publisher}
                    />
                </div>
            </div>
        )
    }
}

EventPage.propTypes = {
    match: PropTypes.object,
    fetchEventDetails: PropTypes.func,
    user: PropTypes.object,
    events: PropTypes.object,
    subEvents: PropTypes.object,
    replaceData: PropTypes.func,
    routerPush: PropTypes.func,
    confirm: PropTypes.func,
    cancelEvent: PropTypes.func,
    deleteEvent: PropTypes.func,
    editor: PropTypes.object,
    intl: intlShape.isRequired,
    fetchSubEvents: PropTypes.func,
    deleteSubEvent: PropTypes.func,
}

const mapStateToProps = (state) => ({
    events: state.events,
    subEvents: state.subEvents,
    routing: state.routing,
    user: state.user,
})

const mapDispatchToProps = (dispatch) => ({
    fetchEventDetails: (eventId, user) => dispatch(fetchEventDetailsAction(eventId, user)),
    routerPush: (url) => dispatch(push(url)),
    replaceData: (event) => dispatch(replaceDataAction(event)),
    confirm: (msg, style, actionButtonLabel, data) => dispatch(confirmAction(msg, style, actionButtonLabel, data)),
    deleteEvent: (eventId, user, values) => dispatch(deleteEventAction(eventId, user, values)),
    cancelEvent: (eventId, user, values) => dispatch(cancelEventAction(eventId, user, values)),
    fetchSubEvents: (user, superEventId) => dispatch(fetchSubEventsAction(user, superEventId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(EventPage))
