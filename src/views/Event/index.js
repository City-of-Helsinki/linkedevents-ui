import './index.scss'

import React from 'react'
import {connect} from 'react-redux'
import EventDetails from 'src/components/EventDetails'
import moment from 'moment'
import PropTypes from 'prop-types'

import {FormattedMessage} from 'react-intl'

import {Button} from 'material-ui'
import Tooltip from 'material-ui/Tooltip'
import {push} from 'react-router-redux'

import {fetchEventDetails as fetchEventDetailsAction} from 'src/actions/events.js'
import {replaceData as replaceDataAction} from 'src/actions/editor.js'

import {getStringWithLocale} from 'src/utils/locale'
import {mapAPIDataToUIFormat} from 'src/utils/formDataMapping.js'
import {checkEventEditability} from 'src/utils/checkEventEditability.js'

import constants from 'src/constants'

class EventPage extends React.Component {

    UNSAFE_componentWillMount() {
        const {match, fetchEventDetails, user} = this.props

        fetchEventDetails(match.params.eventId, user)
    }

    copyAsTemplate() {
        const {events:{event}, replaceData, routerPush} = this.props
        if(event) {
            let formData = mapAPIDataToUIFormat(event)
            formData.id = undefined
            delete formData.id

            replaceData(formData)
            routerPush(`/event/create/new`)
        }
    }

    editEvent() {
        const {events:{event}, replaceData, routerPush} = this.props
        if(event) {
            let formData = mapAPIDataToUIFormat(event)

            replaceData(formData)            
            routerPush(`/event/update/${event.id}`)
        }
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
            draftBadge = (<span style={{marginRight:'0.5em'}} className="label label-warning text-uppercase"><FormattedMessage id="draft"/></span>)
        }
        let cancelledClass = event.publication_status == constants.EVENT_STATUS.CANCELLED ? 'event-page cancelled' : 'event-page'
        let cancelledBadge = null
        if (event.event_status === constants.EVENT_STATUS.CANCELLED) {
            cancelledBadge = (<span style={{marginRight:'0.5em'}} className="label label-danger text-uppercase"><FormattedMessage id="cancelled"/></span>)
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
                            {eventIsEditable ? editEventButton :
                                <Tooltip title={eventEditabilityExplanation}>
                                    <span>{editEventButton}</span>
                                </Tooltip>
                            }
                            <Button raised onClick={e => this.copyAsTemplate(e)} color="accent"><FormattedMessage id="copy-event-to-draft"/></Button>
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
    replaceData: PropTypes.func,
    routerPush: PropTypes.func,
}

const mapStateToProps = (state) => ({
    events: state.events,
    routing: state.routing,
    user: state.user,
})

const mapDispatchToProps = (dispatch) => ({
    fetchEventDetails: (eventId, user) => dispatch(fetchEventDetailsAction(eventId, user)),
    routerPush: (url) => dispatch(push(url)),
    replaceData: (formData) => dispatch(replaceDataAction(formData)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EventPage)
