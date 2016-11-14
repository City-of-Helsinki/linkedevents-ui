import React from 'react'
import HelTextField from './HelTextField.js'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

import moment from 'moment'

let HelTimePicker = React.createClass({

    getInitialState: function() {
        let defaultValue = this.props.editor.values[this.props.name] || null

        if(defaultValue) {
            defaultValue = moment(defaultValue).tz('Europe/Helsinki').format('HH.mm');
        }

        return {
            value: defaultValue || null
        }
    },

    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    handleChange: function (event, value) {
        let time = moment.tz(value, 'Europe/Helsinki').utc().format();

        let obj = {}
        obj[this.props.name] = time;

        this.props.dispatch(setData(obj))

        if(typeof this.props.onChange === 'function') {
            this.props.onChange(event, value)
        }
    },

    handleBlur: function (event, value) {
        if(typeof this.props.onBlur === 'function') {
            this.props.onBlur(event, value)
        }
    },

    render: function () {
        return (
            <HelTextField validations={['isTime']} placeholder='hh:mm' name={this.props.name} onChange={this.handleChange} />
        )
    }
});

export default connect((state) => ({
    editor: state.editor
}))(HelTimePicker)
