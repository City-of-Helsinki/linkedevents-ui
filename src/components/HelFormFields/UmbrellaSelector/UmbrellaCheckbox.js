import PropTypes from 'prop-types'
import React from 'react'
import {FormControlLabel, Checkbox, Tooltip} from '@material-ui/core'

const UmbrellaCheckbox = props => {
    const {intl, name, checked, disabled, handleCheck} = props
    const tooltipTitle = intl.formatMessage({id: `event-${name.replace('_', '-')}-tooltip`})

    const getCheckbox = () => (
        <FormControlLabel
            control={
                <Checkbox
                    color="primary"
                    size="small"
                    name={name}
                    onChange={handleCheck}
                    checked={checked}
                    disabled={disabled}
                />
            }
            label={props.children}
        />
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
