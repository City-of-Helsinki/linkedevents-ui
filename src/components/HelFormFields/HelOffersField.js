import React from 'react'

import { FormattedMessage, injectIntl } from 'react-intl'
import MultiLanguageField from './MultiLanguageField'
import HelCheckbox from './HelCheckbox'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

class HelOffersField extends React.Component {

    constructor(props) {
        super(props)

        let defaultValue = {}
        let free = true

        if(props.editor.values[props.name] && props.editor.values[props.name].length > 0) {
            defaultValue = props.editor.values[props.name][0]
            free = defaultValue.is_free
        }

        this.state = {
            free: free,
            value: defaultValue
        }
    }

    onBlur(e,value,lang) {
        if(this.props.name) {
            if(this.noValidationErrors()) {
                let obj = {}
                obj[this.props.name] = this.getValue()
                this.setState({value: obj})

                this.props.dispatch(setData(obj))
            }
        }
    }

    // Creates database 'offers' object from inputs
    getValue() {
        // Unwrap connect and injectIntl
        let pairs = _.map(this.refs, (ref, key) => ({
            key: key,
            value: ref.getWrappedInstance().refs.wrappedElement.getValue()
        }))

        let obj = {}
        pairs.forEach(i => {
            obj[i.key] = i.value
        })

        return [obj]
    }

    noValidationErrors() {
        let noValidationErrors = _.map(this.refs, (ref, key) =>
            (ref.getWrappedInstance().refs.wrappedElement.noValidationErrors())
        )

        let actualErrors = _.filter(noValidationErrors, i => (i === false))

        if(actualErrors.length > 0) {
            return false
        }

        return true
    }

    setIsFree(e, value) {
        this.setState({free: value})
        this.onBlur()
    }


    render() {
        return (
            <div className="offers">
                <MultiLanguageField defaultValue={this.state.value.info_url} ref="info_url" label="event-purchase-link" languages={this.props.languages} onBlur={e => this.onBlur(e)} validations={['isUrl']}  />
                <HelCheckbox defaultValue={this.state.free} ref="is_free" label={<FormattedMessage id="is-free"/>} onChange={(e,v) => this.setIsFree(e,v)} />
                <MultiLanguageField defaultValue={this.state.value.price} disabled={this.state.free} ref="price" label="event-price" languages={this.props.languages} onBlur={e => this.onBlur(e)} />
                <MultiLanguageField defaultValue={this.state.value.description} disabled={this.state.free} ref="description" label="event-price-info" languages={this.props.languages} multiLine={true} onBlur={e => this.onBlur(e)} />
            </div>
        )
    }

}

export default connect((state) => ({
    editor: state.editor
}))(injectIntl(HelOffersField))
