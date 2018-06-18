import './HelTextField.scss'

import PropTypes from 'prop-types';
import React from 'react'
import {FormControl, ControlLabel, HelpBlock} from 'react-bootstrap'
import {setData} from 'src/actions/editor.js'

import {injectIntl} from 'react-intl'

import validationRules from 'src/validation/validationRules';
import ValidationPopover from 'src/components/ValidationPopover'

import CONSTANTS from '../../constants'

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

    getStringLengthValidationText() {
        const {VALIDATION_RULES, CHARACTER_LIMIT} = CONSTANTS

        let isShortString = _.find(this.props.validations, i => i === VALIDATION_RULES.SHORT_STRING)
        let isMediumString = _.find(this.props.validations, i => i === VALIDATION_RULES.MEDIUM_STRING)
        let isLongString = _.find(this.props.validations, i => i === VALIDATION_RULES.LONG_STRING)
        
        let limit
        if (!this.state.error && (isShortString || isMediumString || isLongString)) {
            if(isShortString) {
                limit = CONSTANTS.CHARACTER_LIMIT.SHORT_STRING
            }
            else if(isMediumString) {
                limit = CONSTANTS.CHARACTER_LIMIT.MEDIUM_STRING
            } 
            else if(isLongString) {
                limit = CONSTANTS.CHARACTER_LIMIT.LONG_STRING
            }
            
            const diff =  limit - this.state.value.length.toString()
            
            if(diff >= 0) {
                return this.context.intl.formatMessage({id: 'validation-stringLengthCounter'}, {counter: diff})
            }
        }
        return this.state.error
    }

    getValue() {
        return this.inputRef.value
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(!(_.isEqual(nextProps.defaultValue, this.props.defaultValue))) {
            // Bootstrap or React textarea has a bug where null value gets interpreted
            // as uncontrolled, so no updates are done
            this.setState({value: nextProps.defaultValue ? nextProps.defaultValue : ''})
        }
        this.forceUpdate()
    }

    handleChange(event) {
        this.setState({
            value: this.inputRef.value,
        })

        this.recalculateHeight()
        this.setValidationErrorsToState()

        if(typeof this.props.onChange === 'function') {
            this.props.onChange(event, this.inputRef.value)
        }
    }

    helpText() {
        const {VALIDATION_RULES} = CONSTANTS

        let urlmsg = this.context.intl.formatMessage({id: 'validation-isUrl'})
        let isUrl = _.find(this.props.validations, i => i === VALIDATION_RULES.IS_URL)

        const stringLengthMessage = this.getStringLengthValidationText()
        if(stringLengthMessage) return stringLengthMessage
        else if (isUrl) {
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
            obj[this.props.name] = this.inputRef.value
            this.context.dispatch(setData(obj))
            if (this.props.setDirtyState) {
                this.props.setDirtyState()
            }
        }

        if(typeof this.props.onBlur === 'function') {
            this.props.onBlur(event, this.inputRef.value)
        }
    }

    componentDidMount() {
        this.setValidationErrorsToState()
        this.recalculateHeight()
    }

    recalculateHeight() {
        if(this.props.multiLine) {
            this.inputRef.height = this.inputRef.scrollHeight + 2 + 'px';
        }
    }

    getValidationErrors() {
        if(this.inputRef && this.inputRef.value && this.props.validations && this.props.validations.length) {
            let validations = this.props.validations.map(item => {
                if(typeof validationRules[item] === 'function') {
                    return {
                        rule: item,
                        passed: validationRules[item](null, this.inputRef.value),
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
        const {VALIDATION_RULES, CHARACTER_LIMIT} = CONSTANTS

        let errors = this.getValidationErrors()

        if(errors.length > 0) {
            let limit

            switch (errors[0].rule) {
                case VALIDATION_RULES.SHORT_STRING:
                    limit = CHARACTER_LIMIT.SHORT_STRING
                    break;
                case VALIDATION_RULES.MEDIUM_STRING:
                    limit = CHARACTER_LIMIT.MEDIUM_STRING
                    break;
                case VALIDATION_RULES.LONG_STRING:
                    limit = CHARACTER_LIMIT.LONG_STRING
                    break;
            }
            
            return limit ? this.setState({error: this.context.intl.formatMessage({id: `validation-stringLimitReached`}, {limit})}) :
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

        label = (<span style={{position: 'relative'}}>{label} {requiredElem} <ValidationPopover small={true} validationErrors={this.props.validationErrors} index={this.props.index} /></span>)

        let groupClassName = 'hel-text-field'
        if(this.props.disabled) {
            groupClassName += ' disabled'
        }

        // If no type is given it's either textarea or text
        let type = ''
        if(this.props.type) {
            type = this.props.type
        } else {
            type = this.props.multiLine ? 'textarea' : 'input'
        }

        return (
            <span style={{position: 'relative'}}>
                <div className={groupClassName}>
                    <ControlLabel className="hel-label relative">{label}</ControlLabel>
                    <FormControl
                        componentClass={type}
                        value={this.state.value}
                        placeholder={this.props.placeholder}
                        inputRef={ref => this.inputRef = ref}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        name={this.props.name}
                        rows="1"
                        disabled={this.props.disabled}
                    />
                    <HelpBlock>{this.helpText()}</HelpBlock>
                </div>
            </span>
        )
    }
}

HelTextField.propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
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
    validationErrors: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    index: PropTypes.string,
    disabled: PropTypes.bool,
    type: PropTypes.string,
}

export default HelTextField
