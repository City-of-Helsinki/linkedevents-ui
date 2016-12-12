import React from "react"
import HelTextField from "src/components/HelFormFields/HelTextField.js"
import RecurringDateRangePicker from "./RecurringDateRangePicker"
import { FormattedMessage } from "react-intl"
import { RaisedButton } from "material-ui"
import DayCheckbox from "./DayCheckbox"

import {connect} from "react-redux"
import {setEventData} from "src/actions/editor.js"

import validationRules from "src/validation/validationRules.js"
import ValidationPopover from "src/components/ValidationPopover"

import moment from "moment"
import update from "immutability-helper"

import "./RecurringEvent.scss"

class RecurringEvent extends React.Component {

    static contextTypes = {
        intl: React.PropTypes.object,
        dispatch: React.PropTypes.func
    }

    constructor (props) {
        super(props)
        this.onChange = this.onChange.bind(this)
        this.onCheckboxChange = this.onCheckboxChange.bind(this)
        this.weekIntervalChange = this.weekIntervalChange.bind(this)
        this.state = {
            weekInterval: 1,
            daysSelected: {
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false,
            },
            recurringStart: moment(this.props.values.start_time),
            recurringEnd: moment(this.props.values.end_time).add(2, 'weeks'),
            errors: {
                afterStartTime: false,
                atLeastOneIsTrue: false,
                isMoreThanOne: false,
                isDate: false
            }
        }
    }
    clearErrors () {
        this.setState({errors: {
            afterStartTime: false,
            atLeastOneIsTrue: false,
            isMoreThanOne: false,
            isDate: false
        }})
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
        let endDateTestObject = Object.assign({}, {type: "end_date", start_time: moment(recurringStart).format("YYYY-MM-DD"), end_time: moment(recurringEnd).subtract(1, "day").format("YYYY-MM-DD")})
        let errors = [
            this.getValidationErrors("afterStartTime", endDateTestObject),
            this.getValidationErrors("isDate", moment(recurringStart).format("YYYY-MM-DD")),
            this.getValidationErrors("isMoreThanOne", weekInterval),
            this.getValidationErrors("atLeastOneIsTrue", daysSelected)
        ]
        // Filter out empty lists
        let actualErrors = errors.filter(list => (list.length > 0))
        // If no validation errors, format datetime
        if(actualErrors.length === 0) {
            if (moment(recurringStart).isValid() && moment(recurringEnd).isValid && _.some(_.values(daysSelected), value => value === true) && weekInterval > 0) {
                let days = {}
                _.forEach(daysSelected, (value, index) => value ? days = Object.assign({}, days, {[index]: index}) : "")
                const dayCodes = {
                    monday: 1,
                    tuesday: 2,
                    wednesday: 3,
                    thursday: 4,
                    friday: 5,
                    saturday: 6,
                    sunday: 7
                }
                const eventLength = moment(this.props.values.start_time).diff(this.props.values.end_time, "minutes")*-1
                let count = 1
                for (const key in days) {
                    if (days.hasOwnProperty(key)) {
                        const day = dayCodes[days[key]]
                        const interval = weekInterval*7
                        for (let i = 0; i < 53 ; i++) {
                            if (moment().isoWeekday(day + i*interval).isBetween(moment(recurringStart), moment(recurringEnd).add(1, "day"), "day")) {
                                let obj = {}
                                const key = Object.keys(this.props.values.sub_events).length+count
                                count += 1
                                const startTime = moment().isoWeekday(day + i*interval).hours(moment(this.props.values.start_time).format("HH")).minutes(moment(this.props.values.start_time).format("mm"))
                                let endTime = Object.assign({}, startTime)
                                endTime = moment(endTime).add(eventLength, "minutes").hours(moment(this.props.values.end_time).format("HH")).minutes(moment(this.props.values.end_time).format("mm"))
                                obj[key] = {
                                    start_time: moment.tz(startTime, "Europe/Helsinki").utc().toISOString(),
                                    end_time: moment.tz(endTime, "Europe/Helsinki").utc().toISOString()
                                }
                                this.context.dispatch(setEventData(obj, key))
                                this.props.toggle()
                            }
                        }
                    }
                }
            }
        } else {
            let newErrors = Object.assign({}, this.state.errors)

            actualErrors.map(error => {
                newErrors = Object.assign({}, newErrors, {[error[0].rule]: true})
            })
            this.setState({errors: newErrors})
        }
    }

    getValidationErrors (type, value) {
        let validations;
        if(value.type && value.type === "end_date") {
            validations =  [{
                rule: type,
                passed: validationRules[type](value, value.end_time)
            }]
        } else if(typeof validationRules[type] === "function") {
            validations =  [{
                rule: type,
                passed: validationRules[type](null, value)
            }]
        }
        validations = validations.filter(i => (i.passed === false))
        if(validations.length) {
            return validations;
        }

        return []
    }
    onCheckboxChange (key, value) {
        this.clearErrors()
        const newDays = Object.assign({}, this.state.daysSelected, {[key]: value})
        this.setState({daysSelected: newDays})
    }
    weekIntervalChange (event, value) {
        this.setState({weekInterval: value})
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
                    <div className="multi-field repeat-frequency col-xs-12">
                        <FormattedMessage id="repeated" />
                        <div className="repetition-count">
                            <HelTextField
                                onBlur={() => this.clearErrors()}
                                onChange={this.weekIntervalChange}
                                label={this.context.intl.formatMessage({id: "repetition-interval-label"})}
                                validationErrors={(this.state.errors.isMoreThanOne ? ["isMoreThanOne"] : "")}
                                defaultValue={this.state.weekInterval}
                            />
                        </div>
                        <FormattedMessage id="repetition-interval" />
                    </div>
                    <div>
                        <span className="dates-label">Toistopäivät<ValidationPopover small validationErrors={(this.state.errors.atLeastOneIsTrue ? ["atLeastOneIsTrue"] : "")} /></span>
                    </div>
                    { days }
                    <div className="col-xs-12 recurring-date-range-wrapper multi-field">
                        <RecurringDateRangePicker
                            name="recurringStart"
                            validationErrors={(this.state.errors.isDate ? ["isDate"] : "")}
                            ref="start_time"
                            defaultValue={this.state.recurringStartDate}
                            label="repetition-begin"
                            onChange={this.onChange}
                            onBlur={() => this.clearErrors()}
                        />

                        <RecurringDateRangePicker
                            name="recurringEnd"
                            validationErrors={(this.state.errors.afterStartTime ? ["afterStartTime"] : "")}
                            ref="end_time"
                            defaultValue={this.state.recurringEndDate}
                            label="repetition-end"
                            onChange={this.onChange}
                        />
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
