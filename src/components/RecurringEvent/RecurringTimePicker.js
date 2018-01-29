import PropTypes from 'prop-types';
import React from 'react'
import HelTimePicker from '../HelFormFields/HelTimePicker'

const RecurringTimePicker = ({name, time, onChange, onBlur}) => {
    const changePasser = (event, value) => {
        onChange(name, value)
    }
	return (
        <HelTimePicker
            name={name}
            defaultValue={time}
            placeholder="hh.mm"
            onChange={changePasser}
            onBlur={onBlur}
        />
	)
}

RecurringTimePicker.propTypes = {
	name: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
}

export default RecurringTimePicker;