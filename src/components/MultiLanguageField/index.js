import React from 'react'

import {FormattedMessage} from 'react-intl'
import TextField from 'node_modules/material-ui-with-sass/src/js/text-field.jsx'

let MultiLanguageField = (props) => {
    let textInputs = props.languages.map((lang) => (
        <TextField {...props} floatingLabelText={<FormattedMessage id={`in-${lang}`}/>} name={`${props.namePrefix}_${lang}`}/>
    ))

    return (
        <div className="multi-language-field">
            <div className="indented">
            <label><FormattedMessage id={`${props.label}`} /></label>
                {textInputs}
            </div>
        </div>
    )
}

export default MultiLanguageField
