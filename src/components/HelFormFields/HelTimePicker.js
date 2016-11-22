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
        name: React.PropTypes.string.isRequired,
        onBlur: React.PropTypes.func.isRequired
    },

    handleChange: function(event, time) {
        this.setState({
            value: {
                time: time
            }
        });
    },

    handleBlur: function () {
        this.props.onBlur(this.state.value.time)
    },

    render: function () {
        return (
            <HelTextField validations={['isTime']} placeholder='hh:mm' name={this.props.name} onChange={this.handleChange} onBlur={this.handleBlur} />
        )
    }
});

export default connect((state) => ({
    editor: state.editor
}))(HelTimePicker)
