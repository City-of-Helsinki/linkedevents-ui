import './HelDatePicker.scss'
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react'
import {KeyboardDatePicker, KeyboardTimePicker, KeyboardDateTimePicker} from '@material-ui/pickers'
import moment from 'moment-timezone'
import {FormattedMessage} from 'react-intl'
import {isNil} from 'lodash'

const HelDatePicker = ({
    type = 'date',
    name,
    label,
    disabled,
    disablePast = false,
    defaultValue,
    placeholder,
    minDate,
    maxDate,
    onChange = () => {},
}) => {
    const [date, setDate] = useState(null)

    useEffect(() => {
        !isNil(defaultValue) && defaultValue !== ''
            ? setDate(moment(defaultValue).tz('Europe/Helsinki'))
            : setDate(null)
    }, [defaultValue])

    const commonProps = {
        fullWidth: true,
        disabled: disabled,
        label: label
            ? typeof label === 'object' ? label : <FormattedMessage id={label} />
            : null,
        placeholder: placeholder,
        name: name,
        value: date,
        variant: 'inline',
        onChange,
    }

    return (
        <div className="hel-date-picker--container">
            {type === 'date' &&
                <KeyboardDatePicker
                    strictCompareDates
                    disablePast={disablePast}
                    format="DD.MM.YYYY"
                    invalidDateMessage={<FormattedMessage id="invalid-date-format" />}
                    minDate={minDate}
                    maxDate={maxDate}
                    minDateMessage={<FormattedMessage id="validation-afterStartTimeAndInFuture" />}
                    maxDateMessage=""
                    {...commonProps}
                />
            }
            {type === 'time' &&
                <KeyboardTimePicker
                    ampm={false}
                    format="HH.mm"
                    invalidDateMessage={<FormattedMessage id="invalid-time-format" />}
                    {...commonProps}
                />
            }
            {type === 'date-time' &&
                <KeyboardDateTimePicker
                    strictCompareDates
                    disablePast={disablePast}
                    ampm={false}
                    format="DD.MM.YYYY HH.mm"
                    invalidDateMessage={<FormattedMessage id="invalid-date-format" />}
                    minDate={minDate}
                    maxDate={maxDate}
                    minDateMessage={<FormattedMessage id="validation-afterStartTimeAndInFuture" />}
                    maxDateMessage=""
                    {...commonProps}
                />
            }
        </div>
    )
}

HelDatePicker.propTypes = {
    defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    type: PropTypes.oneOf(['date', 'time', 'date-time']),
    name: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    minDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    maxDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    disablePast: PropTypes.bool,
}

export default HelDatePicker
