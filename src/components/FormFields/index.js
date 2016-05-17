import React from 'react'

import { FormattedMessage, injectIntl } from 'react-intl'

import ImagePicker from 'src/components/ImagePicker'
import {
    HelAutoComplete,
    MultiLanguageField,
    HelTextField,
    HelLabeledCheckboxGroup,
    HelLanguageSelect,
    HelDateTimeField,
    HelSelect,
    HelOffersField
} from 'src/components/HelFormFields'


import {mapKeywordSetToForm, mapLanguagesSetToForm} from 'src/utils/apiDataMapping.js'

import API from 'src/api.js'

let FormHeader = (props) => (
    <div className="row">
        <legend className="col-sm-12">{ props.children }</legend>
    </div>
)

let SideField = (props) => (
    <div className="side-field col-sm-5 col-sm-push-1">
        { props.children }
    </div>
)

/*
let updateEventHidden = function(eventData) {
    return (
        <div>
            <Input
                type="hidden"
                name="data_source"
                value={eventData.data_source}
            />
            <Input
                type="hidden"
                name="publisher"
                value={eventData.publisher}
            />
            <Input
                type="hidden"
                name="id"
                value={eventData.id}
                />
        </div>
    )
};
 */

class FormFields extends React.Component {

    static contextTypes = {
        intl: React.PropTypes.object
    };

    componentWillReceiveProps() {
        this.forceUpdate()
    }

    shouldComponentUpdate() {
        return true
    }

