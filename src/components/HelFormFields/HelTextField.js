import React from 'react'
import Formsy from 'formsy-react'
import TextField from 'material-ui/lib/text-field'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

import {injectIntl} from 'react-intl'

import validationRules from 'formsy-react/src/validationRules.js';

let HelTextField = React.createClass({

    getInitialState: function() {
        return {
            error: null
        }
    },

    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    handleChange: function (event) {
        if (this.state.error) {
            this.getValidationErrors()
        }

        if(typeof this.props.onChange === 'function') {
            this.props.onChange(event, event.currentTarget.value)
        }
    },

    handleBlur: function (event) {
        let obj = {}
        obj[this.props.name] = event.currentTarget.value

        this.props.dispatch(setData(obj))

        this.getValidationErrors()

        if(typeof this.props.onBlur === 'function') {
            this.props.onBlur()
        }
    },

    handleEnterKeyDown: function (event) {

    },

    componentDidMount: function() {
        this.getValidationErrors()
    },

    // TODO: make into a mixin
    getValidationErrors: function() {
        if(this.refs.text && this.refs.text.getValue() && this.props.validations && this.props.validations.length) {
            let validations = this.props.validations.map(item => {
                if(typeof validationRules[item] === 'function') {
                    return {
                        rule: item,
                        passed: validationRules[item](null, this.refs.text.getValue())
                    }
                } else {
                    return {
                        rule: item,
                        passed: true
                    }
                }
            })

            validations = validations.filter(i => (i.passed === false))

            if(validations.length) {
                return this.setState({ error: this.props.intl.formatMessage({id: `validation-${validations[0].rule}` }) })
            }
        }

        // Else
        return this.setState({ error: null })
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
            ref="text"
            floatingLabelText={floatingLabelText}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onEnterKeyDown={this.handleEnterKeyDown}
            errorText={this.state.error}
            defaultValue={defaultValue}
            />
        )
    }
});

export default connect((state) => ({
    editor: state.editor
}))(injectIntl(HelTextField))
