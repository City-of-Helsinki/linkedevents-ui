import './HelTextField.scss'

import React from 'react'
import Input from 'react-bootstrap/lib/Input.js'
import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

import {injectIntl} from 'react-intl'

import validationRules from 'src/utils/validationRules.js';

let HelTextField = React.createClass({

    getInitialState: function() {
        let defaultValue = this.props.editor.values[this.props.name] || ''

        return {
            error: null,
            value: defaultValue || this.props.defaultValue || ''
        }
    },

    propTypes: {
        name: React.PropTypes.string
    },

    getValue: function() {
        return this.refs.text.getValue()
    },

    handleChange: function (event) {

        this.setState({
            value: this.refs.text.getValue()
        })

        this.recalculateHeight()

        if (this.state.error) {
            this.getValidationErrors()
        }

        if(typeof this.props.onChange === 'function') {
            this.props.onChange(event, this.refs.text.getValue())
        }
    },

    handleBlur: function (event) {
        if(this.props.name) {
            let obj = {}
            obj[this.props.name] = this.refs.text.getValue()
            this.props.dispatch(setData(obj))
        }

        this.getValidationErrors()

        if(typeof this.props.onBlur === 'function') {
            this.props.onBlur()
        }
    },

    componentDidMount: function() {
        this.getValidationErrors()
        this.recalculateHeight()
    },

    recalculateHeight: function() {
        if(this.props.multiLine) {
            this.refs.text.getInputDOMNode().style.height = 0;
            this.refs.text.getInputDOMNode().style.height = this.refs.text.getInputDOMNode().scrollHeight + 2 + 'px';
        }
    },

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
                this.setState({ error: this.props.intl.formatMessage({id: `validation-${validations[0].rule}` }) })
                return validations;
            }
        }

        // Else
        this.setState({ error: null })
        return [];
    },

    validationState() {
       return this.state.error ? 'warning' : 'success'
    },

    render: function () {
        let { required, label } = this.props

        if(required) {
            if(typeof label === 'string') {
                label += ' *'
            }
            if(typeof label === 'object') {
                label = (<span>{label} *</span>)
            }
        }

        let groupClassName = "hel-text-field"


        let type = ''
        if(this.props.type) {
            type = this.props.type
        } else {
            type = this.props.multiLine ? 'textarea' : 'text'
        }

        return (
            <Input
                {...this.props}
                type={type}
                value={this.state.value}
                label={label}
                // help="Validation is based on string length."
                bsStyle={this.validationState()}
                hasFeedback
                ref="text"
                groupClassName={groupClassName}
                labelClassName="hel-label"
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                name={this.props.name}
                rows="1"
                help={this.state.error}
            />
        )
    }
});

export default connect((state) => ({
    editor: state.editor
}), null, null, {withRef: true})(injectIntl(HelTextField))
