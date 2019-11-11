import PropTypes from 'prop-types'
import React from 'react'
import {Checkbox} from 'react-bootstrap'
import Tooltip from 'material-ui/Tooltip'

const UmbrellaCheckbox = props => {
    const {intl, name, checked, disabled, handleCheck} = props
    const tooltipTitle = intl.formatMessage({id: `event-${name.replace('_', '-')}-tooltip`})

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
    intl: PropTypes.object,
    name: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    handleCheck: PropTypes.func,
}

export default UmbrellaCheckbox
