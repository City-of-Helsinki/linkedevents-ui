import './HelTextField.scss'

import React from 'react'
import Input from 'react-bootstrap/lib/Input.js'
import {setData} from 'src/actions/editor.js'

import {injectIntl} from 'react-intl'

import validationRules from 'src/validation/validationRules.js';
import ValidationPopover from 'src/components/ValidationPopover'

let HelTextField = React.createClass({

    getInitialState: function() {
        return {
            error: null,
            value: this.props.defaultValue || ''
        }
    },

    propTypes: {
        name: React.PropTypes.string,
        placeholder: React.PropTypes.string
    },

    contextTypes: {
        intl: React.PropTypes.object,
        dispatch: React.PropTypes.func
    },

    getValue: function() {
        return this.refs.text.getValue()
    },

    componentWillReceiveProps: function(nextProps) {
        if(!(_.isEqual(nextProps.defaultValue, this.props.defaultValue))) {
            // Bootstrap or React textarea has a bug where null value gets interpreted
            // as uncontrolled, so no updates are done
            this.setState({value: nextProps.defaultValue ? nextProps.defaultValue : '' })
        }
        this.forceUpdate()
    },

    handleChange: function (event) {
        this.setState({
            value: this.refs.text.getValue()
        })

        this.recalculateHeight()

        let isTime = _.findIndex(this.props.validations, i => i === "isTime") !== -1;
        if (isTime === false){
            this.setValidationErrorsToState()
        }

        if(typeof this.props.onChange === 'function') {
            this.props.onChange(event, this.refs.text.getValue())
        }
    },

    helpText: function() {
        let isShortString = _.findIndex(this.props.validations, i => i === "shortString") !== -1;
        let isLongString = _.findIndex(this.props.validations, i => i === "longString") !== -1;
        let isTime = _.findIndex(this.props.validations, i => i === "isTime") !== -1;
        if (isShortString === true) {
            let msg = this.context.intl.formatMessage({id: 'validation-stringLengthCounter' })
            return !this.state.error && isShortString
                ? '' + (160 - this.state.value.length.toString()) + msg
                : this.state.error
        } else if (isLongString === true) {
            let longmsg = this.context.intl.formatMessage({id: 'validation-longStringLengthCounter' })
            return !this.state.error && isLongString
                ? '' + (this.state.value.length.toString()) + longmsg
                : this.state.error
        } else if (isTime === true) {
            let timemsg = this.context.intl.formatMessage({id: 'validation-isTime' })
            return this.state.error
                ? timemsg
                : ''
        }
    },
    handleBlur: function (event) {
        let isTime = _.findIndex(this.props.validations, i => i === "isTime") !== -1;
        if (isTime === true) {  //Time field error is shown only after blur
            this.setValidationErrorsToState()
        }

        // Apply changes to store if no validation errors, or the props 'forceApplyToStore' is defined
        if( this.props.name && this.getValidationErrors().length === 0 &&
            !this.props.name.includes('time') ||
            this.props.name && this.props.forceApplyToStore) {
            let obj = {}
            obj[this.props.name] = this.refs.text.getValue()
            this.context.dispatch(setData(obj))
            if (this.props.setDirtyState) {
                this.props.setDirtyState()
            }
        }

        if(typeof this.props.onBlur === 'function') {
            this.props.onBlur(event, this.refs.text.getValue())
        }
    },

    componentDidMount: function() {
        this.setValidationErrorsToState()
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
                return validations;
            }
        }

        return []
    },

    componentDidUpdate: function() {
        this.recalculateHeight()
    },

    setValidationErrorsToState: function() {
        let errors = this.getValidationErrors()
        if(errors.length > 0) {
            this.setState({ error: this.context.intl.formatMessage({id: `validation-${errors[0].rule}` }) })
        }
        else {
            this.setState({ error: null })
        }
    },

    noValidationErrors() {
       let errors = this.getValidationErrors()
       return (errors.length === 0)
    },

    validationState() {
       return this.state.error ? 'warning' : 'success'
    },

    render: function () {
        let { required, label } = this.props
        let requiredElem = null
        if(required) {
            requiredElem = (<span>*</span>)
        }

        label = (<span style={{position: 'relative'}}>{label} {requiredElem} <ValidationPopover small validationErrors={this.props.validationErrors} index={this.props.index} /></span>)

        let groupClassName = 'hel-text-field'
        if(this.props.disabled) {
            groupClassName += ' disabled'
        }

        // If no type is given it's either textarea or text
        let type = ''
        if(this.props.type) {
            type = this.props.type
        } else {
            type = this.props.multiLine ? 'textarea' : 'text'
        }

        return (
            <span style={{position: 'relative'}}>
            <Input
                type={type}
                value={this.state.value}
                label={label}
                placeholder={this.props.placeholder}
                // help="Validation is based on string length."
                // bsStyle={this.validationState()} // TODO: Check glyph styling, now it shows success for empty values
                hasFeedback
                ref="text"
                groupClassName={groupClassName}
                labelClassName="hel-label relative"
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                name={this.props.name}
                rows="1"
                help={this.helpText()}
                disabled={this.props.disabled}
            />
            </span>
        )
    }
});

export default HelTextField
