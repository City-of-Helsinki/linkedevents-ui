import React from 'react'
import Formsy from 'formsy-react'
import TextField from 'material-ui/lib/text-field'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

import validationRules from 'formsy-react/src/validationRules.js';

let HelTextField = React.createClass({

    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    handleChange: function (event,value) {
        if(typeof this.props.onChange === 'function') {
            this.props.onChange(event,value)
        }
    },

    handleBlur: function (event) {
        //this.setValue(event.currentTarget.value)

        let obj = {}
        obj[this.props.name] = event.currentTarget.value

        this.props.dispatch(setData(obj))

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
            //this.setValue(defaultValue)
        }
    },

    getValidationErrors: function() {
        return null
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
        let defaultValue = this.props.editor.values[this.props.name] || ''

        return (
          <TextField
            {...this.props}
            floatingLabelText={floatingLabelText}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onEnterKeyDown={this.handleEnterKeyDown}
            errorText={this.getValidationErrors()}
            defaultValue={defaultValue}
            />
        )
    }
});

export default connect((state) => ({
    editor: state.editor
}))(HelTextField)
