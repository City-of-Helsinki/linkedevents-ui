import PropTypes from 'prop-types';
import React from 'react'
import HelTextField from 'src/components/HelFormFields/HelTextField.js'
import RecurringDateRangePicker from './RecurringDateRangePicker'
import RecurringTimePicker from './RecurringTimePicker'
import {FormattedMessage} from 'react-intl'
import moment from 'moment'

import DayCheckbox from './DayCheckbox'
// Material-ui Icons
import {Add, Close} from 'material-ui-icons'
import {Button as MaterialButton} from 'material-ui'
import {Grid, Row, Col, ControlLabel, Button} from 'react-bootstrap'

import {connect} from 'react-redux'
import {setEventData, sortSubEvents} from 'src/actions/editor'

import validationRules from 'src/validation/validationRules'
import ValidationPopover from 'src/components/ValidationPopover'

import update from 'immutability-helper'
import CONSTANTS from '../../constants'

import './RecurringEvent.scss'

class RecurringEvent extends React.Component {

    static contextTypes = {
        intl: PropTypes.object,
        dispatch: PropTypes.func,
    }

    static propTypes = {
        values: PropTypes.object,
        toggle: PropTypes.func,
        validationErrors: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object,
        ]),
    }

    constructor (props) {
        super(props)
        this.onChange = this.onChange.bind(this)
        this.onCheckboxChange = this.onCheckboxChange.bind(this)
        this.weekIntervalChange = this.weekIntervalChange.bind(this)
        this.onTimeChange = this.onTimeChange.bind(this)
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
            recurringStartDate: moment(this.props.values.start_time),
            recurringStartTime: moment(this.props.values.start_time).format('HH:mm'),
            recurringEndDate: moment(this.props.values.end_time).add(2, 'weeks'),
            recurringEndTime: moment(this.props.values.end_time).format('HH:mm'),
            errors: {
                afterStartTime: false,
                atLeastOneIsTrue: false,
                daysWithinInterval: false,
                isMoreThanOne: false,
                isDate: false,
                isTime: false,
            },
        }
    }
    clearErrors () {
        this.setState({errors: {
            afterStartTime: false,
            atLeastOneIsTrue: false,
            daysWithinInterval: false,
            isMoreThanOne: false,
            isDate: false,
            isTime: false,
        }})
    }

    onChange (type, value) {
        if(type && value) {
            this.setState({
                [type]: value,
            })
        }
    }
    onTimeChange (name, time) {
        this.clearErrors()
        this.setState({
            [name]: time,
        })
    }
    stop (e) {
        e.stopPropagation()
    }

    generateEvents (rules) {
        const {recurringStartDate, recurringStartTime, recurringEndDate, recurringEndTime, daysSelected, weekInterval} = rules
        let endDateTestObject = Object.assign({}, {type: 'end_date', start_time: moment(recurringStartDate).format('YYYY-MM-DD'), end_time: moment(recurringEndDate).subtract(1, 'day').format('YYYY-MM-DD')})
        let intervalTestObject = Object.assign({}, {type: 'day_within_interval', daysSelected, start_day_index: moment(recurringStartDate).weekday(), end_day_index: moment(recurringEndDate).weekday()})

        const VALIDATION_RULES = CONSTANTS.VALIDATION_RULES

        let errors = [
            this.getValidationErrors(VALIDATION_RULES.AFTER_START_TIME, endDateTestObject),
            this.getValidationErrors(VALIDATION_RULES.DAY_WITHIN_INTERVAL, intervalTestObject),
            this.getValidationErrors(VALIDATION_RULES.IS_DATE, moment(recurringStartDate).format('YYYY-MM-DD')),
            this.getValidationErrors(VALIDATION_RULES.IS_TIME, recurringStartTime),
            this.getValidationErrors(VALIDATION_RULES.IS_TIME, recurringEndTime),
            this.getValidationErrors(VALIDATION_RULES.IS_MORE_THAN_ONE, weekInterval),
            this.getValidationErrors(VALIDATION_RULES.AT_LEAST_ONE_IS_TRUE, daysSelected),
        ]
        // Filter out empty lists
        let actualErrors = errors.filter(list => (list.length > 0))
        // If no validation errors, format datetime
        if(actualErrors.length === 0) {
            if (moment(recurringStartDate).isValid() && moment(recurringEndDate).isValid && _.some(_.values(daysSelected), value => value === true) && weekInterval > 0) {
                let days = {}
                _.forEach(daysSelected, (value, index) => value ? days = Object.assign({}, days, {[index]: index}) : '')
                const dayCodes = {
                    monday: 1,
                    tuesday: 2,
                    wednesday: 3,
                    thursday: 4,
                    friday: 5,
                    saturday: 6,
                    sunday: 7,
                }
                const eventLength = moment(this.props.values.start_time).diff(this.props.values.end_time, 'minutes') * -1
                let recurringStartTime = Object.assign({}, {full: this.state.recurringStartTime}, {hours: ''}, {minutes: ''})
                switch(recurringStartTime.full.length) {
                    case 2:
                        recurringStartTime.hours = recurringStartTime.full
                        recurringStartTime.minutes = '00'
                        break;
                    case 5:
                        recurringStartTime.hours = recurringStartTime.full.substring(0, 2)
                        recurringStartTime.minutes = recurringStartTime.full.substring(3, 5)
                }
                let recurringEndTime = Object.assign({}, {full: this.state.recurringEndTime}, {hours: ''}, {minutes: ''})
                switch(recurringEndTime.full.length) {
                    case 2:
                        recurringEndTime.hours = recurringEndTime.full
                        recurringEndTime.minutes = '00'
                        break;
                    case 5:
                        recurringEndTime.hours = recurringEndTime.full.substring(0, 2)
                        recurringEndTime.minutes = recurringEndTime.full.substring(3, 5)
                }
                let count = 1

                for (const key in days) {
                    if (days.hasOwnProperty(key)) {
                        const day = dayCodes[days[key]]
                        const interval = weekInterval * 7
                        for (let i = 0; i < 53 ; i++) {
                            if (moment().isoWeekday(day + i * interval).isBetween(moment(recurringStartDate), moment(recurringEndDate).add(1, 'day'), 'day')) {
                                let obj = {}
                                const key = Object.keys(this.props.values.sub_events).length + count
                                count += 1
                                const startTime = moment().isoWeekday(day + i * interval).hours(recurringStartTime.hours).minutes(recurringStartTime.minutes)
                                let endTime = Object.assign({}, startTime)
                                endTime = moment(endTime).add(eventLength, 'minutes').hours(recurringEndTime.hours).minutes(recurringEndTime.minutes)
                                obj[key] = {
                                    start_time: moment.tz(startTime, 'Europe/Helsinki').utc().toISOString(),
                                    end_time: moment.tz(endTime, 'Europe/Helsinki').utc().toISOString(),
                                }
                                this.context.dispatch(setEventData(obj, key))
                                this.props.toggle()
                            }
                        }
                    }
                }
                this.context.dispatch(sortSubEvents())
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
        if(value.type && value.type === 'end_date') {
            validations =  [{
                rule: type,
                passed: validationRules[type](value, value.end_time),
            }]
        } else if (value.type && value.type === 'day_within_interval') {
            validations = [{
                rule: type,
                passed: validationRules[type](value, this.state.recurringEndDate.diff(this.state.recurringStartDate, 'days')),
            }]
        } else if(typeof validationRules[type] === 'function') {
            validations =  [{
                rule: type,
                passed: validationRules[type](null, value),
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
    UNSAFE_componentWillMount() {
        if(this.props.values.start_time) {
            let newDays = Object.assign({}, this.state.daysSelected)
            for(const key in newDays) {
                if(newDays.hasOwnProperty(key)) {
                    if(key == moment(this.props.values.start_time).locale('en').format('dddd').toLowerCase()){
                        newDays[key] = true
                    }
                }
            }
            this.setState({daysSelected: newDays})
        }
    }
    render() {
        const {validationErrors, values} = this.props

        const VALIDATION_RULES = CONSTANTS.VALIDATION_RULES

        const days = this.generateCheckboxes(this.state.daysSelected)
        return (
            <div className="recurring-events-modal" onClick={this.props.toggle}>
                <Grid className="recurring-events" onClick={(e) => this.stop(e)}>
                    <Button className="recurring-events-modal__close" onClick={this.props.toggle}>
                        <Close />
                    </Button>

                    <h2><FormattedMessage id="event-add-recurring"/></h2>

                    <Row>
                        <Col xs={12} className="multi-field repeat-frequency">
                            <div className="dates-label">
                                <FormattedMessage id="repetition-interval-label"/>
                            </div>
                            
                            <div>
                                <FormattedMessage id="repeated" />
                                <div className="repetition-count">
                                    <HelTextField
                                        onBlur={() => this.clearErrors()}
                                        onChange={this.weekIntervalChange}
                                        validationErrors={(this.state.errors.isMoreThanOne ? [VALIDATION_RULES.IS_MORE_THAN_ONE] : null)}
                                        defaultValue={this.state.weekInterval}
                                    />
                                </div>
                                <FormattedMessage id="repetition-interval" />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12}>
                            <span className="play-date">
                                <div className="play-date-label">
                                    <FormattedMessage id="play-date-label" />
                                </div>
                                <ValidationPopover small={true} validationErrors={(this.state.errors.atLeastOneIsTrue ? [VALIDATION_RULES.AT_LEAST_ONE_IS_TRUE] : null)} />
                                <ValidationPopover small={true} validationErrors={(this.state.errors.daysWithinInterval ? [VALIDATION_RULES.DAY_WITHIN_INTERVAL] : null)} />
                            </span>
                        </Col>
                    </Row>
                    <Row>
                        { days }
                    </Row>

                    <Row>
                        <div className="recurring-date-range-wrapper multi-field">
                            <RecurringDateRangePicker
                                name="recurringStartDate"
                                validationErrors={(this.state.errors.isDate ? [VALIDATION_RULES.IS_DATE] : null)}
                                ref="start_time"
                                defaultValue={this.state.recurringStartDate}
                                label="repetition-begin"
                                onChange={this.onChange}
                                onBlur={() => this.clearErrors()}
                            />

                            <RecurringDateRangePicker
                                name="recurringEndDate"
                                validationErrors={(this.state.errors.afterStartTime ? [VALIDATION_RULES.AFTER_START_TIME] : null)}
                                ref="end_time"
                                defaultValue={this.state.recurringEndDate}
                                label="repetition-end"
                                onChange={this.onChange}
                            />
                        </div>
                    </Row>

                    <Row>
                        <Col xs={6} className="multi-field recurring-times">
                            <span className="label-wrapper"><FormattedMessage id="repetition-start-time" /><ValidationPopover small={true} validationErrors={(this.state.errors.isTime ? [VALIDATION_RULES.IS_TIME] : null)} /></span>
                            <RecurringTimePicker name="recurringStartTime" time={this.state.recurringStartTime} onChange={this.onTimeChange} onBlur={this.onTimeChange} />
                        </Col>

                        <Col xs={6} className="multi-field recurring-times">
                            <span className="label-wrapper"><FormattedMessage id="repetition-end-time" /><ValidationPopover small={true} validationErrors={(this.state.errors.isTime ? [VALIDATION_RULES.IS_TIME] : null)} /></span>
                            <RecurringTimePicker name="recurringEndTime" time={this.state.recurringEndTime} onChange={this.onTimeChange} onBlur={this.onTimeChange} />
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12}>
                            <MaterialButton
                                className="base-material-btn"
                                raised
                                color="primary"
                                onClick={() => this.generateEvents(this.state)}><Add/><FormattedMessage id="add-more"/>
                            </MaterialButton>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default RecurringEvent
