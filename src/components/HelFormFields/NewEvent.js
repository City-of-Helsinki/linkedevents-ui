import PropTypes from 'prop-types';
import React from 'react'
import HelDateTimeField from '../HelFormFields/HelDateTimeField'
import './NewEvent.scss'
import {connect} from 'react-redux'
import {deleteSubEvent} from 'src/actions/editor.js'
import {Button} from '@material-ui/core'
import {Delete} from '@material-ui/icons'
class NewEvent extends React.Component {
    static contextTypes = {
        dispatch: PropTypes.func,
    };

    deleteSubEvent() {
        this.context.dispatch(deleteSubEvent(this.props.eventKey))
    }
    render() {
        const {eventKey, errors} = this.props;
        const buttonStyles = {
            width: '42px',
            minWidth: '42px',
            height: 'auto',
            position: 'absolute',
            left: '-55px',
            top: '2rem',
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
                                eventKey={eventKey}
                                validationErrors={errors['start_time']}
                            />
                        </div>
                        <div className="col-xs-12 col-md-6">
                            <HelDateTimeField
                                ref="end_time"
                                name="end_time"
                                label="event-ending-datetime"
                                defaultValue={this.props.event.end_time}
                                eventKey={eventKey}
                                validationErrors={errors['end_time']}
                            />
                        </div>
                        <Button
                            color="secondary"
                            variant="contained"
                            style={buttonStyles}
                            onClick={() => this.deleteSubEvent()}
                        >
                            <Delete/>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

NewEvent.propTypes = {
    event: PropTypes.object.isRequired,
    eventKey: PropTypes.string.isRequired,
    errors: PropTypes.object,
}

export default NewEvent;
