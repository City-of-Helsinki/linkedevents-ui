import React from 'react'
import HelTimePicker from 'src/components/HelFormFields/HelTimePicker.js'

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
	name: React.PropTypes.string.isRequired,
    time: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onBlur: React.PropTypes.func.isRequired
}

export default RecurringTimePicker;
