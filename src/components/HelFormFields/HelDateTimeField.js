import PropTypes from 'prop-types';
import React from 'react'
import HelTextField from './HelTextField.js'
import HelDatePicker from './HelDatePicker.js'
import HelTimePicker from './HelTimePicker.js'
import HelCheckbox from './HelCheckbox'

import {connect} from 'react-redux'
import {setData, updateSubEvent} from 'src/actions/editor.js'

import { FormattedMessage } from 'react-intl'

import validationRules from 'src/validation/validationRules.js';
import ValidationPopover from 'src/components/ValidationPopover'

import moment from 'moment'

const HelDateTimeField = React.createClass({

    getInitialState: function() {
        return this.parseValueFromString(this.props.defaultValue)
    },

    propTypes: {
        name: PropTypes.string.isRequired,
        eventKey: PropTypes.string
    },

    contextTypes: {
        intl: PropTypes.object,
        dispatch: PropTypes.func
    },

    onChange: function(type, value) {
        this.setState({
            [type]: value
        })
    },

    onBlur: function(type, value) {

        if(this.state.date && this.state.time) {
            const date = moment.tz(this.state.date, 'Europe/Helsinki').format('YYYY-MM-DD')
            const time = this.state.time
            let errors = [
                this.getValidationErrors('isTime', time),
                this.getValidationErrors('isDate', date)
            ]

            // Filter out empty lists
            let actualErrors = errors.filter(list => (list.length > 0))
            // If no validation errors, format datetime
            if(actualErrors.length === 0) {
                let datetime = this.getDateTimeFromFields(date, time)
                if(datetime) {
                    if(this.props.eventKey){
                        this.context.dispatch(updateSubEvent(datetime, this.props.name, this.props.eventKey))
                    } else {
                        let obj = {}
                        obj[this.props.name] = datetime
                        obj[this.props.name + 'WholeDayEvent'] = this.state.isWholeDayEvent
                        this.context.dispatch(setData(obj))
                    }

                    if (this.props.setDirtyState) {
                        this.props.setDirtyState()
                    }
                }
            }
        }
    },

    getDateTimeFromFields: function(date, time) {
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

        let newDateTime = date+'T'+newTime;
        const dateTime = moment.tz(newDateTime, 'Europe/Helsinki').utc().toISOString()
        return dateTime;
    },

    // Parses date time object from datetime string
    parseValueFromString: function(string) {
        let newValue = string || ''
        let isWholeDayEvent = false
        if (!newValue.includes('T')) {
            isWholeDayEvent = true
        }

        if(moment(newValue).isValid()) {
            newValue = moment(newValue).tz('Europe/Helsinki');
            return {
                date: newValue,
                time: newValue.format('H.mm'),
                isWholeDayEvent
            }
        } else {
            return {
                date: null,
                time: null,
                isWholeDayEvent
            }
        }
    },

    getValidationErrors: function(type, value) {
        if(value && type) {
            let validations;
            if(typeof validationRules[type] === 'function') {
                validations =  [{
                    rule: type,
                    passed: validationRules[type](null, value)
                }]
            }
            validations = validations.filter(i => (i.passed === false))
            if(validations.length) {
                return validations;
            }
        }

        return []
    },

    componentWillReceiveProps: function(nextProps) {
        if (moment(nextProps.defaultValue).isValid()) {
            const value = this.parseValueFromString(nextProps.defaultValue)
            let isWholeDayEvent = false
            if (nextProps.isWholeDayEvent === undefined) {
                isWholeDayEvent = value.isWholeDayEvent
            } else {
                // props override parsing from string
                isWholeDayEvent = nextProps.isWholeDayEvent
            }
            this.setState({date: value.date, time: value.time, isWholeDayEvent})
        }
    },

    // Update only if the state has changed
    shouldComponentUpdate: function(nextProps, nextState) {
        return true
    },

    setIsWholeDayEvent(e, value) {
        if(this.props.eventKey){
            //Subevent
            this.context.dispatch(updateSubEvent(value, 'isWholeDayEvent', this.props.eventKey))
        } else {
            let obj = {}
            obj['isWholeDayEvent'] = value
            this.context.dispatch(setData(obj))
        }
    },

    render: function () {
        return (
            <div className="multi-field">
                <div className="indented">
                    <label style={{position: 'relative'}}><FormattedMessage id={`${this.props.label}`} /> <ValidationPopover validationErrors={this.props.validationErrors} /></label>
                    <HelDatePicker ref="date" name={this.props.name} defaultValue={this.state.date} validations={['isDate']} placeholder="pp.kk.vvvv" onChange={this.onChange} onBlur={this.onBlur} label={<FormattedMessage id="date" />} />
                    {!this.state.isWholeDayEvent &&
                    <HelTimePicker ref="time" name={this.props.name} defaultValue={this.state.time} validations={['isTime']} placeholder="hh.mm" onChange={this.onChange} onBlur={this.onBlur} label={<FormattedMessage id="time" />} />
                    }
                    {!!this.props.showWholeDayEventSwitch === true &&
                       <HelCheckbox defaultChecked={this.state.isWholeDayEvent} label={<FormattedMessage id="event-whole-day-event"/>} onChange={(e,v) => this.setIsWholeDayEvent(e,v)}/>
                    }
                </div>
            </div>
        )
    }
});

export default HelDateTimeField