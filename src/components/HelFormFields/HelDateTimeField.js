import PropTypes from 'prop-types';
import React from 'react'
import moment from 'moment'

import HelDatePicker from './HelDatePicker'
import HelTimePicker from './HelTimePicker'

import {FormattedMessage} from 'react-intl'
import {connect} from 'react-redux'
import {setData, updateSubEvent} from 'src/actions/editor'

import validationRules from 'src/validation/validationRules';
import ValidationPopover from 'src/components/ValidationPopover'

import CONSTANTS from '../../constants'

class HelDateTimeField extends React.Component {
    constructor(props) {
        super(props)
        
        let defaultValue = this.props.defaultValue || null
        if(moment(defaultValue).isValid()) {
            defaultValue = moment(defaultValue).tz('Europe/Helsinki');
            this.state = {
                date: defaultValue,
                time: defaultValue.format('HH.mm'),
            }
        } else {
            this.state = {
                date: null,
                time: null,
            }
        }

        this.onChange = this.onChange.bind(this)
        this.onBlur = this.onBlur.bind(this)
    }

    onChange(type, value) {
        this.setState({
            [type]: value,
        })
    }

    onBlur(type, value) {

        if(this.state.date && this.state.time) {
            const date = moment.tz(this.state.date, 'Europe/Helsinki').format('YYYY-MM-DD')
            const time = this.state.time
            let errors = [
                this.getValidationErrors(CONSTANTS.VALIDATION_RULES.IS_TIME, time),
                this.getValidationErrors(CONSTANTS.VALIDATION_RULES.IS_DATE, date),
            ]

            // Filter out empty lists
            let actualErrors = errors.filter(list => (list.length > 0))
            // If no validation errors, format datetime
            if(actualErrors.length === 0) {
                let datetime = this.getDateTimeFromFields(date, time)
                if(datetime) {
                    let obj = {}
                    obj[this.props.name] = datetime
                    if(this.props.eventKey){
                        this.context.dispatch(updateSubEvent(datetime, this.props.name, this.props.eventKey))
                    } else {
                        this.context.dispatch(setData(obj))
                    }

                    if (this.props.setDirtyState) {
                        this.props.setDirtyState()
                    }
                }
            }
        }
    }

    getDateTimeFromFields(date, time) {
        if(!date || !time) {
            return undefined
        }
        let newTime;
        if(time) {
            newTime = moment.tz(time, 'H.mm', 'Europe/Helsinki').format('HH:mm')
            if(time.lastIndexOf('24', 0) === 0) {
                // User gave time which begins with '24'. Moment formats that to 00:00 so we'll have to change it back to 24
                // Otherwise date would be rolled back one day.
                newTime = '24' + newTime.substring(2)
            }
        }

        let newDateTime = date + 'T' + newTime;
        const dateTime = moment.tz(newDateTime, 'Europe/Helsinki').utc().toISOString()
        return dateTime;
    }

    // Parses date time object from datetime string
    parseValueFromString(string) {
        let newValue = string || null

        if(moment(newValue).isValid()) {
            newValue = moment(newValue).tz('Europe/Helsinki');
            return {
                date: newValue,
                time: newValue.format('H.mm'),
            }
        } else {
            return {
                date: null,
                time: null,
            }
        }
    }

    getValidationErrors(type, value) {
        if(value && type) {
            let validations;
            if(typeof validationRules[type] === 'function') {
                validations =  [{
                    rule: type,
                    passed: validationRules[type](null, value),
                }]
            }
            validations = validations.filter(i => (i.passed === false))
            if(validations.length) {
                return validations;
            }
        }

        return []
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(! _.isEqual(nextProps.defaultValue, this.props.defaultValue)) {
            if (moment(nextProps.defaultValue).isValid()) {
                const value = this.parseValueFromString(nextProps.defaultValue)
                this.setState({date: value.date, time: value.time})
            }
        }
    }

    // Update only if the state has changed
    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    render () {
        return (
            <div className="multi-field">
                <div className="indented">
                    <label style={{position: 'relative'}}><FormattedMessage id={`${this.props.label}`} /> <ValidationPopover validationErrors={this.props.validationErrors} /></label>
                    <HelDatePicker ref="date" name={this.props.name} defaultValue={this.state.date} validations={[CONSTANTS.VALIDATION_RULES.IS_DATE]} placeholder="pp.kk.vvvv" onChange={this.onChange} onBlur={this.onBlur} label={<FormattedMessage id="date" />} />
                    <HelTimePicker ref="time" name={this.props.name} defaultValue={this.state.time} validations={[CONSTANTS.VALIDATION_RULES.IS_TIME]} placeholder="hh.mm" onChange={this.onChange} onBlur={this.onBlur} label={<FormattedMessage id="time" />} />
                </div>
            </div>
        )
    }
}

HelDateTimeField.propTypes = {
    name: PropTypes.string.isRequired,
    eventKey: PropTypes.string,
    defaultValue: PropTypes.string,
    setDirtyState: PropTypes.func,
    label: PropTypes.string,
    validationErrors: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
}

HelDateTimeField.contextTypes = {
    intl: PropTypes.object,
    dispatch: PropTypes.func,
}
export default HelDateTimeField
