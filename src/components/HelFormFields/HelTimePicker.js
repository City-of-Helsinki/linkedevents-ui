import PropTypes from 'prop-types';
import React from 'react'
import HelTextField from './HelTextField.js'

import {connect} from 'react-redux'

import moment from 'moment'

class HelTimePicker extends React.Component {

    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
    }
    static propTypes = {
        name: PropTypes.string.isRequired,
        onBlur: PropTypes.func.isRequired,
        defaultValue: PropTypes.string,
        onChange: PropTypes.func,
    }

    handleChange(event, time) {
        this.props.onChange('time', time)
    }

    handleBlur () {
        this.props.onBlur()
    }

    render() {
        return (
            <HelTextField
                validations={['isTime']}
                placeholder='hh.mm'
                name={this.props.name}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                defaultValue={this.props.defaultValue}
            />
        )
    }
}

export default connect((state) => ({
    editor: state.editor,
}))(HelTimePicker)
