import PropTypes from 'prop-types';
import React, {useRef} from 'react'
import moment from 'moment-timezone'
import {connect} from 'react-redux'
import {setData as setDataAction, updateSubEvent as updateSubEventAction} from 'src/actions/editor'
import ValidationPopover from 'src/components/ValidationPopover'
import HelDatePicker from './HelDatePicker'
import {isNil} from 'lodash'

const onChange = (
    value,
    name,
    eventKey,
    updateSubEvent,
    setData,
    setDirtyState = () => {}
) => {
    const formattedValue = !isNil(value)
        ? value.isValid()
            // if valid, convert to utc time and format to ISO string
            ? moment(value).tz('Europe/Helsinki').utc().toISOString()
            // use moment input value if the date is invalid
            : value.creationData().input
        : undefined

    eventKey
        ? updateSubEvent(formattedValue, name, eventKey)
        : setData({[name]: formattedValue})

    setDirtyState()
}

const HelDateTimeField = ({
    name,
    eventKey,
    defaultValue,
    disabled,
    disablePast,
    label,
    placeholder,
    validationErrors,
    setData,
    updateSubEvent,
    setDirtyState,
    minDate,
    maxDate,
}) => {
    const containerRef = useRef(null)

    return (
        <div ref={containerRef}>
            <HelDatePicker
                type={'date-time'}
                name={name}
                label={label}
                placeholder={placeholder}
                disabled={disabled}
                disablePast={disablePast}
                defaultValue={defaultValue}
                onChange={value => onChange(value, name, eventKey, updateSubEvent, setData, setDirtyState)}
                minDate={minDate}
                maxDate={maxDate}
            />
            <ValidationPopover
                anchor={containerRef.current}
                placement={'right'}
                validationErrors={validationErrors}
            />
        </div>
    )
}

HelDateTimeField.propTypes = {
    setData: PropTypes.func,
    updateSubEvent: PropTypes.func,
    name: PropTypes.string.isRequired,
    eventKey: PropTypes.string,
    defaultValue: PropTypes.string,
    setDirtyState: PropTypes.func,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    validationErrors: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    disabled: PropTypes.bool,
    disablePast: PropTypes.bool,
    minDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    maxDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
}

const mapDispatchToProps = (dispatch) => ({
    setData: (value) => dispatch(setDataAction(value)),
    updateSubEvent: (value, property, eventKey) => dispatch(updateSubEventAction(value, property, eventKey)),
})

export default connect(null, mapDispatchToProps)(HelDateTimeField)
