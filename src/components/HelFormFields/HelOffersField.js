import React from 'react'

import { FormattedMessage, injectIntl } from 'react-intl'
import MultiLanguageField from './MultiLanguageField'
import HelCheckbox from './HelCheckbox'
import NewOffer from './NewOffer'
import './HelOffersField.scss'

import { RaisedButton } from 'material-ui'

import {connect} from 'react-redux'
import { addOffer, setOfferData, setFreeOffers } from 'src/actions/editor.js'


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
          isFree: true
      };
  }

    componentWillMount() {
        if (this.props.defaultValue && this.props.defaultValue.length) {
            this.setState({ values: this.props.defaultValue })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultValue && nextProps.defaultValue !== this.state.values) {
            this.setState({ values: nextProps.defaultValue })
        }
        if (nextProps.defaultValue && nextProps.defaultValue[0] && this.state.isFree !== nextProps.defaultValue[0].is_free) {
            this.setState({ isFree: nextProps.defaultValue[0].is_free })
        }
    }

    setIsFree(e, value) {
        if (!this.props.defaultValue || !this.props.defaultValue.length) {
            this.addNewOffer()
            this.context.dispatch(setOfferData({ '0': { is_free: !this.state.isFree } }, 0))
        } else {
            this.context.dispatch(setFreeOffers(!this.state.isFree))
        }
        this.setState({ isFree: !this.state.isFree })
    }

    addNewOffer() {
        const obj = {
            is_free: this.state.isFree
        }
        this.context.dispatch(addOffer(obj))
    }

    generateOffers() {
        const offers = []
        for (const key in this.props.defaultValue) {
            offers.push(
                <NewOffer
                    key={key}
                    offerKey={key}
                    defaultValue={this.props.defaultValue[key]}
                    validationErrors={this.props.validationErrors}
                    languages={this.props.languages}
                    isFree={this.state.isFree}
                />
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
                <HelCheckbox defaultChecked={this.state.isFree} ref="is_free" label={<FormattedMessage id="is-free"/>} onChange={(e,v) => this.setIsFree(e,v)} />
                <div className="offers">
                    { offerDetails }
                </div>
                <RaisedButton
                    style={buttonStyle}
                    primary={true}
                    disabled={this.state.isFree}
                    onClick={ () => this.addNewOffer() }
                    label={<span><i className="material-icons">add</i> <FormattedMessage id="event-add-price" /></span>} />
            </div>
        )
    }
}

export default HelOffersField
