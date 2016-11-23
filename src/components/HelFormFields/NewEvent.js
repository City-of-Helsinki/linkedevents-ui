import React from 'react'
import HelDateTimeField from 'src/components/HelFormFields/HelDateTimeField.js'

const NewEvent = React.createClass ({
    render: function () {
        return (
            <div className="new-events">
                <div className="multi-field">
                    <div className="row">
                        <div className="col-xs-12 col-md-6">
                            <HelDateTimeField
                                ref="start_time"
                                name="start_time"
                                label="event-starting-datetime"
                                defaultValue={this.props.event.start_time}
                                eventKey={this.props.eventKey}
                            />
                        </div>
                        <div className="col-xs-12 col-md-6">
                            <HelDateTimeField
                                ref="end_time"
                                name="end_time"
                                label="event-ending-datetime"
                                defaultValue={this.props.event.end_time}
                                eventKey={this.props.eventKey}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

NewEvent.propTypes = {
    event: React.PropTypes.object.isRequired,
    eventKey: React.PropTypes.string.isRequired
}

export default NewEvent;
