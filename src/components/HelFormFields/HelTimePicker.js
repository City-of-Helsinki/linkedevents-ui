import PropTypes from 'prop-types';
import React from 'react'
import HelTextField from './HelTextField.js'

import {connect} from 'react-redux'

import moment from 'moment'

let HelTimePicker = React.createClass({

    propTypes: {
        name: PropTypes.string.isRequired,
        onBlur: PropTypes.func.isRequired
    },

    handleChange: function(event, time) {
        this.props.onChange('time', time)
    },

    handleBlur: function () {
        this.props.onBlur()
    },

    render: function () {
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
});

export default connect((state) => ({
    editor: state.editor
}))(HelTimePicker)