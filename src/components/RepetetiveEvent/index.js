import React from 'react'
import HelTextField from 'src/components/HelFormFields/HelTextField.js'
import HelTimePicker from 'src/components/HelFormFields/HelTimePicker.js'
import HelDatePicker from 'src/components/HelFormFields/HelDatePicker.js'
import HelCheckbox from 'src/components/HelFormFields/HelCheckbox.js'
import HelDateTimeField from 'src/components/HelFormFields/HelDateTimeField.js'

import DatePicker from 'react-datepicker/dist/react-datepicker.js'

import 'react-datepicker/dist/react-datepicker.css'
import 'src/components/HelFormFields/HelDatePicker.scss'


const RepetetiveEvent = React.createClass ({

  render: function () {
      return (
          <div className="multi-field">
	         <HelDateTimeField ref="start_time" name="start_time" label="event-starting-datetime" />
           <HelDateTimeField ref="end_time" name="end_time" label="event-ending-datetime" />
           <HelCheckbox/>

          </div>


      )
  }});
export default RepetetiveEvent;
