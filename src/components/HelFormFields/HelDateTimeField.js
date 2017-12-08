import React from 'react'
import HelTextField from './HelTextField.js'
import HelDatePicker from './HelDatePicker.js'
import HelTimePicker from './HelTimePicker.js'


import {connect} from 'react-redux'
import {setData, updateSubEvent} from 'src/actions/editor.js'

import { FormattedMessage } from 'react-intl'

import validationRules from 'src/validation/validationRules.js';
import ValidationPopover from 'src/components/ValidationPopover'

import moment from 'moment'

const HelDateTimeField = React.createClass({

    getInitialState: function() {
        let defaultValue = this.props.defaultValue || null
        if(moment(defaultValue).isValid()) {
            defaultValue = moment(defaultValue).tz('Europe/Helsinki');
            return {
                date: defaultValue,
                time: defaultValue.format('HH.mm')
            }
        }

        return {
            date: null,
            time: null
        }
    },

    propTypes: {
        name: React.PropTypes.string.isRequired,
        eventKey: React.PropTypes.string
    },

    contextTypes: {
        intl: React.PropTypes.object,
        dispatch: React.PropTypes.func
    },

    onChange: function(type, value) {
        this.setState({
            [type]: value
        })
    },

    onBlur: function(type, value) {
        if(this.state.date || this.state.time) {
            const date = moment.tz(this.state.date, 'Europe/Helsinki').format('YYYY-MM-DD')
            const time = this.state.time

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
    },

    getDateTimeFromFields: function(date, time) {
        if(!date) {
            return undefined
        }
        let newTime
        let newDateTime = date
        let invalidTimeProvided = false
        if(time) {
            newTime = moment.tz(time, 'H.mm', 'Europe/Helsinki').format('HH:mm')
            if (newTime == 'Invalid date'){
                invalidTimeProvided = true
            } else if(time.lastIndexOf('24', 0) === 0) {
                // User gave time which begins with '24'. Moment formats that to 00:00 so we'll have to change it back to 24
                // Otherwise date would be rolled back one day.
                newTime = '24' + newTime.substring(2)
                newDateTime = date + 'T' + newTime
            } else {
                newDateTime = newDateTime + 'T' + time
            }
        }
        else {
            newDateTime = date
        }

        if (invalidTimeProvided == false) {
            if(!time){
                // datetime has to be rolled one day forward if we don't have time provided. Otherwise date will be 1 day less than user supplied.
                newDateTime = moment(newDateTime).add(1, 'days')
            }
            newDateTime = moment.tz(newDateTime, 'Europe/Helsinki').utc().toISOString()
            // If time was not given on time field, remove time part (begins with character 'T') from the formatted dateTime.
            if(!time){
                newDateTime = newDateTime.substring(0, newDateTime.indexOf( "T" ))
            }
        } else {
            // Invalid time provided by user. We'll include the invalid value to output so we'll get the correct validation errors.
            newDateTime = moment.tz(date, 'Europe/Helsinki').utc().toISOString()
            newDateTime = newDateTime.substring(0, newDateTime.indexOf( "T" ))
            newDateTime = newDateTime + 'T' + time
        }

        return newDateTime;
    },

    // Parses date time object from datetime string
    parseValueFromString: function(string) {
        let newValue = string || null

        if(moment(newValue).isValid()) {
            newValue = moment(newValue).tz('Europe/Helsinki');

            let newValueTimePortion = null
            //Check if time portion is supplied
            if (string.length>10) {
                newValueTimePortion = newValue.format('H.mm')
            }

            return {
                date: newValue,
                time: newValueTimePortion
            }
        } else {
            return {
                date: null,
                time: null
            }
        }
    },

    componentWillReceiveProps: function(nextProps) {
        if(! _.isEqual(nextProps.defaultValue, this.props.defaultValue)) {
            if (moment(nextProps.defaultValue).isValid()) {
                const value = this.parseValueFromString(nextProps.defaultValue)
                this.setState({date: value.date, time: value.time})
            }
        }
    },

    // Update only if the state has changed
    shouldComponentUpdate: function(nextProps, nextState) {
        return true
    },

    timePickerComponentName: function(dateTimeFieldName) {
        return (dateTimeFieldName + 'timePicker')
    },

    render: function () {
        return (
            <div className="multi-field">
                <div className="indented">
                    <label style={{position: 'relative'}}><FormattedMessage id={`${this.props.label}`} /> <ValidationPopover validationErrors={this.props.validationErrors} /></label>
                    <HelDatePicker ref="date" name={this.props.name} defaultValue={this.state.date} validations={['isDate']} placeholder="pp.kk.vvvv" onChange={this.onChange} onBlur={this.onBlur} label={<FormattedMessage id="date" />} />
                    <HelTimePicker ref="time" name={this.timePickerComponentName(this.props.name)} defaultValue={this.state.time} validations={['isTime']} placeholder="hh.mm" onChange={this.onChange} onBlur={this.onBlur} label={<FormattedMessage id="time" />} />
                </div>
            </div>
        )
    }
});

export default HelDateTimeField
