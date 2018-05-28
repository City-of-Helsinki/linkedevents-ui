import PropTypes from 'prop-types';
import React from 'react'
import HelCheckbox from 'src/components/HelFormFields/HelCheckbox.js'
import {FormattedMessage} from 'react-intl'

const DayCheckbox = ({day, onChange, defaultChecked}) => {
  const changePasser = (event, value) => {
    onChange(day, value)
  }
  return (
    <div className="col-xs-12 col-md-6">
      <div className="recurring-day">
        <HelCheckbox onChange={changePasser} defaultChecked={defaultChecked}/>
      </div>
      <FormattedMessage id={day} />
    </div>
  )
}

DayCheckbox.propTypes = {
  day: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default DayCheckbox;
