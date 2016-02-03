import React from 'react'

import { FormattedMessage, injectIntl } from 'react-intl'
import HelTextField from './HelTextField'

class MultiLanguageField extends React.Component {

    render() {
        let props = this.props
        // Set default language to fi if no languages are selected
        let langs = props.languages

        if(langs.length === 0) {
            langs = ['fi']
        }

        let textInputs = []

        if(langs.length === 1) {
            let label = props.intl.formatMessage({id: props.label}) + ' (' + props.intl.formatMessage({id: `in-${langs[0]}`}) + ')'
            return (<div key={`${props.name}_${langs[0]}`}><HelTextField {...props} label={label} name={`${props.name}_${langs[0]}`}/></div>)
        } else {
            textInputs = langs.map((lang, index) => (
                <div key={`${props.name}_${lang}`}><HelTextField {...props} label={props.intl.formatMessage({id: `in-${lang}`})} name={`${props.name}_${lang}`}/></div>
            ))
        }

        return (
            <div className="multi-field">
                <div className="indented">
                <label><FormattedMessage id={`${props.label}`} /></label>
                    {textInputs}
                </div>
            </div>
        )
    }

}

export default injectIntl(MultiLanguageField)
