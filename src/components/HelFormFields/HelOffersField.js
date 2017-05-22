import React from 'react'

import { FormattedMessage, injectIntl } from 'react-intl'
import MultiLanguageField from './MultiLanguageField'
import HelCheckbox from './HelCheckbox'
import './HelOffersField.scss'

import { RaisedButton } from 'material-ui'

import {connect} from 'react-redux'
import {setData, addOfferData} from 'src/actions/editor.js'

import ValidationPopover from 'src/components/ValidationPopover'

class HelOffersField extends React.Component {

    static contextTypes = {
        intl: React.PropTypes.object,
        dispatch: React.PropTypes.func
    };

    constructor(props) {
      super(props);
      this.state = {
          values: this.props.defaultValue,
          freeEvent: false
      };
    }

    componentWillMount() {
        if (this.props.defaultValue && this.props.defaultValue.length) {
            this.setState({ values: this.props.defaultValue })
        }
        if (this.props.defaultValue && _.isBoolean(this.props.defaultValue[0].is_free)) {
            this.setState({ freeEvent: this.props.defaultValue[0].is_free })
        }
    }

    componentDidMount() {
        this.onBlur()
    }

    setIsFree(e, value) {
        this.setState({ freeEvent: !this.state.freeEvent })
        this.onBlur()
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
        const offerObjects = []
        // Unwrap connect and injectIntl
        const pairs = _.map(this.refs, (ref, key) => ({
            key: key,
            value: ref.getValue()
        }))

        for (const key in this.props.defaultValue) {
            let obj = {}
            pairs.forEach((pair) => {
                if (pair.key === 'is_free') {
                    obj[pair.key] = pair.value
                } else if (pair.key.split('-')[1] === key) {
                    obj[pair.key.split('-')[0]] = pair.value
                }
            })

            if(obj.is_free == true) {
                obj = _.omit(obj, ['price', 'description']);
            }
            offerObjects.push(obj)
        }

        return offerObjects
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

    addNewOffer() {
        const obj = {
            is_free: false
        }
        this.context.dispatch(addOfferData(obj))
    }

    generateOffers() {
        const offers = []
        for (const key in this.props.defaultValue) {
            offers.push(
                <div key={key} className="offer-fields">
                    <MultiLanguageField defaultValue={this.props.defaultValue[key].info_url} ref={`info_url-${key}`} label="event-purchase-link" languages={this.props.languages} onBlur={e => this.onBlur(e)} validations={['isUrl']}  />
                    <MultiLanguageField defaultValue={this.props.defaultValue[key].price} disabled={this.state.freeEvent} ref={`price-${key}`} label="event-price" languages={this.props.languages} onBlur={e => this.onBlur(e)} />
                    <MultiLanguageField defaultValue={this.props.defaultValue[key].description} disabled={this.state.freeEvent} ref={`description-${key}`} label="event-price-info" languages={this.props.languages} multiLine={true} onBlur={e => this.onBlur(e)} />
                </div>
            )
        }
        return offers
    }

    render() {
        let buttonStyle = {
            height: '64px',
            margin: '10px 5px',
            display: 'block'
        }
        const offerDetails = this.generateOffers()

        return (
            <div className="offers-field">
                <HelCheckbox defaultChecked={this.state.freeEvent} ref="is_free" label={<FormattedMessage id="is-free"/>} onChange={(e,v) => this.setIsFree(e,v)} />
                <div className="offers">
                    { offerDetails }
                </div>
                <RaisedButton
                    style={buttonStyle}
                    primary={true}
                    disabled={this.state.freeEvent}
                    onClick={ () => this.addNewOffer() }
                    label={<span><i className="material-icons">add</i> <FormattedMessage id="event-add-price" /></span>} />
            </div>
        )
    }
}

export default HelOffersField
