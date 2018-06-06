import PropTypes from 'prop-types';
import React from 'react'
import {Button} from 'material-ui'

import MultiLanguageField from 'src/components/HelFormFields/MultiLanguageField'
import ValidationPopover from 'src/components/ValidationPopover'
import {setOfferData, deleteOffer} from 'src/actions/editor'

import Delete from 'material-ui-icons/Delete'
import {FormattedMessage} from 'react-intl'

import CONSTANTS from '../../constants'

class NewOffer extends React.Component {
    static contextTypes = {
        dispatch: PropTypes.func,
    };

    static propTypes = {
        validationErrors: PropTypes.array,
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isFree !== this.props.isFree) {
            this.onBlur()
        }
    }

    onBlur(e) {
        if(this.props.offerKey) {
        //            if(this.noValidationErrors()) {
            let obj = {}
            obj[this.props.offerKey] = this.buildObject()
            this.context.dispatch(setOfferData(obj, this.props.offerKey))
        //            }
        }
    }

    deleteOffer() {
        this.context.dispatch(deleteOffer(this.props.offerKey))
    }

    // Creates database 'offers' object from inputs
    buildObject() {
        let obj = {}
        obj['is_free'] = this.props.isFree
        // Unwrap connect and injectIntl
        const pairs = _.map(this.refs, (ref, key) => ({
            key: key,
            value: ref.getValue(),
        }))
        for (const key in this.props.defaultValue) {
            pairs.forEach((pair) => {
                obj[pair.key] = pair.value
            })
            if(obj.is_free == true) {
                obj = _.omit(obj, ['price', 'description']);
            }
        }
        return obj
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

    render() {
        const {offerKey, defaultValue, isFree, languages} = this.props
        const {VALIDATION_RULES} = CONSTANTS

        // TODO: Remove this buttonStyles inline
        const buttonStyles = {
            width: '42px',
            minWidth: '42px',
            height: '36px',
            position: 'absolute',
            left: '-55px',
            top: '0',
        }
        return (
            <div key={offerKey} className="offer-fields" style={{'position': 'relative'}}>
                <label style={{position: 'relative'}}><ValidationPopover validationErrors={this.props.validationErrors} /></label>
                <MultiLanguageField 
                    defaultValue={defaultValue.price} 
                    disabled={isFree} 
                    ref="price" 
                    label="event-price" 
                    languages={languages} 
                    onBlur={e => this.onBlur(e)} 
                    validationErrors={this.props.validationErrors['price']} 
                    index={this.props.offerKey} 
                    required={true} 
                />

                <MultiLanguageField 
                    defaultValue={defaultValue.info_url} 
                    ref="info_url" 
                    label="event-purchase-link" 
                    languages={languages} 
                    onBlur={e => this.onBlur(e)} validations={VALIDATION_RULES.IS_URL} 
                    validationErrors={this.props.validationErrors['info_url']} 
                    index={this.props.offerKey}
                />

                <MultiLanguageField 
                    defaultValue={defaultValue.description} 
                    disabled={isFree} 
                    ref="description" 
                    label="event-price-info" 
                    languages={languages} 
                    multiLine={true} 
                    onBlur={e => this.onBlur(e)} 
                    validationErrors={this.props.validationErrors['offer_description']} 
                    index={this.props.offerKey} 
                />

                <Button
                    raised
                    onClick={() => this.deleteOffer()}
                    style={buttonStyles}><Delete/>
                </Button>
            </div>
        )
    }
}

NewOffer.propTypes = {
    isFree: PropTypes.bool,
    languages: PropTypes.array,
    offerKey: PropTypes.string.isRequired,
    defaultValue: PropTypes.object,
}

export default NewOffer;
