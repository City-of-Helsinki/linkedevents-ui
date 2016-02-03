import React from 'react'

import { FormattedMessage, injectIntl } from 'react-intl'
import HelTextField from './HelTextField'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

// A text component for multiple language inputs. Outputs linked events language field format
// field = {
//     fi: 'nimi',
//     sv: 'namn',
//     en: 'name'
// }

class MultiLanguageField extends React.Component {

    constructor(props) {
        super(props)

        let defaultValue = props.editor.values[this.props.name] || {}
        this.state = {
            value: defaultValue
        }
    }

    onChange(e,value,lang) {
        if(this.props.name) {
            let obj = {}
            obj[this.props.name] = this.getValue()
            if(this.noValidationErrors()) {
                this.setState({value: obj})
                this.props.dispatch(setData(obj))
            }
        }
    }

    getValue() {
        // Unwrap connect and injectIntl
        let elems = _.map(this.refs, (ref,key) => ({ref: ref.getWrappedInstance().refs.wrappedElement, lang: key}))

        let langs = elems.map(elem => elem.lang)
        let values = elems.map(elem => elem.ref.getValue())

        let valueObj = _.zipObject(langs, values);

        return valueObj
    }

    noValidationErrors() {
        let elems = _.map(this.refs, ref => ref.getWrappedInstance().refs.wrappedElement)
        let errors = elems.map(elem => elem.getValidationErrors().length)
        errors = errors.filter(errorCount => (errorCount > 0))

        return (errors.length === 0)
    }

    render() {
        let props = this.props
        // Set default language to fi if no languages are selected
        let langs = props.languages

        if(langs.length === 0) {
            langs = ['fi']
        }

        let textInputs = []

        let defaultValue = props.editor.values[this.props.name] || {}

        if(langs.length === 1) {
            let label = props.intl.formatMessage({id: props.label}) + ' (' + props.intl.formatMessage({id: `in-${langs[0]}`}) + ')'
            return (<div key={`${props.name}_${langs[0]}`}><HelTextField required={this.props.required} defaultValue={defaultValue[langs[0]]} label={label} ref={langs[0]} onChange={(e,v) => this.onChange(e,v,langs[0])}/></div>)
        } else {
            textInputs = langs.map((lang, index) => {
                let value = defaultValue[lang] || ''
                return (
                    <div key={`${props.name}_${lang}`}>
                        <HelTextField required={this.props.required} defaultValue={value} ref={lang} label={props.intl.formatMessage({id: `in-${lang}`})} onChange={(e,v) => this.onChange(e,v,lang)}/>
                    </div>
                )
            })
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

export default connect((state) => ({
    editor: state.editor
}))(injectIntl(MultiLanguageField))
