import React from 'react'

import {FormattedMessage} from 'react-intl'
import TextField from 'node_modules/material-ui-with-sass/src/js/text-field.jsx'

let MultiLanguageField = (props) => {

    // Set default language to fi if no languages are selected
    let langs = props.languages

    if(langs.length === 0) {
        langs = ['fi']
    }

    let textInputs = []

    if(langs.length === 1) {
        let label = (<span><FormattedMessage id={`${props.label}`} /> (<FormattedMessage id={`in-${langs[0]}`}/>)</span>)
        return (<TextField {...props} floatingLabelText={label} name={`${props.namePrefix}_${langs[0]}`}/>)
    } else {
        textInputs = langs.map((lang, index) => (
            <TextField {...props} key={index} floatingLabelText={<FormattedMessage id={`in-${lang}`}/>} name={`${props.namePrefix}_${lang}`}/>
        ))
    }

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
