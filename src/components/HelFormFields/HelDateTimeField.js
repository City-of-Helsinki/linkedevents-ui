import PropTypes from 'prop-types';
import React, {useRef} from 'react'
import moment from 'moment-timezone'
import {connect} from 'react-redux'
import {setData as setDataAction, updateSubEvent as updateSubEventAction} from 'src/actions/editor'
import ValidationPopover from 'src/components/ValidationPopover'
import HelDatePicker from './HelDatePicker'
import {isNil} from 'lodash'

const onClose = (
    value,
    name,
    eventKey,
    updateSubEvent,
    setData,
    setDirtyState = () => {}
) => {
    const formattedValue = !isNil(value)
        ? moment(value).tz('Europe/Helsinki').utc().toISOString()
        : undefined

    if (eventKey) {
        updateSubEvent(formattedValue, name, eventKey)
    } else {
        setData({[name]: formattedValue})
    }

    setDirtyState()
}

const HelDateTimeField = ({
    name,
    eventKey,
    defaultValue,
    disabled,
    disablePast,
    label,
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
                disabled={disabled}
                disablePast={disablePast}
                defaultValue={defaultValue}
                onClose={value => onClose(value, name, eventKey, updateSubEvent, setData, setDirtyState)}
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
