import React from 'react'
import {Popover} from 'react-bootstrap'
import './index.scss';
import PropTypes from 'prop-types'

import {FormattedMessage} from 'react-intl'

const ValidationPopover =  (props) => {
    let errorMsg = null

    if(props.validationErrors && props.validationErrors[0]) {
        let errorText = null
        if (typeof props.validationErrors[0] === 'object') {
            for (const object in props.validationErrors[0]) {
                if (props.validationErrors[0][object].key === props.index) {
                    errorText = `validation-${props.validationErrors[0][object].validation}`
                }
            }
        } else {
            errorText = `validation-${props.validationErrors[0]}`
        }
        if (errorText === null) {
            return (<span></span>)
        }
        errorMsg = (<FormattedMessage className="msg" id={errorText}/>)
    } else {
        return (<span></span>)
    }

    let classNames = 'validation-error-popover'
    if(props.small) {
        classNames += ' small'
    }

    return (
        <Popover className={classNames} id="validation" {...props}>
            { errorMsg }
        </Popover>
    )
}

ValidationPopover.propTypes = {
    validationErrors: PropTypes.object,
    index: PropTypes.string,
    small: PropTypes.bool,
}

export default ValidationPopover
