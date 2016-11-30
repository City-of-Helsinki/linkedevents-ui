import React from 'react'
import HelTextField from 'src/components/HelFormFields/HelTextField.js'
import HelTimePicker from 'src/components/HelFormFields/HelTimePicker.js'
import HelDatePicker from 'src/components/HelFormFields/HelDatePicker.js'
import HelCheckbox from 'src/components/HelFormFields/HelCheckbox.js'
import HelDateTimeField from 'src/components/HelFormFields/HelDateTimeField.js'

import DatePicker from 'react-datepicker/dist/react-datepicker.js'

import 'react-datepicker/dist/react-datepicker.css'
import 'src/components/HelFormFields/HelDatePicker.scss'
import './RecurringEvent.scss'

const RecurringEvent = React.createClass ({
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
                    <div className="multi-field repeat-frequency">Toistetaan <div className="" style={{maxWidth: "40px", display: 'inline-block'}}><HelTextField/></div> viikon välein</div>
                    <div className="col-xs-6"><div className="reoccurring-day"><HelCheckbox/></div> maanantai</div>
                    <div className="col-xs-6"><div className="reoccurring-day"><HelCheckbox/></div> tiistai</div>
                    <div className="col-xs-6"><div className="reoccurring-day"><HelCheckbox/></div> keskiviikko</div>
                    <div className="col-xs-6"><div className="reoccurring-day"><HelCheckbox/></div> torstai</div>
                    <div className="col-xs-6"><div className="reoccurring-day"><HelCheckbox/></div> perjantai</div>
                    <div className="col-xs-6"><div className="reoccurring-day"><HelCheckbox/></div> lauantai</div>
                    <div className="col-xs-6"><div className="reoccurring-day"><HelCheckbox/></div> sunnuntai</div>
                    <div className="col-xs-12">
                        Toistuminen alkaa <HelDateTimeField ref="start_time" name="start_time" label="event-starting-datetime"/>
                        Toistuminen päättyy <HelDateTimeField ref="end_time" name="end_time" label="event-ending-datetime" />
                    </div>
                </div>
            </div>
        )
    }
});

export default RecurringEvent;
