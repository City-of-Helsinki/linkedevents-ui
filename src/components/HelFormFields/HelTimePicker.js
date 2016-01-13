import React from 'react'
import Formsy from 'formsy-react'
import TimePicker from 'material-ui/lib/time-picker'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

let HelTimePicker = React.createClass({
    mixins: [ Formsy.Mixin ],

    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    handleChange: function (event, time) {
        let obj = {}
        obj[this.props.name] = time.toISOString()

        this.props.dispatch(setData(obj))

        if(typeof this.props.onChange === 'function') {
            this.props.onChange()
        }
    },

    handleBlur: function (event) {
        //this.setValue(event.currentTarget.value)

        if(typeof this.props.onBlur === 'function') {
            this.props.onBlur()
        }
    },

    componentWillMount: function() {
        let defaultValue = this.props.editor.values[this.props.name] || ''
        if(defaultValue && defaultValue.length > 0) {
            this.setValue(defaultValue)
        }
    },

    shouldComponentUpdate: function(newState, newProps) {
        return true
    },

    render: function () {
        let { required, floatingLabelText } = this.props

        if(required) {
            if(typeof floatingLabelText === 'string') {
                floatingLabelText += ' *'
            }
            if(typeof floatingLabelText === 'object') {
                floatingLabelText = (<span>{floatingLabelText} *</span>)
            }
        }

        // Check if this text field should be prefilled from local storage
        let defaultValue = this.props.editor.values[this.props.name] || new Date()

        let DateTimeFormat = function(settings) {
            return new Intl.DateTimeFormat(Object.assign({}, settings, {timeZone:'Europe/Helsinki'}))
        }

        return (
            <TimePicker DateTimeFormat={DateTimeFormat} locale="fi" defaultTime={new Date(defaultValue)} onChange={this.handleChange} onBlur={this.handleBlur} {...this.props}  />
        )
    }
});

export default connect((state) => ({
    editor: state.editor
}))(HelTimePicker)
