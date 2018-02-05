import PropTypes from 'prop-types';
import React from 'react'

import { FormattedMessage, injectIntl } from 'react-intl'
import MultiLanguageField from './MultiLanguageField'
import HelCheckbox from './HelCheckbox'
import NewOffer from './NewOffer'
import './HelOffersField.scss'

import { Button } from 'material-ui'

import {connect} from 'react-redux'
import { addOffer, setOfferData, setFreeOffers } from 'src/actions/editor.js'


import ValidationPopover from 'src/components/ValidationPopover'

class HelOffersField extends React.Component {

    static contextTypes = {
        intl: PropTypes.object,
        dispatch: PropTypes.func
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

    generateOffers(offers) {
        const newOffers = []
        for (const key in offers) {
            if (offers.hasOwnProperty(key) && !this.state.isFree) {
                newOffers.push(
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
        }
        return newOffers
    }

    render() {
        let buttonStyle = {
            height: '64px',
            width: '100%',
            margin: '10px 5px',
            display: 'block'
        }
        const offerDetails = this.generateOffers(this.props.defaultValue)

        return (
            <div className="offers-field">
                <HelCheckbox defaultChecked={this.state.isFree} ref="is_free" label={<FormattedMessage id="is-free"/>} onChange={(e,v) => this.setIsFree(e,v)} />
                <div className="offers">
                    { offerDetails }
                </div>
                <Button
                    raised
                    style={buttonStyle}
                    color="primary"
                    disabled={this.state.isFree}
                    onClick={ () => this.addNewOffer() }>
                    <FormattedMessage id="event-add-price" />
                </Button>
            </div>
        )
    }
}

export default HelOffersField