import './index.scss';
import React from 'react'
import {Popper} from '@material-ui/core'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'
import {getCharacterLimitByRule} from '../../utils/helpers'
import {HelTheme} from '../../themes/hel/material-ui'

const ValidationPopover =  ({
    validationErrors,
    anchor,
    placement = 'right-end',
    index,
    inModal = false,
}) => {
    let errorMsg = null

    if(validationErrors && validationErrors[0]) {
        let errorText = null
        let textLimit = null
        if (typeof validationErrors[0] === 'object') {
            for (const object in validationErrors[0]) {
                if (validationErrors[0][object].key === index) {
                    errorText = `validation-${validationErrors[0][object].validation}`

                    // check if validation is text limiter
                    textLimit = getCharacterLimitByRule(validationErrors[0][object].validation)
                    if(textLimit) {
                        errorText = `validation-stringLimitReached`
                    }
                }
            }
        } else {
            errorText = `validation-${validationErrors[0]}`
            textLimit = getCharacterLimitByRule(validationErrors[0])
            if(textLimit) {
                errorText = `validation-stringLimitReached`
            }
        }
        if (errorText === null) {
            return (<React.Fragment />)
        }
        errorMsg = (<FormattedMessage className="msg" id={errorText} values={{limit: textLimit}}/>)
    } else {
        return (<React.Fragment />)
    }

    return (
        <React.Fragment>
            {anchor
                ? <Popper
                    open
                    className={`validation-popper ${inModal ? 'modal-popper' : ''}`}
                    anchorEl={anchor}
                    placement={placement}
                    modifiers={{
                        flip: {
                            behavior: ['right', 'bottom'],
                        },
                        offset: {
                            offset: `0 ${HelTheme.spacing(3)} 0 0`,
                        },
                    }}
                >
                    { errorMsg }
                </Popper>
                : <React.Fragment />
            }
        </React.Fragment>
    )
}

ValidationPopover.propTypes = {
    validationErrors: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    anchor: PropTypes.object,
    index: PropTypes.string,
    placement: PropTypes.string,
    inModal: PropTypes.bool,
}

export default ValidationPopover
