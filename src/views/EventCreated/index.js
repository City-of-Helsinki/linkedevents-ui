import '!style-loader!css-loader!sass-loader!./index.scss'

import React from 'react'
import {connect} from 'react-redux'

import {FormattedMessage} from 'react-intl'

import {Button} from 'material-ui'

import {fetchEventDetails} from 'src/actions/events.js'
import { setFlashMsg } from '../../actions/app'

import { push } from 'react-router-redux'

class EventCreated extends React.Component {

    componentWillMount() {
        if(this.props.match.params.action !== 'delete') {
            let headerTranslationId= this.getEventHeaderTranslationId()
            this.props.dispatch(setFlashMsg(headerTranslationId, 'success'))
            this.props.dispatch(push(`/event/${this.props.match.params.eventId}`))
        }
    }

    goToBrowsing() {
        this.props.dispatch(push(`/`))
    }

    getActionButtons() {
        let buttonStyle = {
            height: '72px',
            margin: '0 10px'
        }

        return (
            <div className="actions">
                <Button raised onClick={e => this.goToBrowsing(e)} style={buttonStyle} color="accent">Palaa takaisin tapahtumiin</Button>
            </div>
        )
    }

    getEventHeaderTranslationId() {
        let event = this.props.events.event
        let headerTranslationId = 'event-creation-default-success' 

        if(this.props.match.params.action === 'update') {
            headerTranslationId = 'event-creation-update-success'
        } else if(this.props.match.params.action === 'savedraft') {
            headerTranslationId = 'event-creation-savedraft-success'
        }  else if(this.props.match.params.action === 'savepublic') {
            headerTranslationId = 'event-creation-savepublic-success'
        } else if(this.props.match.params.action === 'create' && typeof event.super_event === 'object') {
            headerTranslationId = 'event-creation-multipleevents-success'
        } else if(this.props.match.params.action === 'create') {
            headerTranslationId = 'event-creation-create-success'
        } else if(this.props.match.params.action === 'delete') {
            headerTranslationId = 'event-creation-delete-success'
        } else if(this.props.match.params.action === 'cancel') {
            headerTranslationId = 'event-creation-cancel-success'
        } else if(this.props.match.params.action === 'publish') {
            headerTranslationId = 'event-creation-publish-success'
        }

        return headerTranslationId
    }

    render() {
        if(this.props.match.params.action === 'delete') {
            let headerTranslationId= this.getEventHeaderTranslationId()
            return (
                <div className="event-page">
                    <div className="container header">
                        <h1>
                            <FormattedMessage id={`${headerTranslationId}`} />
                        </h1>
                        { this.getActionButtons() }
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
