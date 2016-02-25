import '!style!css!sass!./index.scss'

import React from 'react'
import {connect} from 'react-redux'
import {sendData} from 'src/actions/editor.js'

import EventDetails from 'src/components/EventDetails'

import {FormattedMessage} from 'react-intl'

import {RaisedButton, FlatButton} from 'material-ui'

import {fetchEventDetails} from 'src/actions/events.js'

import {pushPath} from 'redux-simple-router'

import {getStringWithLocale} from 'src/utils/locale'
import {mapAPIDataToUIFormat} from 'src/utils/formDataMapping.js'
import {replaceData} from 'src/actions/editor.js'

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

        if(event && this.props.user) {
            userCanEdit = true
        }

        let draftClass = event.publication_status == "draft" ? "event-page draft" : "event-page"
        let draftBadge = null
        if (event.publication_status == "draft") {
            draftBadge = (<span style={{marginRight:'0.5em'}} className="label label-warning">LUONNOS</span>)
        }
        if(event && event.name) {
            return (
                <div className={draftClass}>
                    <header className="container header">
                        <h1>
                            {draftBadge}
                            { getStringWithLocale(event, 'name') }
                        </h1>
                    </header>
                    <div className="container">
                        <div className="col-sm-12">
                            <div className="col-sm-12 actions">
                                <RaisedButton onClick={e => this.editEvent(e)} disabled={!userCanEdit} style={buttonStyle} primary={true} label="Muokkaa tapahtumaa" />
                                <RaisedButton onClick={e => this.copyAsTemplate(e)} style={buttonStyle} secondary={true} label="Kopioi uuden tapahtuman pohjaksi" />
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
            return (<div>Loading</div>)
        }
    }
}

export default connect(state => ({
    events: state.events,
    routing: state.routing,
    user: state.user
}))(EventPage)
