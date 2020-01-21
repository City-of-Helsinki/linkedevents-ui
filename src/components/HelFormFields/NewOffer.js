import './NewOffer.scss'
import PropTypes from 'prop-types';
import React from 'react'

import MultiLanguageField from 'src/components/HelFormFields/MultiLanguageField'
import {setOfferData, deleteOffer} from 'src/actions/editor'
import {IconButton, withStyles} from '@material-ui/core'
import {Delete} from '@material-ui/icons'
import CONSTANTS from '../../constants'

const DeleteButton = withStyles(theme => ({
    root: {
        left: 0,
        position: 'absolute',
        top: 0,
        transform: `translate(calc(-1.2em - ${theme.spacing(3)}px), ${theme.spacing(4)}px)`,
        '& svg': {
            height: '1.2em',
            width: '1.2em',
        },
    },
}))(IconButton)

class NewOffer extends React.Component {
    static contextTypes = {
        dispatch: PropTypes.func,
    };

    static propTypes = {
        validationErrors: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object,
        ]),
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
            top: '2rem',
        }
        return (
            <div key={offerKey} className="new-offer">
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
                    onBlur={e => this.onBlur(e)}
                    validations={[VALIDATION_RULES.IS_URL]}
                    validationErrors={this.props.validationErrors['offer_info_url']}
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

                <DeleteButton
                    color="secondary"
                    onClick={() => this.deleteOffer()}
                >
                    <Delete/>
                </DeleteButton>
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
