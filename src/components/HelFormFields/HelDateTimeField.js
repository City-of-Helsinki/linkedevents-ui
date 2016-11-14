import React from 'react'
import HelTextField from './HelTextField.js'
import HelDatePicker from './HelDatePicker.js'
import HelTimePicker from './HelTimePicker.js'


import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

import { FormattedMessage } from 'react-intl'

import ValidationPopover from 'src/components/ValidationPopover'

import moment from 'moment'

const HelDateTimeField = React.createClass({

    getInitialState: function() {
        let defaultValue = this.props.defaultValue || null

        if(moment(defaultValue).isValid()) {
            defaultValue = moment(defaultValue).tz('Europe/Helsinki');

            return {
                value: {
                    date: defaultValue.format('D.M.YYYY'),
                    time: defaultValue.format('H.mm')
                }
            }
        }

        return {
            value: {
                date: null,
                time: null
            }
        }
    },

    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    contextTypes: {
        intl: React.PropTypes.object,
        dispatch: React.PropTypes.func
    },

    handleChange: function (event) {
        this.setState({value: {
            date: this.refs.date.getValue(),
            time: this.refs.time.getValue()
        }})
    },

    onBlur: function() {
        this.setState({value: {
            date: this.refs.date.getValue(),
            time: this.refs.time.getValue()
        }})

        // Returns empty list if there are no validation errors
        let errors = [
            this.refs.time.getValidationErrors(),
            this.refs.date.getValidationErrors()
        ]

        // Filter out empty lists
        let actualErrors = errors.filter(list => (list.length > 0))

        // If no validation errors, format time
        if(actualErrors.length === 0) {

            let datetime = this.getDateTimeFromFields()

            let obj = {}
            obj[this.props.name] = datetime

            this.context.dispatch(setData(obj))

            if(typeof this.props.onChange === 'function') {
                this.props.onChange(event, value)
            }
        }
        else {
            // Errors were found
            let obj = {}
            obj[this.props.name] = null
            this.context.dispatch(setData(obj))
        }

        // if(typeof this.props.onBlur === 'function') {
        //     this.props.onBlur(event, value)
        // }
    },

    getDateTimeFromFields: function() {
        let rawDate = this.refs.date.getValue();
        let rawTime = this.refs.time.getValue();

        if(!rawDate && !rawTime) {
            return undefined
        }

        let date = moment.tz(rawDate, 'D.M.YYYY', 'Europe/Helsinki')

        let time = '00:00'

        if(rawTime) {
            time = moment.tz(rawTime, 'H.mm', 'Europe/Helsinki').format('HH:mm')
        }

        let datetime = moment.tz(`${rawDate} ${time}`, 'D.M.YYYY HH:mm', 'Europe/Helsinki').utc().toISOString()

        return datetime;
    },

    // Parses date time object from datetime string
    parseValueFromString: function(string) {
        let newValue = string || null

        if(moment(newValue).isValid()) {
            newValue = moment(newValue).tz('Europe/Helsinki');

            return {
                date: newValue.format('D.M.YYYY'),
                time: newValue.format('H.mm')
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
                this.setState({value: value})
            }
        }
    },

    // Update only if the state has changed
    shouldComponentUpdate: function(nextProps, nextState) {
        return true
    },

    render: function () {
        return (
            <div className="multi-field">
                <div className="indented">
                    <label style={{position: 'relative'}}><FormattedMessage id={`${this.props.label}`} /> <ValidationPopover validationErrors={this.props.validationErrors} /></label>
                    <HelDatePicker ref="date" defaultValue={this.state.value.date} validations={['isDate']} placeholder="pp.kk.vvvv" onChange={this.handleChange} onBlur={this.onBlur} label={<FormattedMessage id="date" />} />

                    <HelTimePicker ref="time" defaultValue={this.state.value.time} validations={['isTime']} placeholder="hh.mm" onChange={this.handleChange} onBlur={this.onBlur} label={<FormattedMessage id="time" />} />
                    <button>Toistuva tapahtuma</button>
                    <button>Lisää kerta</button>


                </div>
            </div>
        )
    }
});

export default HelDateTimeField
