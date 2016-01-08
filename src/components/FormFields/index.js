import React from 'react'

import { FormattedMessage, injectIntl } from 'react-intl'

import { DatePicker, TimePicker } from 'material-ui'

import TextField from 'formsy-material-ui/lib/FormsyText'
import Checkbox from 'formsy-material-ui/lib/FormsyCheckbox'

import ImageUpload from 'src/components/ImageUpload'
import CheckboxGroup from 'src/components/CheckboxGroup'
import { HelAutoComplete, MultiLanguageField, HelTextField, HelCheckboxGroup } from 'src/components/HelFormFields'

import API from 'src/api.js'

import {connect} from 'react-redux'

let helMainOptions = API.loadHelMainOptions();
let helTargetOptions = API.loadHelTargetOptions();
let helEventLangOptions = API.loadHelEventLangOptions();

let FormHeader = (props) => (
    <div className="row">
        <legend className="col-xs-12">{ props.children }</legend>
    </div>
)

let SideField = (props) => (
    <div className="side-field col-xs-5 col-sm-push-1">
        { props.children }
    </div>
)

class FormFields extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            languages: ['fi']
        }
    }

    render() {
        let defaultValidationErrors = {
            'isUrl': this.props.intl.formatMessage({id: 'validation-url-error'})
        }

        return (
            <div>
                <div className="col-xs-12 highlighted-block">
                    <div className="col-xs-6">
                        <label>
                            <FormattedMessage id="event-presented-in-languages"/>
                        </label>
                    </div>
                    <div className="col-xs-6">
                        <div className="spread-evenly">
                            <CheckboxGroup options={API.eventInfoLanguages()} defaultSelected={['fi']} onChange={(array) => {this.setState({languages: array})}}/>
                        </div>
                    </div>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-description-fields-header"/>
                </FormHeader>

                <div className="row">
                    <div className="col-xs-6">
                        <MultiLanguageField fullWidth={true} required={true} multiLine={false} label="event-name" name="event-name" languages={this.state.languages} />
                        <MultiLanguageField fullWidth={true} required={true} multiLine={true} label="event-short-description" name="event-short-description" languages={this.state.languages} />
                        <MultiLanguageField fullWidth={true} required={true} multiLine={true} label="event-description" name="event-description" languages={this.state.languages} />
                        <MultiLanguageField fullWidth={true} required={true} multiLine={true} label="event-home-page" name="event-home-page" languages={this.state.languages} />
                    </div>
                    <SideField>
                        <label><FormattedMessage id="event-picture"/></label>
                        <ImageUpload name="event-image" />
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-datetime-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-xs-6">
                        <DatePicker fullWidth={true} DateTimeFormat={(Intl.DateTimeFormat || null)} locale="fi" name="event-starting-date" textFieldStyle={{ fontSize: '20px' }} floatingLabelText={<FormattedMessage id="event-starting-date"/>} />
                        <TimePicker fullWidth={true} DateTimeFormat={(Intl.DateTimeFormat || null)} format="24hr" locale="fi" name="event-starting-time" textFieldStyle={{ fontSize: '20px' }} floatingLabelText={<FormattedMessage id="event-starting-time"/>} />
                        <DatePicker fullWidth={true} DateTimeFormat={(Intl.DateTimeFormat || null)} locale="fi" name="event-ending-date" textFieldStyle={{ fontSize: '20px' }} floatingLabelText={<FormattedMessage id="event-ending-date"/>} />
                        <TimePicker fullWidth={true} DateTimeFormat={(Intl.DateTimeFormat || null)} format="24hr" locale="fi" name="event-ending-time" textFieldStyle={{ fontSize: '20px' }} floatingLabelText={<FormattedMessage id="event-ending-time"/>} />
                    </div>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-location-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-xs-6">
                        <HelAutoComplete fullWidth={true} />
                        <MultiLanguageField fullWidth={true} multiLine={true} label="event-location-additional-info" name="event-location-additional-info" languages={this.state.languages} />
                    </div>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-price-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-xs-6">
                        <Checkbox fullWidth={true} name="is-free" value="true" label={<FormattedMessage id="is-free"/>} />
                        <HelTextField fullWidth={true}  name="event-price" required={true} floatingLabelText={<FormattedMessage id="event-price"/>} />
                        <MultiLanguageField fullWidth={true}  multiLine={true} label="event-price-info" name="event-price-info" languages={this.state.languages} />
                        <HelTextField fullWidth={true}  name="event-purchase-link" floatingLabelText={<FormattedMessage id="event-purchase-link"/>} />
                    </div>
                    <SideField>
                        <p>Valitse onko tapahtumaan vapaa pääsy tai lisää tapahtuman hinta tekstimuodossa (esim. 5€/7€).</p>
                        <p>Voit lisätä lisätietoja tapahtuman lipunmyynnistä, paikkavarauksista jne.</p>
                        <p>Lisää myös mahdollinen linkki lipunmyyntiin.</p>
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-social-media-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-xs-6">
                        <HelTextField validations="isUrl" validationErrors={defaultValidationErrors} fullWidth={true} name="facebook-url" floatingLabelText={<FormattedMessage id="facebook-url"/>} />
                        <HelTextField validations="isUrl" validationErrors={defaultValidationErrors} fullWidth={true} name="twitter-url" floatingLabelText={<FormattedMessage id="twitter-url"/>} />
                        <HelTextField validations="isUrl" validationErrors={defaultValidationErrors} fullWidth={true} name="instagram-url" floatingLabelText={<FormattedMessage id="instagram-url"/>} />
                    </div>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-categorization" />
                </FormHeader>
                <div className="row">
                    <HelCheckboxGroup groupLabel={<FormattedMessage id="hel-main-categories"/>}
                                    name="hel-main-categories"
                                    itemClassName="col-xs-6"
                                    options={helMainOptions} />
                    <HelCheckboxGroup groupLabel={<FormattedMessage id="target-groups"/>}
                                    name="hel-target-groups"
                                    itemClassName="col-xs-6"
                                    options={helTargetOptions} />
                    <HelCheckboxGroup groupLabel={<FormattedMessage id="event-languages"/>}
                                    name="event-languages"
                                    itemClassName="col-xs-6"
                                    options={helEventLangOptions} />
                </div>
            </div>
        )
    }
}

// Inject dispatch and intl into props
export default connect()(injectIntl(FormFields))
