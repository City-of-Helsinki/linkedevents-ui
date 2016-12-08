import React from "react"
import HelTextField from "src/components/HelFormFields/HelTextField.js"
import HelDateTimeField from "src/components/HelFormFields/HelDateTimeField.js"
import RecurringDateRangePicker from "./RecurringDateRangePicker"
import { FormattedMessage } from "react-intl"
import { RaisedButton } from "material-ui"
import DatePicker from "react-datepicker/dist/react-datepicker.js"
import DayCheckbox from "./DayCheckbox"

import {connect} from "react-redux"
import {setEventData} from "src/actions/editor.js"

import validationRules from "src/validation/validationRules.js"
import ValidationPopover from "src/components/ValidationPopover"

import moment from "moment"
import update from "immutability-helper"

import "react-datepicker/dist/react-datepicker.css"
import "src/components/HelFormFields/HelDatePicker.scss"
import "./RecurringEvent.scss"

class RecurringEvent extends React.Component {

    static contextTypes = {
        dispatch: React.PropTypes.func
    }

    constructor (props) {
        super(props)
        this.onChange = this.onChange.bind(this)
        this.onCheckboxChange = this.onCheckboxChange.bind(this)
        this.weekIntervalChange = this.weekIntervalChange.bind(this)
        this.state = {
            weekInterval: 0,
            daysSelected: {
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false,
            },
            recurringStart: this.props.values.start_time,
            recurringEnd: this.props.values.end_time
        }
    }

