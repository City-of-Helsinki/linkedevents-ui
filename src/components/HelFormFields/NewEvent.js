import React from 'react'
import HelDateTimeField from 'src/components/HelFormFields/HelDateTimeField.js'
import './NewEvent.scss'
import { RaisedButton } from 'material-ui'
import {connect} from 'react-redux'
import { deleteSubEvent } from 'src/actions/editor.js'

class NewEvent extends React.Component {
    static contextTypes = {
        dispatch: React.PropTypes.func
    };

    deleteSubEvent() {
        this.context.dispatch(deleteSubEvent(this.props.eventKey))
    }
    render() {
        const buttonStyles = {
            width: "42px",
            minWidth: "42px",
            height: "36px",
            position: "absolute",
            left: "-30px",
            top: "25px"
        }
        return (
            <div className="new-events">
                <div className="multi-field">
                    <div className="row liner">
                        <div className="col-xs-12 col-md-6">
                            <HelDateTimeField
                                ref="start_time"
                                name="start_time"
                                label="event-starting-datetime"
                                defaultValue={this.props.event.start_time}
                                eventKey={this.props.eventKey}
                                validationErrors={this.props.validationErrors['start_time']}
                            />
                        </div>
                        <div className="col-xs-12 col-md-6">
                            <HelDateTimeField
                                ref="end_time"
                                name="end_time"
                                label="event-ending-datetime"
                                defaultValue={this.props.event.end_time}
                                eventKey={this.props.eventKey}
                                validationErrors={this.props.validationErrors['end_time']}
                            />
                        </div>
                        <RaisedButton
                            onClick={() => this.deleteSubEvent()}
                            style={buttonStyles}
                            label={<span className="center-delete"><i className="material-icons">delete</i></span>}
                        />
                    </div>
                </div>
            </div>
        )
    }
};

NewEvent.propTypes = {
    event: React.PropTypes.object.isRequired,
    eventKey: React.PropTypes.string.isRequired
}

export default NewEvent;
