import React from 'react'

import { FormattedMessage, injectIntl } from 'react-intl'
import FormsyText from 'formsy-material-ui/lib/FormsyText'

let MultiLanguageField = (props) => {

    // Set default language to fi if no languages are selected
    let langs = props.languages

    if(langs.length === 0) {
        langs = ['fi']
    }

    let textInputs = []

    if(langs.length === 1) {
        // NOTE: import {injectIntl} from 'react-intl' to use the next line
        let label = props.intl.formatMessage({id: props.label}) + ' (' + props.intl.formatMessage({id: `in-${langs[0]}`}) + ')'
        //let label = (<span><FormattedMessage id={props.label} /> (<FormattedMessage id={`in-${langs[0]}`}/>)</span>)
        return (<FormsyText {...props} floatingLabelText={label} name={`${props.namePrefix}_${langs[0]}`}/>)
    } else {
        textInputs = langs.map((lang, index) => (
            <div><FormsyText {...props} key={index} floatingLabelText={props.intl.formatMessage({id: `in-${lang}`})} name={`${props.namePrefix}_${lang}`}/></div>
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

export default injectIntl(MultiLanguageField)
