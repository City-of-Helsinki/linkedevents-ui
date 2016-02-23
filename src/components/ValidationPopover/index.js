import React from 'react'
import Popover from 'react-bootstrap/lib/Popover'
import "./index.scss";

import {FormattedMessage} from 'react-intl'

export default (props) => {
    let errorMsg = null

    if(props.validationErrors && props.validationErrors[0]) {
        errorMsg = `validation-${props.validationErrors[0]}`
        errorMsg = (<FormattedMessage id={errorMsg}/>)
    }
    else {
        return (<span></span>)
    }

    let classNames = 'validation-error-popover'
    if(props.small) {
        classNames += " small"
    }

    return (
        <Popover className={classNames} id="validation" {...props}>
              { errorMsg }
        </Popover>
    )
}