    render() {
        let helMainOptions = mapKeywordSetToForm(this.props.editor.keywordSets, 'helfi:topics')
        let helTargetOptions = mapKeywordSetToForm(this.props.editor.keywordSets, 'helfi:audiences')
        let helEventLangOptions = mapLanguagesSetToForm(this.props.editor.languages)

        const { values, validationErrors, contentLanguages } = this.props.editor

        return (
            <div>
                <div className="col-sm-12 highlighted-block">
                    <div className="col-xl-4">
                        <label>
                            <FormattedMessage id="event-presented-in-languages"/>
                        </label>
                    </div>
                    <div className="col-xl-8">
                        <div className="spread-evenly">
                            <HelLanguageSelect options={API.eventInfoLanguages()} checked={contentLanguages} />
                        </div>
                    </div>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-description-fields-header"/>
                </FormHeader>

                <div className="row">
                    <div className="col-sm-6">
                        <MultiLanguageField required={true} multiLine={false} label="event-headline" ref="name" name="name" validationErrors={validationErrors["name"]} defaultValue={values["name"]} languages={this.props.editor.contentLanguages} />
                        <MultiLanguageField required={true} multiLine={true} label="event-short-description" ref="short_description" name="short_description" validationErrors={validationErrors["short_description"]} defaultValue={values["short_description"]} languages={this.props.editor.contentLanguages} validations={['shortString']} forceApplyToStore />
                        <MultiLanguageField required={true} multiLine={true} label="event-description" ref="description" name="description" validationErrors={validationErrors["description"]} defaultValue={values["description"]} languages={this.props.editor.contentLanguages} />
                        <MultiLanguageField required={false} multiLine={false} label="event-info-url" ref="info_url" name="info_url" validationErrors={validationErrors["info_url"]} defaultValue={values["info_url"]} languages={this.props.editor.contentLanguages} validations={['isUrl']} />
                    </div>
                    <SideField>
                        <label><FormattedMessage id="event-image"/></label>
                        <ImagePicker label="image-preview" name="image" />
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-datetime-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-sm-6">
                        <HelDateTimeField validationErrors={validationErrors['start_time']} defaultValue={values['start_time']} ref="start_time" name="start_time" label="event-starting-datetime" />
                        <HelDateTimeField validationErrors={validationErrors['end_time']} defaultValue={values['end_time']} ref="end_time" name="end_time" label="event-ending-datetime" />
                    </div>
                    <SideField>
                        <div className="tip">
                            <p>Kirjoita tapahtuman alkamispäivä ja myös alkamisaika, jos tapahtuma alkaa tiettyyn kellonaikaan.</p>
                            <p>Kirjoita myös päättymispäivä sekä päättymisaika, jos tapahtuma päättyy tiettyyn kellonaikaan.</p>
                        </div>
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-location-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-sm-6">
                        <HelAutoComplete
                            ref="location" name="location"
                            dataSource={`${appSettings.place_autocomplete_api_base}&input=`}
                            resource="place"
                            required={true}
                            validationErrors={validationErrors['location']} defaultValue={values['location']}
                            placeholder={this.context.intl.formatMessage({ id: "event-location" })}
                            />
                        <MultiLanguageField multiLine={true} label="event-location-additional-info" ref="location_extra_info" name="location_extra_info" validationErrors={validationErrors["location_extra_info"]} defaultValue={values["location_extra_info"]} languages={this.props.editor.contentLanguages} />
                    </div>
                    <SideField>
                        <div className="tip">
                            <p>Aloita kirjoittamaan kenttään tapahtumapaikan nimen alkua ja valitse oikea paikka alle ilmestyvästä listasta.</p>
                            <p>Jos tapahtumapaikka löytyy listasta, osoitetta ja sijaintia ei tarvitse kuvailla tarkemmin. Voit kuitenkin laittaa lisätietoja tapahtuman löytämiseksi, kuten kerrosnumero tai muu tarkempi sijainti.</p>
                            <p>Jos tapahtumapaikkaa ei löydy listasta, valitse tapahtumapaikaksi Helsinki ja kirjoita tarkempi paikka tai osoite lisätietokenttään.</p>
                        </div>
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-price-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-sm-6">
                        <HelOffersField ref="offers" name="offers" validationErrors={validationErrors["offers"]} defaultValue={values["offers"]} languages={this.props.editor.contentLanguages} />
                    </div>
                    <SideField>
                        <div className="tip">
                            <p>Merkitse jos tapahtuma on maksuton tai lisää tapahtuman hinta tekstimuodossa (esim. 7€/5€).</p>
                            <p>Kerro mahdollisesta ennakkoilmoittautumisesta tai anna lisätietoja esimerkiksi paikkavarauksista.</p>
                            <p>Lisää mahdollinen linkki lipunmyyntiin tai ilmoittautumiseen.</p>
                        </div>
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-social-media-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-sm-6">
                        <HelTextField validations={['isUrl']} ref="extlink_facebook" name="extlink_facebook" label={<FormattedMessage id="facebook-url"/>} validationErrors={validationErrors['extlink_facebook']} defaultValue={values['extlink_facebook']} />
                        <HelTextField validations={['isUrl']} ref="extlink_twitter" name="extlink_twitter" label={<FormattedMessage id="twitter-url"/>} validationErrors={validationErrors['extlink_twitter']} defaultValue={values['extlink_twitter']} />
                        <HelTextField validations={['isUrl']} ref="extlink_instagram" name="extlink_instagram" label={<FormattedMessage id="instagram-url"/>} validationErrors={validationErrors['extlink_instagram']} defaultValue={values['extlink_instagram']} />
                    </div>
                    <SideField><p className="tip">Lisää linkki tapahtuman tai sen järjestäjän some-sivulle.</p></SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-categorization" />
                </FormHeader>
                <div className="row">
                    <HelSelect selectedValues={values['keywords']} legend={"Tapahtuman asiasanat"} ref="keywords" name="keywords" resource="keyword" dataSource={`${appSettings.api_base}/keyword/?show_all_keywords=1&data_source=yso&filter=`} validationErrors={validationErrors['keywords']} />
                    <SideField><p className="tip">Liitä tapahtumaan vähintään yksi asiasana, joka kuvaa tapahtuman teemaa tai kohdeyleisöä. Aloita kirjoittamaan asiasanaa ja valitse lisättävä asiasana alle ilmestyvästä listasta.</p></SideField>
                    <HelLabeledCheckboxGroup groupLabel={<FormattedMessage id="hel-main-categories"/>}
                                    selectedValues={values['hel_main']}
                                    ref="hel_main"
                                    name="hel_main"
                                    validationErrors={validationErrors['hel_main']}
                                    itemClassName="col-sm-12"
                                    options={helMainOptions} />
                    <SideField><p className="tip">Valitse vähintään yksi pääkategoria.</p></SideField>
                </div>
                <div className="row"><HelLabeledCheckboxGroup groupLabel={<FormattedMessage id="hel-target-groups"/>}
                                    selectedValues={values['audience']}
                                    ref="audience"
                                    name="audience"
                                    validationErrors={validationErrors['audience']}
                                    itemClassName="col-sm-12"
                                    options={helTargetOptions} />
                    <SideField><p className="tip">Jos tapahtumalla ei ole erityistä kohderyhmää, älä valitse mitään.</p></SideField>
                    <HelLabeledCheckboxGroup groupLabel={<FormattedMessage id="hel-event-languages"/>}
                                    selectedValues={values['in_language']}
                                    ref="in_language"
                                    name="in_language"
                                    validationErrors={validationErrors['in_language']}
                                    itemClassName="col-sm-6"
                                    options={helEventLangOptions} />
                    <SideField><p className="tip">Kielet, joita tapahtumassa käytetään.</p></SideField>
                </div>
            </div>
        )
    }
}

export default FormFields
