import React from 'react'

import { FormattedMessage, injectIntl } from 'react-intl'

import ImageUpload from 'src/components/ImageUpload'
import {
    HelAutoComplete,
    MultiLanguageField,
    HelTextField,
    HelLabeledCheckboxGroup,
    HelLanguageSelect,
    HelDatePicker,
    HelTimePicker,
    HelCheckbox
} from 'src/components/HelFormFields'

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

        let languages = this.props.editor.values['presentation-languages'] || ['fi']

        this.state = {
            languages: languages
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
                            <HelLanguageSelect name="presentation-languages" options={API.eventInfoLanguages()} defaultSelected={this.state.languages} onChange={(array) => {this.setState({languages: array})}}/>
                        </div>
                    </div>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-description-fields-header"/>
                </FormHeader>

                <div className="row">
                    <div className="col-xs-6">
                        <MultiLanguageField fullWidth={true} required={true} multiLine={false} label="event-headline" name="headline" languages={this.state.languages} />
                        <MultiLanguageField fullWidth={true} required={true} multiLine={true} label="event-short-description" name="short_description" languages={this.state.languages} />
                        <MultiLanguageField fullWidth={true} required={true} multiLine={true} label="event-description" name="description" languages={this.state.languages} />
                        <MultiLanguageField fullWidth={true} required={true} multiLine={true} label="event-info-url" name="info_url" languages={this.state.languages} />
                    </div>
                    <SideField>
                        <label><FormattedMessage id="event-picture"/></label>
                        <ImageUpload name="image" />
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-datetime-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-xs-6">
                        <HelDatePicker fullWidth={true} DateTimeFormat={(Intl.DateTimeFormat || null)} locale="fi" name="starting_date" textFieldStyle={{ fontSize: '20px' }} floatingLabelText={<FormattedMessage id="event-starting-date"/>} />
                        <HelTimePicker fullWidth={true} DateTimeFormat={(Intl.DateTimeFormat || null)} format="24hr" locale="fi" name="starting_time" textFieldStyle={{ fontSize: '20px' }} floatingLabelText={<FormattedMessage id="event-starting-time"/>} />
                        <HelDatePicker fullWidth={true} DateTimeFormat={(Intl.DateTimeFormat || null)} locale="fi" name="ending_date" textFieldStyle={{ fontSize: '20px' }} floatingLabelText={<FormattedMessage id="event-ending-date"/>} />
                        <HelTimePicker fullWidth={true} DateTimeFormat={(Intl.DateTimeFormat || null)} format="24hr" locale="fi" name="ending_time" textFieldStyle={{ fontSize: '20px' }} floatingLabelText={<FormattedMessage id="event-ending-time"/>} />
                    </div>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-location-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-xs-6">
                        <HelAutoComplete required={true} fullWidth={true} name="location_id" />
                        <MultiLanguageField fullWidth={true} multiLine={true} label="event-location-additional-info" name="location_extra_info" languages={this.state.languages} />
                    </div>
                    <SideField>
                        <p>Aloita kirjoittamaan kenttään tapahtumapaikan nimen alkua ja valitse oikea paikka alle ilmestyvästä listasta. Jos et löydä paikkaa tällä tavoin, kirjoita tapahtumapaikka tai osoite lisätietokenttään.</p>
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-price-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-xs-6">
                        <HelCheckbox fullWidth={true} name="offers_is_free" label={<FormattedMessage id="is-free"/>} />
                        <MultiLanguageField fullWidth={true} name="offers_price" required={true} label="event-price" languages={this.state.languages} />
                        <MultiLanguageField fullWidth={true} multiLine={true} label="event-price-info" name="offers_description" languages={this.state.languages} />
                        <MultiLanguageField fullWidth={true}  name="offers_info_url" label="event-purchase-link" languages={this.state.languages} />
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
                        <HelTextField validations="isUrl" validationErrors={defaultValidationErrors} fullWidth={true} name="extlink_facebook" floatingLabelText={<FormattedMessage id="facebook-url"/>} />
                        <HelTextField validations="isUrl" validationErrors={defaultValidationErrors} fullWidth={true} name="extlink_twitter" floatingLabelText={<FormattedMessage id="twitter-url"/>} />
                        <HelTextField validations="isUrl" validationErrors={defaultValidationErrors} fullWidth={true} name="extlink_instagram" floatingLabelText={<FormattedMessage id="instagram-url"/>} />
                    </div>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-categorization" />
                </FormHeader>
                <div className="row">
                    <HelLabeledCheckboxGroup groupLabel={<FormattedMessage id="hel-main-categories"/>}
                                    name="hel_main"
                                    itemClassName="col-xs-6"
                                    options={helMainOptions} />
                    <HelLabeledCheckboxGroup groupLabel={<FormattedMessage id="hel-target-groups"/>}
                                    name="hel_target"
                                    itemClassName="col-xs-6"
                                    options={helTargetOptions} />
                    <HelLabeledCheckboxGroup groupLabel={<FormattedMessage id="hel-event-languages"/>}
                                    name="hel_event_lang"
                                    itemClassName="col-xs-6"
                                    options={helEventLangOptions} />
                </div>
            </div>
        )
    }
}

// Inject dispatch and intl into props
export default connect((state) => ({
    editor: state.editor
}))(injectIntl(FormFields))
