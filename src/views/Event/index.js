import './index.scss'

import React from 'react'
import {connect} from 'react-redux'
import EventDetails from 'src/components/EventDetails'
import moment from 'moment'
import PropTypes from 'prop-types'

import {FormattedMessage, injectIntl, intlShape} from 'react-intl'

import {Button} from 'material-ui'
import Tooltip from 'material-ui/Tooltip'
import {push} from 'react-router-redux'

import {fetchEventDetails as fetchEventDetailsAction} from 'src/actions/events.js'
import {
    replaceData as replaceDataAction,
    deleteEvent as deleteEventAction, 
    cancelEvent as cancelEventAction,
} from 'src/actions/editor.js'
import {fetchSubEvents as fetchSubEventsAction} from 'src/actions/subEvents'

import {
    confirmAction, 
    clearFlashMsg as clearFlashMsgAction,
} from 'src/actions/app.js'

import {getStringWithLocale} from 'src/utils/locale'
import {mapAPIDataToUIFormat} from 'src/utils/formDataMapping.js'
import {checkEventEditability} from 'src/utils/checkEventEditability.js'

import constants from 'src/constants'

class EventPage extends React.Component {

    UNSAFE_componentWillMount() {
        const {match, fetchEventDetails, user, fetchSubEvents} = this.props

        fetchEventDetails(match.params.eventId, user)
        fetchSubEvents(this.props.match.params.eventId, user)
    }

    copyAsTemplate() {
        const {events:{event}, replaceData, routerPush} = this.props
        if(event) {
            replaceData(event)
            routerPush(`/event/create/new`)
        }
    }

    editEvent() {
        const {events:{event}, replaceData, routerPush} = this.props
        if(event) {
            replaceData(event)            
            routerPush(`/event/update/${event.id}`)
        }
    }

    getActionButtons() {
        let {eventIsEditable, eventEditabilityExplanation} = checkEventEditability(this.props.user, this.props.events.event)
        let buttons = <div className="actions">
            { this.getDeleteButton(!eventIsEditable) }
            { this.getCancelButton(!eventIsEditable) }
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
        const {user, events, cancelEvent} = this.props;
        const eventId = this.props.match.params.eventId;
        // TODO: maybe do a decorator for confirmable actions etc...?
        this.props.confirm(
            'confirm-cancel',
            'warning',
            'cancel-events',
            {
                action: () => cancelEvent(eventId, user, events.event),
                additionalMsg: getStringWithLocale(this.props, 'editor.values.name', 'fi'),
                additionalMarkup: this.getWarningMarkup(),
            }
        )
    }

    confirmDelete() {
        // TODO: maybe do a decorator for confirmable actions etc...?
        const eventId = this.props.match.params.eventId;
        const {user, deleteEvent, events} = this.props;

        this.props.confirm(
            'confirm-delete',
            'warning',
            'delete-events',
            {
                action: () => deleteEvent(eventId, user, events.event),
                additionalMsg: getStringWithLocale(this.props, 'editor.values.name', 'fi'),
                additionalMarkup: this.getWarningMarkup(),
            }
        )
    }

    getWarningMarkup() {
        let warningText = this.props.intl.formatMessage({id: 'editor-delete-warning'}) + '<br/>'
        let subEventWarning = ''
        if (this.props.subEvents.items && this.props.subEvents.items.length) {
            const subEventNames = []
            for (const subEvent of this.props.subEvents.items) {
                subEventNames.push(`</br><strong>${subEvent.name.fi}</strong> (${moment(subEvent.start_time).format('DD.MM.YYYY')})`)
            }
            subEventWarning = `</br>${this.props.intl.formatMessage({id: 'editor-delete-subevents-warning'})}</br>${subEventNames}`
        }
        return warningText + subEventWarning
    }

    render() {
        const user = this.props.user
        
        let event = mapAPIDataToUIFormat(this.props.events.event)

        // To prevent 'Can't access field of undefined errors'
        event.location = event.location || {}
        // Tooltip is empty if the event is editable
        let {eventIsEditable, eventEditabilityExplanation} = checkEventEditability(user, event)

        // Add necessary badges
        let draftClass = event.publication_status == constants.PUBLICATION_STATUS.DRAFT ? 'event-page draft' : 'event-page'
        let draftBadge = null
        if (event.publication_status === constants.PUBLICATION_STATUS.DRAFT) {
            draftBadge = (<span className="badge badge-warning warn tag-space"><FormattedMessage id="draft"/></span>)
        }
        let cancelledClass = event.publication_status == constants.EVENT_STATUS.CANCELLED ? 'event-page' : 'event-page'
        let cancelledBadge = null
        if (event.event_status === constants.EVENT_STATUS.CANCELLED) {
            cancelledBadge = (<span className="badge badge-danger tag-space"><FormattedMessage id="cancelled"/></span>)
        }

        if(this.props.events.eventError) {
            return (
                <header className="container header">
                    <h3>
                        <div><FormattedMessage id="event-page-error"/></div>
                    </h3>
                </header>
            )
        }

        const editEventButton = <Button raised onClick={e => this.editEvent(e)} disabled={!eventIsEditable} color="primary"><FormattedMessage id="edit-events"/></Button>
        const cancelEventButton = <Button raised disabled={!eventIsEditable} onClick={ (e) => this.confirmCancel(e)} color="accent"><FormattedMessage id="cancel-events"/></Button>
        const deleteEventButton = <Button raised disabled={!eventIsEditable} onClick={ (e) => this.confirmDelete(e)} color="accent"><FormattedMessage id="delete-events"/></Button>
        if(event && event.name) {
            return (
                <div className={draftClass}>
                    <header className="container header">
                        <h1>
                            {cancelledBadge}
                            {draftBadge}
                            { getStringWithLocale(event, 'name') }
                        </h1>
                    </header>
                    <div className="container">

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
                                <Button raised onClick={e => this.copyAsTemplate(e)} color="default"><FormattedMessage id="copy-event-to-draft"/></Button>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <EventDetails values={event} rawData={this.props.events.event}/>
                    </div>
                </div>
            )
        }
        else {
            return (
                <header className="container header">
                    <h3>
                        <div><FormattedMessage id="event-page-loading"/></div>
                    </h3>
                </header>
            )
        }
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
