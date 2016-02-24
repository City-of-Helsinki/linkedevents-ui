import '!style!css!sass!./index.scss'

import React from 'react'
import {connect} from 'react-redux'
import {sendData} from 'src/actions/editor.js'

import {FormattedMessage} from 'react-intl'

import {RaisedButton, FlatButton} from 'material-ui'

import {fetchEventDetails} from 'src/actions/events.js'

import {pushPath} from 'redux-simple-router'

import { getStringWithLocale } from 'src/utils/locale'

import {mapAPIDataToUIFormat} from 'src/utils/formDataMapping.js'
import {setData} from 'src/actions/editor.js'

class EventCreated extends React.Component {

    componentWillMount() {
        if(this.props.params.action !== 'delete') {
            this.props.dispatch(fetchEventDetails(this.props.params.eventId, this.props.user))
        }
    }

    goToEvent() {
        if(this.props.events.event) {
            this.props.dispatch(pushPath(`/event/${this.props.events.event.id}`))
        }
    }

    goToBrowsing() {
        this.props.dispatch(pushPath(`/`))
    }

    getActionButtons() {
        let buttonStyle = {
            height: '72px',
            margin: '0 10px'
        }
        if(this.props.params.action !== 'delete') {
            return (
                <div className="actions">
                    <RaisedButton onClick={e => this.goToEvent(e)} style={buttonStyle} secondary={true} label="Siirry tapahtumaan" />
                </div>
            )
        } else {
            return (
                <div className="actions">
                    <RaisedButton onClick={e => this.goToBrowsing(e)} style={buttonStyle} secondary={true} label="Palaa takaisin tapahtumiin" />
                </div>
            )
        }

    }

    render() {

        let event = this.props.events.event

        // User can edit event
        let userCanEdit = false

        if(event && this.props.user) {
            userCanEdit = true
        }

        let headerText = "Tapahtuma luotiin onnistuneesti!"
        let eventName = getStringWithLocale(this.props, 'events.event.name')

        if(this.props.params.action === 'update') {
            headerText = "Tapahtuma päivitettiin onnistuneesti!"
        } else if(this.props.params.action === 'delete') {
            headerText = "Tapahtuma poistettiin!"
        }

        if(this.props.params.action === 'delete' || event) {
            return (
                <div className="event-page">
                    <div className="container header">
                        <h1>
                            {headerText}
                        </h1>
                        <h3>
                            {eventName}
                        </h3>
                        { this.getActionButtons() }
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
}))(EventCreated)
