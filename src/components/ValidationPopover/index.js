import React from 'react'
import {Popover} from 'react-bootstrap'
import './index.scss';
import PropTypes from 'prop-types'

import {FormattedMessage} from 'react-intl'

import {getCharacterLimitByRule} from '../../utils/helpers'

const ValidationPopover =  ({validationErrors, index, small, ...rest}) => {
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
            return (<span></span>)
        }
        errorMsg = (<FormattedMessage className="msg" id={errorText} values={{limit: textLimit}}/>)
    } else {
        return (<span></span>)
    }

    let classNames = 'validation-error-popover'
    if(small) {
        classNames += ' small'
    }

    return (
        <Popover className={classNames} id="validation" {...rest}>
            { errorMsg }
        </Popover>
    )
}

ValidationPopover.propTypes = {
    validationErrors: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    index: PropTypes.string,
    small: PropTypes.bool,
}

export default ValidationPopover
