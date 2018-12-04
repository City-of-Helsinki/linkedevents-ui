import PropTypes from 'prop-types';
import React from 'react'
import HelTextField from './HelTextField.js'

import CONSTANTS from '../../constants'

class HelTimePicker extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        onBlur: PropTypes.func.isRequired,
        defaultValue: PropTypes.string,
        onChange: PropTypes.func,
    }

    handleChange = (event, time) => {
        this.props.onChange('time', time)
    }

    handleBlur = () => {
        this.props.onBlur()
    }

    render() {
        return (
            <HelTextField
                validations={[CONSTANTS.VALIDATION_RULES.IS_TIME]}
                placeholder='hh.mm'
                name={this.props.name}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                defaultValue={this.props.defaultValue}
            />
        )
    }
}

export default HelTimePicker
