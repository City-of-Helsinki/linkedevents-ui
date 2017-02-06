import React from 'react'

import { FormattedMessage, injectIntl } from 'react-intl'
import MultiLanguageField from './MultiLanguageField'
import HelCheckbox from './HelCheckbox'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

import ValidationPopover from 'src/components/ValidationPopover'

class HelOffersField extends React.Component {

    static contextTypes = {
        intl: React.PropTypes.object,
        dispatch: React.PropTypes.func
    };

    onBlur(e) {
        if(this.props.name) {
            if(this.noValidationErrors()) {
                let obj = {}
                obj[this.props.name] = this.getValue()

                this.context.dispatch(setData(obj))
            }
        }
    }

    // Creates database 'offers' object from inputs
    getValue() {
        // Unwrap connect and injectIntl
        let pairs = _.map(this.refs, (ref, key) => ({
            key: key,
            value: ref.getValue()
        }))

        let obj = {}
        pairs.forEach(i => {
            obj[i.key] = i.value
        })

        if(obj.is_free == true) {
            obj = _.omit(obj, ['price', 'description']);
        }

        return [obj]
    }

    noValidationErrors() {
        let noErrors = _.map(this.refs, (ref, key) =>
            (ref.noValidationErrors())
        )

        let actualErrors = _.filter(noErrors, i => (i === false))

        if(actualErrors.length > 0) {
            return false
        }

        return true
    }

    setIsFree(e, value) {
        this.onBlur()
    }

    componentDidMount() {
        this.onBlur()
    }

    render() {
        let values = {}
        if(this.props.defaultValue && this.props.defaultValue.length) {
            values = this.props.defaultValue[0]
        }

        let free = true

        if(_.isBoolean(values.is_free)) {
            free = values.is_free
        }

        return (
            <div className="offers">
                <MultiLanguageField defaultValue={values.info_url} ref="info_url" label="event-purchase-link" languages={this.props.languages} onBlur={e => this.onBlur(e)} validations={['isUrl']}  />
                <HelCheckbox defaultChecked={free} ref="is_free" label={<FormattedMessage id="is-free"/>} onChange={(e,v) => this.setIsFree(e,v)} />
                <MultiLanguageField defaultValue={values.price} disabled={free} ref="price" label="event-price" languages={this.props.languages} onBlur={e => this.onBlur(e)} />
                <MultiLanguageField defaultValue={values.description} disabled={free} ref="description" label="event-price-info" languages={this.props.languages} multiLine={true} onBlur={e => this.onBlur(e)} />
            </div>
        )
    }
}

export default HelOffersField
