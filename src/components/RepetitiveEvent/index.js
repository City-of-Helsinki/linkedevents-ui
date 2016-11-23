import React from 'react'
import HelTextField from 'src/components/HelFormFields/HelTextField.js'
import HelTimePicker from 'src/components/HelFormFields/HelTimePicker.js'
import HelDatePicker from 'src/components/HelFormFields/HelDatePicker.js'
import HelCheckbox from 'src/components/HelFormFields/HelCheckbox.js'
import HelDateTimeField from 'src/components/HelFormFields/HelDateTimeField.js'

import DatePicker from 'react-datepicker/dist/react-datepicker.js'

import 'react-datepicker/dist/react-datepicker.css'
import 'src/components/HelFormFields/HelDatePicker.scss'

const RepetitiveEvent = React.createClass ({
    render: function () {
        return (
            <div className="recurring-events">

                <div className="multi-field">
                    <div className="row">
                        <div className="col-xs-12 col-md-6">
                            <HelDateTimeField ref="start_time" name="start_time" label="event-starting-datetime" />
                        </div>
                        <div className="col-xs-12 col-md-6">
                            <HelDateTimeField ref="end_time" name="end_time" label="event-ending-datetime" />
                        </div>
                    </div>
                    <div className="multi-field repeat-frequency">Toistetaan <HelTextField/> viikon välein</div>
                    <HelCheckbox/><HelCheckbox/>
                    Toistuminen alkaa <HelDateTimeField ref="start_time" name="start_time" label="event-starting-datetime"/>
                    Toistuminen päättyy <HelDateTimeField ref="end_time" name="end_time" label="event-ending-datetime" />
                </div>
            </div>
        )
    }
});

export default RepetitiveEvent;
