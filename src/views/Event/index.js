import '!style!css!sass!./index.scss'

import React from 'react'
import {connect} from 'react-redux'
import {sendData} from 'src/actions/editor.js'

import {FormattedMessage} from 'react-intl'

import {RaisedButton, FlatButton} from 'material-ui'

import {fetchEventDetails} from 'src/actions/events.js'

class EventPage extends React.Component {

    componentWillMount() {
        this.props.dispatch(fetchEventDetails(this.props.params.eventId))
    }

    render() {
        let buttonStyle = {
            height: '72px',
            margin: '0 10px'
        }

        let event = this.props.events.event

        if(event) {
            return (
                <div className="event-page">
                    <div className="container header">
                        <h1>
                            {event.name.fi || event.name.se || event.name.en}
                        </h1>
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
    routing: state.routing
}))(EventPage)
