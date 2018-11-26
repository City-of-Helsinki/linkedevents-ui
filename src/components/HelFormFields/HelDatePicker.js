import PropTypes from 'prop-types';
import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './HelDatePicker.scss'

class HelDatePicker extends React.Component {
    handleChange = (date) => {
        this.props.onChange('date', date)
    }

    handleBlur = () => {
        if(typeof this.props.onBlur === 'function') {
            this.props.onBlur()
        }
    }

    render() {
        return (
            <div className='hel-text-field'>
                <DatePicker
                    placeholderText={this.props.placeholder}
                    selected={this.props.defaultValue}
                    autoOk={true}
                    name={this.props.name}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    locale="fi"
                />
            </div>

        )
    }
}

HelDatePicker.propTypes = {
    defaultValue: PropTypes.object,
    name: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
}

export default HelDatePicker
