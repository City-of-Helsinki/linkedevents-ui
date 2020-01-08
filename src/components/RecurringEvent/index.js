import PropTypes from 'prop-types';
import React from 'react'
import RecurringDateRangePicker from './RecurringDateRangePicker'
import RecurringTimePicker from './RecurringTimePicker'
import {FormattedMessage} from 'react-intl'
import moment from 'moment'
import {some, values, forEach, isEmpty} from 'lodash' 

import DayCheckbox from './DayCheckbox'
import {Button, IconButton, TextField, withStyles} from '@material-ui/core'
import {Add, Close} from '@material-ui/icons'

import {setEventData, sortSubEvents} from 'src/actions/editor'

import validationRules from 'src/validation/validationRules'
import ValidationPopover from 'src/components/ValidationPopover'

import CONSTANTS from '../../constants'

import './RecurringEvent.scss'
import {HelTheme} from '../../themes/hel/material-ui'

const RepetitionTextField = withStyles({
    root: {
        margin: 0,
        width: 40,
        '& input': {
            padding: `${HelTheme.spacing(0.5)}px ${HelTheme.spacing(1)}px`,
            textAlign: 'center',
        },
    },
})(TextField)

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

        const {values: {start_time, end_time}} = this.props;

        this.repetitionRef = React.createRef()
        this.playDateRef = React.createRef()
        this.startTimeRef = React.createRef()
        this.endTimeRef = React.createRef()

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
            recurringStartDate: isEmpty(start_time) ? moment(null) : moment(this.props.values.start_time).add(1, 'weeks'),
            recurringStartTime: isEmpty(start_time) ? '' : moment(this.props.values.start_time).format('HH:mm'),
            recurringEndDate: isEmpty(end_time) ? moment(null) : moment(this.props.values.end_time).add(2, 'weeks'),
            recurringEndTime: isEmpty(end_time) ? '' : moment(this.props.values.end_time).format('HH:mm'),
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
            if (moment(recurringStartDate).isValid() && moment(recurringEndDate).isValid && some(values(daysSelected), value => value === true) && weekInterval > 0) {
                let days = {}
                forEach(daysSelected, (value, index) => value ? days = Object.assign({}, days, {[index]: index}) : '')
                const dayCodes = {
                    monday: 1,
                    tuesday: 2,
                    wednesday: 3,
                    thursday: 4,
                    friday: 5,
                    saturday: 6,
                    sunday: 7,
                }
                let eventLength
                if (!isEmpty(recurringEndTime)) {
                    eventLength = moment(recurringEndTime).diff(recurringStartTime, 'minutes')
                }
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
                        // find the first valid matching weekday
                        let firstMatchWeekday
                        const recurrenceStart = moment(recurringStartDate).subtract(1, 'day').endOf('day')
                        const recurrenceEnd = moment(recurringEndDate).endOf('day')
                        for (let i = 0; i <= weekInterval; i++) {
                            const startDateWeekday = moment(recurringStartDate).isoWeekday(day + i * 7)
                            if (startDateWeekday.isBetween(recurrenceStart, recurrenceEnd)) {
                                firstMatchWeekday = startDateWeekday
                                break
                            }
                        }
                        // calculate all the following weekdays using weekInterval as step
                        for (
                            let matchWeekday = firstMatchWeekday;
                            matchWeekday.isBetween(recurrenceStart, recurrenceEnd);
                            matchWeekday = matchWeekday.add(weekInterval, 'week')
                        ) {
                            let obj = {}
                            const key = Object.keys(this.props.values.sub_events).length + count
                            count += 1
                            const startTime = matchWeekday.hours(recurringStartTime.hours).minutes(recurringStartTime.minutes)
                            let endTime
                            if (!isEmpty(rules.recurringEndTime)) {
                                endTime = Object.assign({}, startTime)
                                endTime = moment(endTime).add(eventLength, 'minutes').hours(recurringEndTime.hours).minutes(recurringEndTime.minutes)
                            }
                            obj[key] = {
                                start_time: moment.tz(startTime, 'Europe/Helsinki').utc().toISOString(),
                                end_time: endTime ? moment.tz(endTime, 'Europe/Helsinki').utc().toISOString() : undefined,
                            }
                            this.context.dispatch(setEventData(obj, key))
                            this.props.toggle()
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
    weekIntervalChange (event) {
        this.setState({weekInterval: event.target.value})
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
        const {recurringStartDate, recurringEndDate} = this.state

        const VALIDATION_RULES = CONSTANTS.VALIDATION_RULES

        const days = this.generateCheckboxes(this.state.daysSelected)

        const startDate = recurringStartDate.isValid() ? recurringStartDate : null
        const endDate = recurringEndDate.isValid() ? recurringEndDate : null

        return (
            <div className="recurring-events-modal" onClick={this.props.toggle}>
                <div className="container recurring-events" onClick={(e) => this.stop(e)}>
                    <div className="recurring-events-modal__header">
                        <h2><FormattedMessage id="event-add-recurring"/></h2>
                        <IconButton onClick={this.props.toggle}>
                            <Close />
                        </IconButton>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 multi-field repeat-frequency">
                            <div className="dates-label">
                                <FormattedMessage id="repetition-interval-label"/>
                            </div>
                            
                            <div className="repetition-count" ref={this.repetitionRef}>
                                <FormattedMessage id="repeated" />
                                <RepetitionTextField
                                    value={this.state.weekInterval}
                                    onFocus={event => event.target.select()}
                                    onBlur={() => this.clearErrors()}
                                    onChange={this.weekIntervalChange}
                                />
                                <FormattedMessage id="repetition-interval" />
                                <ValidationPopover
                                    inModal
                                    anchor={this.repetitionRef.current}
                                    validationErrors={(this.state.errors.isMoreThanOne ? [VALIDATION_RULES.IS_MORE_THAN_ONE] : null)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12 col-sm-12">
                            <span className="play-date">
                                <div className="play-date-label" ref={this.playDateRef}>
                                    <FormattedMessage id="play-date-label" />
                                </div>
                                <ValidationPopover
                                    inModal
                                    anchor={this.playDateRef.current}
                                    validationErrors={(this.state.errors.atLeastOneIsTrue ? [VALIDATION_RULES.AT_LEAST_ONE_IS_TRUE] : null)}
                                />
                                <ValidationPopover
                                    inModal
                                    anchor={this.playDateRef.current}
                                    validationErrors={(this.state.errors.daysWithinInterval ? [VALIDATION_RULES.DAY_WITHIN_INTERVAL] : null)}
                                />
                            </span>
                        </div>
                    </div>
                    <div className="row">
                        { days }
                    </div>

                    <div className="row recurring-date-range-wrapper multi-field">
                        <RecurringDateRangePicker
                            name="recurringStartDate"
                            validationErrors={(this.state.errors.isDate ? [VALIDATION_RULES.IS_DATE] : null)}
                            ref="start_time"
                            defaultValue={startDate}
                            label="repetition-begin"
                            onChange={this.onChange}
                            onBlur={() => this.clearErrors()}
                        />

                        <RecurringDateRangePicker
                            name="recurringEndDate"
                            validationErrors={(this.state.errors.afterStartTime ? [VALIDATION_RULES.AFTER_START_TIME] : null)}
                            ref="end_time"
                            defaultValue={endDate}
                            label="repetition-end"
                            onChange={this.onChange}
                        />
                    </div>

                    <div className="row">
                        <div className="col-xs-12 col-sm-6 multi-field recurring-times">
                            <span className="label-wrapper" ref={this.startTimeRef}>
                                <FormattedMessage id="repetition-start-time" />
                            </span>
                            <RecurringTimePicker
                                name="recurringStartTime"
                                time={this.state.recurringStartTime}
                                onChange={this.onTimeChange}
                                onBlur={this.onTimeChange} />
                            <ValidationPopover
                                inModal
                                anchor={this.startTimeRef.current}
                                validationErrors={(this.state.errors.isTime ? [VALIDATION_RULES.IS_TIME] : null)}
                            />
                        </div>

                        <div className="col-xs-6 col-sm-6 multi-field recurring-times">
                            <span className="label-wrapper" ref={this.endTimeRef}>
                                <FormattedMessage id="repetition-end-time" />
                            </span>
                            <RecurringTimePicker
                                name="recurringEndTime"
                                time={this.state.recurringEndTime}
                                onChange={this.onTimeChange}
                                onBlur={this.onTimeChange}
                            />
                            <ValidationPopover
                                inModal
                                anchor={this.endTimeRef.current}
                                validationErrors={(this.state.errors.isTime ? [VALIDATION_RULES.IS_TIME] : null)}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12 col-sm-12">
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={() => this.generateEvents(this.state)}
                                style={{marginTop: HelTheme.spacing(2)}}
                                startIcon={<Add/>}
                            >
                                <FormattedMessage id="add-more"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RecurringEvent
