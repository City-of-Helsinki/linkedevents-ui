import React from 'react'

import { FormattedMessage, injectIntl } from 'react-intl'
import MultiLanguageField from './MultiLanguageField'
import HelCheckbox from './HelCheckbox'

import { RaisedButton } from 'material-ui'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

import ValidationPopover from 'src/components/ValidationPopover'

class HelOffersField extends React.Component {

    static contextTypes = {
        intl: React.PropTypes.object,
        dispatch: React.PropTypes.func
    };

    constructor(props) {
      super(props);
      this.state = {
          values: {},
          freeEvent: false
      };
    }

    componentWillMount() {
        if (this.props.defaultValue && this.props.defaultValue.length) {
            this.setState({ values: this.props.defaultValue[0] })
        }
        if (this.props.defaultValue && _.isBoolean(this.props.defaultValue[0].is_free)) {
            this.setState({ freeEvent: values.is_free })
        }
    }

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
        this.setState({ freeEvent: !this.state.freeEvent })
        this.onBlur()
    }

    componentDidMount() {
        this.onBlur()
    }

    generatePrices() {
        return (
            <div>
                <MultiLanguageField defaultValue={this.state.values.price} disabled={this.state.freeEvent} ref="price" label="event-price" languages={this.props.languages} onBlur={e => this.onBlur(e)} />
                <MultiLanguageField defaultValue={this.state.values.description} disabled={this.state.freeEvent} ref="description" label="event-price-info" languages={this.props.languages} multiLine={true} onBlur={e => this.onBlur(e)} />
            </div>
        )
    }

    render() {
        let buttonStyle = {
            height: '64px',
            margin: '10px 5px',
            display: 'block'
        }
        const priceDetails = this.generatePrices()

        return (
            <div className="offers">
                <MultiLanguageField defaultValue={this.state.values.info_url} ref="info_url" label="event-purchase-link" languages={this.props.languages} onBlur={e => this.onBlur(e)} validations={['isUrl']}  />
                <HelCheckbox defaultChecked={this.state.freeEvent} ref="is_free" label={<FormattedMessage id="is-free"/>} onChange={(e,v) => this.setIsFree(e,v)} />
                { priceDetails }
                <RaisedButton
                    style={buttonStyle}
                    primary={true}
                    disabled={this.state.freeEvent}
                    onClick={ () => null }
                    label={<span><i className="material-icons">add</i> <FormattedMessage id="event-add-price" /></span>} />
            </div>
        )
    }
}

export default HelOffersField
