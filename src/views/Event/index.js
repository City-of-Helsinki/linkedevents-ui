import '!style-loader!css-loader!sass-loader!./index.scss'

import React from 'react'
import {connect} from 'react-redux'
import {sendData} from 'src/actions/editor.js'

import EventDetails from 'src/components/EventDetails'

import {FormattedMessage} from 'react-intl'

import {Button} from 'material-ui'

import {fetchEventDetails} from 'src/actions/events.js'

import {pushPath} from 'redux-simple-router'

import {getStringWithLocale} from 'src/utils/locale'
import {mapAPIDataToUIFormat} from 'src/utils/formDataMapping.js'
import {replaceData} from 'src/actions/editor.js'

import constants from 'src/constants'

class EventPage extends React.Component {

    componentWillMount() {
        this.props.dispatch(fetchEventDetails(this.props.params.eventId, this.props.user))
    }

    copyAsTemplate() {
        if(this.props.events.event) {
            let formData = mapAPIDataToUIFormat(this.props.events.event)
            formData.id = undefined
            delete formData.id

            this.props.dispatch(replaceData(formData))
            this.props.dispatch(pushPath(`/event/create/new`))
        }
    }

    editEvent() {
        if(this.props.events.event) {
            let formData = mapAPIDataToUIFormat(this.props.events.event)

            this.props.dispatch(replaceData(formData))
            this.props.dispatch(pushPath(`/event/update/${this.props.events.event.id}`))
        }
    }

    render() {
        let buttonStyle = {
            height: '64px',
            'marginRight': '10px'
        }

        let event = mapAPIDataToUIFormat(this.props.events.event)

        // To prevent 'Can't access field of undefined errors'
        event.location = event.location || {}

        // User can edit event
        let userCanEdit = false

        // TODO: refactor to a utils function
        if(event && this.props.user && event.event_status !== constants.EVENT_STATUS.CANCELLED &&
        this.props.user.organization && event.organization && this.props.user.organization === event.organization) {
            userCanEdit = true
        }

        // Add necessary badges
        let draftClass = event.publication_status == constants.PUBLICATION_STATUS.DRAFT ? "event-page draft" : "event-page"
        let draftBadge = null
        if (event.publication_status === constants.PUBLICATION_STATUS.DRAFT) {
            draftBadge = (<span style={{marginRight:'0.5em'}} className="label label-warning">LUONNOS</span>)
        }
        let cancelledClass = event.publication_status == constants.EVENT_STATUS.CANCELLED ? "event-page cancelled" : "event-page"
        let cancelledBadge = null
        if (event.event_status === constants.EVENT_STATUS.CANCELLED) {
            cancelledBadge = (<span style={{marginRight:'0.5em'}} className="label label-danger">PERUUTETTU</span>)
        }

        if(this.props.events.eventError) {
            return (
                <header className="container header">
                    <h3>
                        <div>Tapahtumaa ei löytynyt tai sinulla ei ole oikeuksia katsella sitä.</div>
                    </h3>
                </header>
            )
        }
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
                        <div className="col-sm-12">
                            <div className="col-sm-12 actions">
                                <Button raised onClick={e => this.editEvent(e)} disabled={!userCanEdit} style={buttonStyle} color="primary">Muokkaa tapahtumaa</Button>
                                <Button raised onClick={e => this.copyAsTemplate(e)} style={buttonStyle} color="secondary">Kopioi uuden tapahtuman pohjaksi</Button>
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
                        <div>Ladataan tapahtumaa...</div>
                    </h3>
                </header>
            )
        }
    }
}

export default connect(state => ({
    events: state.events,
    routing: state.routing,
    user: state.user
}))(EventPage)
