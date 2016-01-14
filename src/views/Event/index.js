import '!style!css!sass!./index.scss'

import React from 'react'
import {connect} from 'react-redux'
import {sendData} from 'src/actions/editor.js'

import {FormattedMessage} from 'react-intl'

import {RaisedButton, FlatButton} from 'material-ui'

import {fetchEventDetails} from 'src/actions/events.js'

import {pushPath} from 'redux-simple-router'

import {mapAPIDataToUIFormat} from 'src/utils/formDataMapping.js'
import {setData} from 'src/actions/editor.js'

class EventPage extends React.Component {

    componentWillMount() {
        this.props.dispatch(fetchEventDetails(this.props.params.eventId))
    }

    copyAsTemplate() {
        if(this.props.events.event) {
            console.log("Copy as template")
            let formData = mapAPIDataToUIFormat(this.props.events.event)
            delete formData.id
            console.log(formData)
            this.props.dispatch(setData(formData))
            this.props.dispatch(pushPath(`/event/create/new`))
        }
    }

    editEvent() {
        if(this.props.events.event) {
            console.log("Edit existing event")
            let formData = mapAPIDataToUIFormat(this.props.events.event)
            console.log(formData)
            this.props.dispatch(setData(formData))
            this.props.dispatch(pushPath(`/event/update/${this.props.events.event.id}`))
        }
    }

    render() {
        let buttonStyle = {
            height: '72px',
            margin: '0 10px'
        }
        let event = this.props.events.event

        // User can edit event
        let userCanEdit = false

        console.log(this.props.user, event)

        if(event && this.props.user) {
            userCanEdit = true
        }

        if(event) {
            return (
                <div className="event-page">
                    <div className="container header">
                        <h1>
                            {event.name.fi || event.name.se || event.name.en}
                        </h1>
                        <div className="actions">
                            <RaisedButton onClick={e => this.editEvent(e)} disabled={!userCanEdit} style={buttonStyle} primary={true} label="Muokkaa tapahtumaa" />
                            <RaisedButton onClick={e => this.copyAsTemplate(e)} style={buttonStyle} secondary={true} label="Kopioi uuden tapahtuman pohjaksi" />
                        </div>
                        <pre>
                            {JSON.stringify(event)}
                        </pre>
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
