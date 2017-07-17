import React from 'react'
import { RaisedButton } from 'material-ui'

import MultiLanguageField from 'src/components/HelFormFields/MultiLanguageField.js'
import ValidationPopover from 'src/components/ValidationPopover'
import { setOfferData, deleteOffer } from 'src/actions/editor.js'


class NewOffer extends React.Component {
    static contextTypes = {
        dispatch: React.PropTypes.func
    };

    componentDidUpdate(prevProps) {
        if (prevProps.isFree !== this.props.isFree) {
            this.onBlur()
        }
    }

    onBlur(e) {
        if(this.props.offerKey) {
            if(this.noValidationErrors()) {
                let obj = {}
                obj[this.props.offerKey] = this.buildObject()
                this.context.dispatch(setOfferData(obj, this.props.offerKey))
            }
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
            value: ref.getValue()
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
        const { offerKey, defaultValue, isFree, languages } = this.props
        const buttonStyles = {
            width: "42px",
            minWidth: "42px",
            height: "36px",
            position: "absolute",
            left: "-55px",
            top: "0"
        }
        return (
            <div key={offerKey} className="offer-fields" style={{'position': 'relative'}}>
                <MultiLanguageField defaultValue={defaultValue.info_url} ref="info_url" label="event-purchase-link" languages={languages} onBlur={e => this.onBlur(e)} validations={['isUrl']}  />
                <MultiLanguageField defaultValue={defaultValue.price} disabled={isFree} ref="price" label="event-price" languages={languages} onBlur={e => this.onBlur(e)} validationErrors={this.props.validationErrors['price']} index={this.props.offerKey} />
                <MultiLanguageField defaultValue={defaultValue.description} disabled={isFree} ref="description" label="event-price-info" languages={languages} multiLine={true} onBlur={e => this.onBlur(e)} validationErrors={this.props.validationErrors['offer_description']} index={this.props.offerKey} />
                <RaisedButton
                    onClick={() => this.deleteOffer()}
                    style={buttonStyles}
                    label={<span className="center-delete"><i className="material-icons">delete</i></span>}
                />
            </div>
        )
    }
};

NewOffer.propTypes = {
    isFree: React.PropTypes.bool,
    languages: React.PropTypes.array,
    offerKey: React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.object
}

export default NewOffer;
