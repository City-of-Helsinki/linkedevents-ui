import React from 'react'
import Formsy from 'formsy-react'
import {DatePicker} from 'material-ui/lib/date-picker'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

let HelDatePicker = React.createClass({
    mixins: [ Formsy.Mixin ],

    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    handleChange: function (event, date) {
        let obj = {}
        obj[this.props.name] = date.toISOString()

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

    handleEnterKeyDown: function (event) {
        //this.setValue(event.currentTarget.value)
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
            <DatePicker DateTimeFormat={DateTimeFormat} locale="fi" defaultDate={new Date(defaultValue)} {...this.props} onChange={this.handleChange} onBlur={this.handleBlur} onEnterKeyDown={this.handleEnterKeyDown} />
        )
    }
});

export default connect((state) => ({
    editor: state.editor
}))(HelDatePicker)