    onChange (type, value) {
        if(type && value) {
            this.setState({
                [type]: value
            })
        }
    }
    stop (e) {
        e.stopPropagation()
    }
    generateEvents (rules) {
        const { recurringStart, recurringEnd, daysSelected, weekInterval } = rules
        if (moment(recurringStart).isValid() && moment(recurringEnd).isValid && _.some(_.values(daysSelected), value => value === true) && weekInterval > 0) {
            let days = {}
            _.forEach(daysSelected, (value, index) => value ? days = Object.assign({}, days, {[index]: index}) : '')
            const dayCodes = {
                monday: 1,
                tuesday: 2,
                wednesday: 3,
                thursday: 4,
                friday: 5,
                saturday: 6,
                sunday: 7
            }
            const eventLength = moment(this.props.values.start_time).diff(this.props.values.end_time, 'minutes')*-1
            let count = 1
            for (const key in days) {
                if (days.hasOwnProperty(key)) {
                    const day = dayCodes[days[key]]
                    const interval = weekInterval*7
                    for (let i = 0; i < 53 ; i++) {
                        if (moment().isoWeekday(day + i*interval).isBetween(moment(recurringStart), moment(recurringEnd).add(1, "day"), 'day')) {
                            let obj = {}
                            const key = Object.keys(this.props.values.sub_events).length+count
                            count += 1
                            const startTime = moment().isoWeekday(day + i*interval).hours(moment(this.props.values.start_time).format("HH")).minutes(moment(this.props.values.start_time).format("mm"))
                            let endTime = Object.assign({}, startTime)
                            endTime = moment(endTime).add(eventLength, 'minutes').hours(moment(this.props.values.end_time).format("HH")).minutes(moment(this.props.values.end_time).format("mm"))
                            obj[key] = {
                                start_time: moment.tz(startTime, 'Europe/Helsinki').utc().toISOString(),
                                end_time: moment.tz(endTime, 'Europe/Helsinki').utc().toISOString()
                            }
                            this.context.dispatch(setEventData(obj, key))
                            this.props.toggle()
                        }
                    }
                }
            }
        }
    }
    onCheckboxChange (key, value) {
        const newDays = Object.assign({}, this.state.daysSelected, {[key]: value})
        this.setState({daysSelected: newDays})
    }
    weekIntervalChange (event, value) {
        if(value) {
            this.setState({weekInterval: value})
        }
    }
    generateCheckboxes (days) {
        const dayElements = []
        for (const key in days) {
            if(days.hasOwnProperty(key)) {
                dayElements.push(<DayCheckbox key={key} day={key} onChange={this.onCheckboxChange} defaultChecked={days[key]}/>)
            }
        }
        return dayElements
    }
    componentWillMount() {
        if(this.props.values.start_time) {
            let newDays = Object.assign({}, this.state.daysSelected)
            for(const key in newDays) {
                if(newDays.hasOwnProperty(key)) {
                    if(key == moment(this.props.values.start_time).locale('en').format("dddd").toLowerCase()){
                        newDays[key] = true
                    }
                }
            }
            this.setState({daysSelected: newDays})
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.values.start_time && nextProps.values.start_time !== this.state.recurringStart) {
            this.setState({recurringStart: nextProps.values.start_time})
        }
        if(nextProps.values.end_time && nextProps.values.end_time !== this.state.recurringEnd) {
            this.setState({recurringEnd: nextProps.values.end_time})
        }
    }
    render() {
        const { validationErrors, values } = this.props
        const buttonStyle = {
            height: "64px",
            margin: "10px 5px",
            display: "flex"
        }
        const days = this.generateCheckboxes(this.state.daysSelected)
        return (
            <div className="recurring-events-modal" onClick={this.props.toggle}>
                <div className="recurring-events" onClick={(e) => this.stop(e)}>
                    <button type="button" className="btn btn-lg btn-default recurring-modal-close" onClick={this.props.toggle}>
                        <span className="glyphicon glyphicon-remove"></span>
                    </button>
                    <h2>Toistuva tapahtuma</h2>
                    <div className="row">
                        <div className="col-xs-12 col-md-6">
                            <HelDateTimeField validationErrors={validationErrors['start_time']} defaultValue={values['start_time']} ref="start_time" name="start_time" label="event-starting-datetime" />
                        </div>
                        <div className="col-xs-12 col-md-6">
                            <HelDateTimeField validationErrors={validationErrors['end_time']} defaultValue={values['end_time']} ref="end_time" name="end_time" label="event-ending-datetime" />
                        </div>
                    </div>
                    <div className="multi-field repeat-frequency col-xs-12">
                        <FormattedMessage id="repeated" />
                        <div className="repetition-count">
                            <HelTextField onChange={this.weekIntervalChange}/>
                        </div>
                        <FormattedMessage id="repetition-interval" />
                    </div>
                    { days }
                    <div className="col-xs-12 recurring-date-range-wrapper multi-field">
                        <RecurringDateRangePicker name="recurringStart" defaultValue={this.state.recurringStart} label="repetition-begin" onChange={this.onChange} />
                        <RecurringDateRangePicker name="recurringEnd" defaultValue={this.state.recurringEnd} label="repetition-end" onChange={this.onChange} />
                        {/* <div className="col-xs-12 col-sm-6 indented">
                            <label style={{position: 'relative'}}>
                                <FormattedMessage id="repetition-begin" />
                                <ValidationPopover validationErrors={this.props.validationErrors} />
                            </label>
                            <HelDatePicker ref="date" name="recurring-end" defaultValue={values['start_time']} validations={['isDate']} placeholder="pp.kk.vvvv" onChange={this.onChange} onBlur={this.onBlur} label={<FormattedMessage id="date" />} />
                        </div>
                        <div className="col-xs-12 col-sm-6 indented">
                            <label style={{position: 'relative'}}>
                                <FormattedMessage id="repetition-begin" />
                                <ValidationPopover validationErrors={this.props.validationErrors} />
                            </label>
                            <HelDatePicker ref="date" name="recurring-end" defaultValue={values['end_time']} validations={['isDate']} placeholder="pp.kk.vvvv" onChange={this.onChange} onBlur={this.onBlur} label={<FormattedMessage id="date" />} />
                        </div> */}
                    </div>
                    <div className="col-xs-12">
                        <RaisedButton
                            style={buttonStyle}
                            primary={true}
                            onClick={() => this.generateEvents(this.state)}
                            label={<span><i className="material-icons">add</i>Lisää kerrat</span>} />
                    </div>
                </div>
            </div>
        )
    }
}

export default RecurringEvent
