import './HelDatePicker.scss'
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react'
import {DatePicker, TimePicker, DateTimePicker} from '@material-ui/pickers'
import {IconButton, withStyles} from '@material-ui/core'
import {Close} from '@material-ui/icons'
import moment from 'moment-timezone'
import {FormattedMessage} from 'react-intl'
import {isNil} from 'lodash'

const ClearButton = withStyles({
    root: {
        position: 'absolute',
        transform: 'translateY(-10px)',
        right: 0,
        '& .MuiSvgIcon-root': {
            fontSize: '60%',
        },
    },
})(IconButton)

const clearDate = (setDate, onClose) => {
    setDate(null)
    onClose(null)
}

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
    onClose,
}) => {
    const [date, setDate] = useState(null)

    useEffect(() => {
        !isNil(defaultValue)
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
        DialogProps: {transitionDuration: {enter: 125, exit: 75}},
        clearable: true,
        clearLabel: <FormattedMessage id="clear" />,
        cancelLabel: <FormattedMessage id="cancel" />,
    }

    return (
        <div className="hel-date-picker--container">
            {type === 'date' &&
                <DatePicker
                    disablePast={disablePast}
                    onChange={value => setDate(value)}
                    onAccept={value => onClose(value)}
                    format="DD.MM.YYYY"
                    minDate={minDate}
                    maxDate={maxDate}
                    {...commonProps}
                />
            }
            {type === 'time' &&
                <TimePicker
                    ampm={false}
                    onChange={value => setDate(value)}
                    onAccept={value => onClose(value)}
                    format="HH.mm"
                    {...commonProps}
                />
            }
            {type === 'date-time' &&
                <DateTimePicker
                    disablePast={disablePast}
                    ampm={false}
                    onChange={value => setDate(value)}
                    onAccept={value => onClose(value)}
                    format="DD.MM.YYYY HH.mm"
                    minDate={minDate}
                    maxDate={maxDate}
                    {...commonProps}
                />
            }
            {!disabled &&
                <ClearButton onClick={() => clearDate(setDate, onClose)}>
                    <Close/>
                </ClearButton>
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
    onClose: PropTypes.func,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    disablePast: PropTypes.bool,
}

export default HelDatePicker
