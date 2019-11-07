// todo: rename file
// todo: check dates not being cleared
// todo: use new constants for recurring and umbrella
import PropTypes from 'prop-types'
import React from 'react'
import {Checkbox} from 'react-bootstrap'
import Tooltip from 'material-ui/Tooltip'
import {isUndefined, isArray, get} from 'lodash'
import constants from '../../../constants'

/**
 * Returns the disabled state for the umbrella checkboxes
 *
 * The 'is_umbrella' checkbox should be disabled when:
 *  - The 'has_umbrella' checkbox is checked
 *  - The event being edited is an umbrella event with sub events
 *  - The event being edited is a sub event of an umbrella event
 *  - The event being edited is a super (recurring) event
 *  - The event being edited is a sub event of a super (recurring) event
 *  - When creating a new event and the form has more than one event date defined for it
 *
 * The 'has_umbrella' checkbox should be disabled when:
 *  - The 'is_umbrella' checkbox is checked
 *  - The event being edited is an umbrella event
 *  - The event being edited is a sub event of a super (recurring) event
 *
 * @param name
 * @param isUmbrellaEvent
 * @param hasUmbrellaEvent
 * @param event
 * @param superEventType
 * @param editorValues
 * @param isCreateView
 * @returns {boolean}
 */
const getDisabledState = (name, isUmbrellaEvent, hasUmbrellaEvent, event, superEventType, editorValues, isCreateView) => {
    const editedEventIsAnUmbrellaEvent = get(event, 'super_event_type') === constants.SUPER_EVENT_TYPE_UMBRELLA
    // todo: rename
    const isSuperEvent = get(event, 'super_event_type') === constants.SUPER_EVENT_TYPE_RECURRING
    const isSubEvent = !isUndefined(get(event, ['super_event', '@id']))
    const hasSubEvents = get(event, 'sub_events', []).length > 0

    if (name === 'is_umbrella') {
        if (isCreateView) {
            return hasUmbrellaEvent || Object.keys(editorValues.sub_events).length > 0
        } else {
            return hasUmbrellaEvent || (editedEventIsAnUmbrellaEvent && hasSubEvents) || isSuperEvent || isSubEvent
        }
    }
    if (name === 'has_umbrella') {
        if (isCreateView) {
            return isUmbrellaEvent
        } else {
            return isUmbrellaEvent || editedEventIsAnUmbrellaEvent || superEventType === constants.SUPER_EVENT_TYPE_RECURRING
        }
    }
}

const UmbrellaCheckbox = props => {
    const {
        name,
        handleCheck,
        intl,
        isUmbrellaEvent,
        hasUmbrellaEvent,
        event,
        superEventType,
        editorValues,
        isCreateView,
    } = props
    const checked = (name === 'is_umbrella' && isUmbrellaEvent) || (name === 'has_umbrella' && hasUmbrellaEvent)
    const tooltipTitle = intl.formatMessage({id: `event-${name.replace('_', '-')}-tooltip`})

    // todo: handle un-checking (e.g. when entering multiple dates in create)
    const disabled = getDisabledState(name, isUmbrellaEvent, hasUmbrellaEvent, event, superEventType, editorValues, isCreateView)

    // console.log('superEventType', superEventType)
    // console.log(`${name} disabled: ${disabled}`)

    const getCheckbox = () => (
        <Checkbox
            name={name}
            className="hel-checkbox"
            onChange={handleCheck}
            checked={checked}
            disabled={disabled}
        >
            {props.children}
        </Checkbox>
    )

    return (
        <React.Fragment>
            {
                disabled
                    ? <Tooltip title={tooltipTitle}>
                        <span>{getCheckbox()}</span>
                    </Tooltip>
                    : getCheckbox()
            }
        </React.Fragment>
    )
}

UmbrellaCheckbox.propTypes = {
    children: PropTypes.element,
    name: PropTypes.string,
    handleCheck: PropTypes.func,
    intl: PropTypes.object,
    isUmbrellaEvent: PropTypes.bool,
    hasUmbrellaEvent: PropTypes.bool,
    event: PropTypes.object,
    superEventType: PropTypes.oneOf([
        constants.SUPER_EVENT_TYPE_RECURRING,
        constants.SUPER_EVENT_TYPE_UMBRELLA,
    ]),
    editorValues: PropTypes.object,
    isCreateView: PropTypes.bool,
}

export default UmbrellaCheckbox
