import './HelTextField.scss'

import PropTypes from 'prop-types';

import React from 'react'
import {FormControl} from 'react-bootstrap'
import {setData} from 'src/actions/editor.js'

import {injectIntl} from 'react-intl'

import validationRules from 'src/validation/validationRules.js';
import ValidationPopover from 'src/components/ValidationPopover'

class HelTextField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            value: this.props.defaultValue || '',
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
    }

    static contextTypes = {
        intl: PropTypes.object,
        dispatch: PropTypes.func,
    }

    getValue() {
        return this.refs.text.getValue()
    }

    componentWillReceiveProps(nextProps) {
        if(!(_.isEqual(nextProps.defaultValue, this.props.defaultValue))) {
            // Bootstrap or React textarea has a bug where null value gets interpreted
            // as uncontrolled, so no updates are done
            this.setState({value: nextProps.defaultValue ? nextProps.defaultValue : ''})
        }
        this.forceUpdate()
    }

    handleChange(event) {
        this.setState({
            value: this.refs.text.getValue(),
        })

        this.recalculateHeight()
        this.setValidationErrorsToState()

        if(typeof this.props.onChange === 'function') {
            this.props.onChange(event, this.refs.text.getValue())
        }
    }

    helpText() {
        let msg = this.context.intl.formatMessage({id: 'validation-stringLengthCounter'})
        let longmsg = this.context.intl.formatMessage({id: 'validation-longStringLengthCounter'})
        let isShortString = _.findIndex(this.props.validations, i => i === 'shortString') !== -1;
        let isLongString = _.findIndex(this.props.validations, i => i === 'longString') !== -1;
        let isUrl = _.findIndex(this.props.validations, i => i === 'isUrl') !== -1;
        if (isShortString === true) {
            return !this.state.error && isShortString
                ? '' + (160 - this.state.value.length.toString()) + msg
                : this.state.error
        } else if (isLongString === true) {
            return !this.state.error && isLongString
                ? '' + (this.state.value.length.toString()) + longmsg
                : this.state.error
        } else if (isUrl === true) {
            let urlmsg = this.context.intl.formatMessage({id: 'validation-isUrl'})
            return this.state.error
                ? urlmsg
                : this.state.error
        }
    }
    handleBlur(event) {
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
    }

    componentDidMount() {
        this.setValidationErrorsToState()
        this.recalculateHeight()
    }

    recalculateHeight() {
        if(this.props.multiLine) {
            this.refs.text.getInputDOMNode().style.height = 0;
            this.refs.text.getInputDOMNode().style.height = this.refs.text.getInputDOMNode().scrollHeight + 2 + 'px';
        }
    }

    getValidationErrors() {
        if(this.refs.text && this.refs.text.getValue() && this.props.validations && this.props.validations.length) {
            let validations = this.props.validations.map(item => {
                if(typeof validationRules[item] === 'function') {
                    return {
                        rule: item,
                        passed: validationRules[item](null, this.refs.text.getValue()),
                    }
                } else {
                    return {
                        rule: item,
                        passed: true,
                    }
                }
            })

            validations = validations.filter(i => (i.passed === false))

            if(validations.length) {
                return validations;
            }
        }

        return []
    }

    componentDidUpdate() {
        this.recalculateHeight()
    }

    setValidationErrorsToState() {
        let errors = this.getValidationErrors()
        if(errors.length > 0) {
            this.setState({error: this.context.intl.formatMessage({id: `validation-${errors[0].rule}`})})
        }
        else {
            this.setState({error: null})
        }
    }

    noValidationErrors() {
        let errors = this.getValidationErrors()
        return (errors.length === 0)
    }

    validationState() {
        return this.state.error ? 'warning' : 'success'
    }

    render () {
        let {required, label} = this.props
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
                <FormControl
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
}

HelTextField.propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    validations: PropTypes.array,
    forceApplyToStore: PropTypes.bool,
    setDirtyState: PropTypes.func,
    onBlur: PropTypes.func,
    multiLine: PropTypes.bool,
    required: PropTypes.bool,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    validationErrors: PropTypes.array,
    index: PropTypes.number,
    disabled: PropTypes.bool,
    type: PropTypes.string,
}

export default HelTextField
