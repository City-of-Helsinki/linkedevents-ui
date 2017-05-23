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
    HelOffersField,
    HelDatePicker,
    NewEvent
} from 'src/components/HelFormFields'
import RecurringEvent from 'src/components/RecurringEvent'

import { RaisedButton, FlatButton } from 'material-ui'

import {mapKeywordSetToForm, mapLanguagesSetToForm} from 'src/utils/apiDataMapping.js'
import {connect} from 'react-redux'

import {setEventData} from 'src/actions/editor.js'

import moment from 'moment'

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
        intl: React.PropTypes.object,
        dispatch: React.PropTypes.func,
        showNewEvents: React.PropTypes.bool,
        showRecurringEvent: React.PropTypes.bool
    };

    constructor(props) {
      super(props);
      this.state = {
          showNewEvents: true,
          showRecurringEvent: false
      };
    }

    componentWillReceiveProps() {
        this.forceUpdate()
    }

    shouldComponentUpdate() {
        return true
    }

    showRecurringEventDialog() {
        this.setState({showRecurringEvent: !this.state.showRecurringEvent})
    }

    showNewEventDialog() {
        this.setState({showNewEvents: !this.state.showNewEvents})
    }

    addNewEventDialog() {
        let obj = {}
        let startTime
        let endTime
        let subEventKeys = Object.keys(this.props.editor.values.sub_events)
        let key = subEventKeys.length > 0 ? Math.max.apply(null, subEventKeys)+1 : 1
        if (_.keys(this.props.editor.values.sub_events).length) {
            const subEvents = this.props.editor.values.sub_events
            const startDates = []
            const endDates = []
            for (const key in subEvents) {
                if (subEvents.hasOwnProperty(key)) {
                    startDates.push(moment(subEvents[key].start_time))
                    endDates.push(moment(subEvents[key].end_time))
                }
            }
            startTime = moment.max(startDates)
            endTime = moment.max(endDates)
        } else {
            startTime = this.props.editor.values.start_time ? moment(this.props.editor.values.start_time) : moment()
            endTime = this.props.editor.values.end_time ? moment(this.props.editor.values.end_time) : moment()
        }
        obj[key] = {
            start_time: moment.tz(startTime.add(1, 'weeks'), 'Europe/Helsinki').utc().toISOString(),
            end_time: moment.tz(endTime.add(1, 'weeks'), 'Europe/Helsinki').utc().toISOString()
        }
        this.context.dispatch(setEventData(obj, key))
    }

    generateNewEventFields(events) {
        let newEvents = []
        for (const key in events) {
            if (events.hasOwnProperty(key)) {
                newEvents.push(
                    <NewEvent
                        key={key}
                        eventKey={key}
                        event={events[key]}
                    />
                )
            }
        }

        return newEvents
    }

    trimmedDescription() {
        let descriptions = Object.assign({}, this.props.editor.values["description"])
        for (const lang in descriptions) {
            descriptions[lang] = descriptions[lang].replace(/<\/p><p>/gi, "\n\n").replace(/<br\s*[\/]?>/gi, "\n").replace(/<p>/g, '').replace(/<\/p>/g, '')
        }
        return descriptions
    }

    render() {
        let helMainOptions = mapKeywordSetToForm(this.props.editor.keywordSets, 'helfi:topics')
        let helTargetOptions = mapKeywordSetToForm(this.props.editor.keywordSets, 'helsinki:audiences')
        let helEventLangOptions = mapLanguagesSetToForm(this.props.editor.languages)
        let buttonStyle = {
            height: '64px',
            margin: '10px 5px',
            display: 'block'
        }
        const { values, validationErrors, contentLanguages } = this.props.editor
        const newEvents = this.generateNewEventFields(this.props.editor.values.sub_events);
        return (
            <div>
                <div className="col-sm-12 highlighted-block">
                    <div className="col-xl-4 col-sm-12">
                        <label>
                            <FormattedMessage id="event-presented-in-languages"/>
                        </label>
                    </div>
                    <div className="col-xl-8 col-sm-12">
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
                        <MultiLanguageField required={true} multiLine={false} label="event-headline" ref="name" name="name" validationErrors={validationErrors["name"]} defaultValue={values["name"]} languages={this.props.editor.contentLanguages} setDirtyState={this.props.setDirtyState} />
                        <MultiLanguageField required={true} multiLine={true} label="event-short-description" ref="short_description" name="short_description" validationErrors={validationErrors["short_description"]} defaultValue={values["short_description"]} languages={this.props.editor.contentLanguages} validations={['shortString']} setDirtyState={this.props.setDirtyState} forceApplyToStore />
                        <MultiLanguageField required={true} multiLine={true} label="event-description" ref="description" name="description" validationErrors={validationErrors["description"]} defaultValue={this.trimmedDescription()} languages={this.props.editor.contentLanguages} validations={['longString']} setDirtyState={this.props.setDirtyState} />
                        <MultiLanguageField required={false} multiLine={false} label="event-info-url" ref="info_url" name="info_url" validationErrors={validationErrors["info_url"]} defaultValue={values["info_url"]} languages={this.props.editor.contentLanguages} validations={['isUrl']} setDirtyState={this.props.setDirtyState} forceApplyToStore />
                        <MultiLanguageField required={false} multiLine={false} label="event-provider-input" ref="provider" name="provider" validationErrors={validationErrors["provider"]} defaultValue={values["provider"]} languages={this.props.editor.contentLanguages} setDirtyState={this.props.setDirtyState} />
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
                        <div className="row">
                            <div className="col-xs-12 col-md-6">
                                <HelDateTimeField validationErrors={validationErrors['start_time']} defaultValue={values['start_time']} ref="start_time" name="start_time" label="event-starting-datetime" setDirtyState={this.props.setDirtyState} />
                            </div>
                            <div className="col-xs-12 col-md-6">
                                <HelDateTimeField validationErrors={validationErrors['end_time']} defaultValue={values['end_time']} ref="end_time" name="end_time" label="event-ending-datetime" setDirtyState={this.props.setDirtyState} />
                            </div>
                        </div>
                        <div className={"new-events " + (this.state.showNewEvents ? 'show' : 'hidden')}>
                            { newEvents }
                        </div>
                        { this.state.showRecurringEvent &&
                            <RecurringEvent toggle={() => this.showRecurringEventDialog()} validationErrors={validationErrors} values={values}/>
                        }
                        <RaisedButton
                            style={buttonStyle}
                            primary={true}
                            onClick={ () => this.addNewEventDialog() }
                            label={<span><i className="material-icons">add</i> <FormattedMessage id="event-add-new-occasion" /></span>} />
                        <RaisedButton
                            style={buttonStyle}
                            primary={!this.state.showRecurringEvent}
                            onClick={ () => this.showRecurringEventDialog() }
                            label={<span><i className="material-icons">autorenew</i> <FormattedMessage id="event-add-recurring" /></span>} />
                    </div>
                    <SideField>
                        <div className="tip">
                            <p>Kirjoita tapahtuman alkamispäivä ja myös alkamisaika, jos tapahtuma alkaa tiettyyn kellonaikaan.</p>
                            <p>Kirjoita myös päättymispäivä sekä päättymisaika, jos tapahtuma päättyy tiettyyn kellonaikaan.</p>
                            <p>Jos tapahtuma järjestetään useamman kerran, voit lisätä tapahtumalle uusia ajankohtia. Jos tapahtuma toistuu säännöllisesti, voit lisätä kaikki ajankohdat kerralla valitsemalla Toistuva tapahtuma.</p>
                            <p>Ylimääräisen ajankohdan voit poistaa valitsemalla ajankohdan vieressä olevan roskakorisymbolin.</p>
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
                            setDirtyState={this.props.setDirtyState}
                        />
                        <MultiLanguageField multiLine={true} label="event-location-additional-info" ref="location_extra_info" name="location_extra_info" validationErrors={validationErrors["location_extra_info"]} defaultValue={values["location_extra_info"]} languages={this.props.editor.contentLanguages} setDirtyState={this.props.setDirtyState} />
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
                        <HelOffersField ref="offers" name="offers" validationErrors={validationErrors["offers"]} defaultValue={values["offers"]} languages={this.props.editor.contentLanguages} setDirtyState={this.props.setDirtyState} />
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
                        <HelTextField validations={['isUrl']} ref="extlink_facebook" name="extlink_facebook" label={<FormattedMessage id="facebook-url"/>} validationErrors={validationErrors['extlink_facebook']} defaultValue={values['extlink_facebook']} setDirtyState={this.props.setDirtyState} forceApplyToStore />
                        <HelTextField validations={['isUrl']} ref="extlink_twitter" name="extlink_twitter" label={<FormattedMessage id="twitter-url"/>} validationErrors={validationErrors['extlink_twitter']} defaultValue={values['extlink_twitter']} setDirtyState={this.props.setDirtyState} forceApplyToStore />
                        <HelTextField validations={['isUrl']} ref="extlink_instagram" name="extlink_instagram" label={<FormattedMessage id="instagram-url"/>} validationErrors={validationErrors['extlink_instagram']} defaultValue={values['extlink_instagram']} setDirtyState={this.props.setDirtyState} forceApplyToStore />
                    </div>
                    <SideField><p className="tip">Lisää linkki tapahtuman tai sen järjestäjän some-sivulle.</p></SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-categorization" />
                </FormHeader>
                <div className="row">
                    <HelSelect selectedValues={values['keywords']} legend={"Tapahtuman asiasanat"} ref="keywords" name="keywords" resource="keyword" dataSource={`${appSettings.api_base}/keyword/?show_all_keywords=1&data_source=yso&text=`} validationErrors={validationErrors['keywords']} setDirtyState={this.props.setDirtyState} />
                    <SideField><p className="tip">Liitä tapahtumaan vähintään yksi asiasana, joka kuvaa tapahtuman teemaa. Aloita kirjoittamaan asiasanaa ja valitse lisättävä asiasana alle ilmestyvästä listasta.</p></SideField>
                    <HelLabeledCheckboxGroup
                        groupLabel={<FormattedMessage id="hel-main-categories"/>}
                        selectedValues={values['hel_main']}
                        ref="hel_main"
                        name="hel_main"
                        validationErrors={validationErrors['hel_main']}
                        itemClassName="col-md-12 col-lg-6"
                        options={helMainOptions}
                        setDirtyState={this.props.setDirtyState}
                    />
                    <SideField><p className="tip">Valitse vähintään yksi pääkategoria.</p></SideField>
                </div>
                <div className="row">
                    <HelLabeledCheckboxGroup
                        groupLabel={<FormattedMessage id="hel-target-groups"/>}
                        selectedValues={values['audience']}
                        ref="audience"
                        name="audience"
                        validationErrors={validationErrors['audience']}
                        itemClassName="col-md-12 col-lg-6"
                        options={helTargetOptions}
                        setDirtyState={this.props.setDirtyState}
                    />
                    <SideField><p className="tip">Jos tapahtumalla ei ole erityistä kohderyhmää, älä valitse mitään.</p></SideField>
                    <HelLabeledCheckboxGroup
                        groupLabel={<FormattedMessage id="hel-event-languages"/>}
                        selectedValues={values['in_language']}
                        ref="in_language"
                        name="in_language"
                        validationErrors={validationErrors['in_language']}
                        itemClassName="col-md-12 col-lg-6"
                        options={helEventLangOptions}
                        setDirtyState={this.props.setDirtyState}
                    />
                    <SideField><p className="tip">Kielet, joita tapahtumassa käytetään.</p></SideField>
                </div>
            </div>
        )
    }
}

export default FormFields
