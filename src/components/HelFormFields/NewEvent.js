import React from 'react'
import HelDateTimeField from 'src/components/HelFormFields/HelDateTimeField.js'

const NewEvent = React.createClass ({
    render: function () {
        return (
            <div className="new-events">
                <div className="multi-field">
                    <div className="row">
                        <div className="col-xs-12 col-md-6">
                            <HelDateTimeField ref="start_time" name="start_time" label="event-starting-datetime" />
                        </div>
                        <div className="col-xs-12 col-md-6">
                            <HelDateTimeField ref="end_time" name="end_time" label="event-ending-datetime" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export default NewEvent;
