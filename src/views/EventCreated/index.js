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

class EventCreated extends React.Component {

    componentWillMount() {
        this.props.dispatch(fetchEventDetails(this.props.params.eventId))
    }

    goToEvent() {
        if(this.props.events.event) {
            this.props.dispatch(pushPath(`/${this.props.events.event.id}`))
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

        if(event && this.props.user) {
            userCanEdit = true
        }

        let headerText = "Tapahtuma luotiin onnistuneesti!"

        if(this.props.params.action === 'update') {
            headerText = "Tapahtuma päivitettiin onnistuneesti!"
        }

        if(event) {
            return (
                <div className="event-page">
                    <div className="container header">
                        <h1>
                            {headerText}
                        </h1>
                        <h3>
                            {event.name.fi || event.name.se || event.name.en}
                        </h3>
                        <div className="actions">
                            <RaisedButton onClick={e => this.goToEvent(e)} style={buttonStyle} secondary={true} label="Siirry tapahtumaan" />
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
}))(EventCreated)
