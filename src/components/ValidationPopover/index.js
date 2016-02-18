import React from 'react'
import Popover from 'react-bootstrap/lib/Popover'
import "./index.scss";

export default (props) => {
    let errorMsg = null

    if(props.validationErrors && props.validationErrors[0]) {
        errorMsg = props.validationErrors[0]
    }
    else {
        return (<span></span>)
    }

    return (
        <Popover className="validation-error-popover" id="validation" {...props}>
              { errorMsg }
        </Popover>
    )
}
