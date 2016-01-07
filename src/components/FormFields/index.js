import React from 'react'

import { FormattedMessage } from 'react-intl'

import { TextField, Checkbox, DatePicker, TimePicker } from 'material-ui'

import ImageUpload from 'src/components/ImageUpload'
import HelAutoComplete from 'src/components/HelAutoComplete'
import MultiLanguageField from 'src/components/MultiLanguageField'
import CheckboxGroup from 'src/components/CheckboxGroup'

import API from 'src/api.js'

let helMainOptions = API.loadHelMainOptions();
let helTargetOptions = API.loadHelTargetOptions();
let helEventLangOptions = API.loadHelEventLangOptions();

let HelTextField = (props) => {
    let { required, floatingLabelText } = props

    if(required) {
        if(typeof floatingLabelText === 'string') {
            floatingLabelText += ' *'
        }
        if(typeof floatingLabelText === 'object') {
            floatingLabelText = (<span>{floatingLabelText} *</span>)
        }
    }

    return (<TextField {...props} floatingLabelText={floatingLabelText} />)
}

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

// NOTE: Not found in formsy-material-ui, use this for now
let LabeledCheckboxGroup = (props) => {
    let checkboxes = props.options.map((item, index) => (
        <span className={(props.itemClassName || '')}>
            <Checkbox key={index} name={props.group} value={item.value} label={<FormattedMessage id={item.value}/>} />
        </span>
    ))

    return (
        <fieldset className="checkbox-group">
            <legend className="col-xs-12">{props.groupLabel}</legend>
            {checkboxes}
        </fieldset>
    )
}

class FormFields extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            languages: ['fi']
        }
    }

    render() {
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
                        <HelAutoComplete fullWidth={true} onSelection={(chosenRequest, index, dataSource) => { console.log('helo',chosenRequest, index, dataSource) }} />
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
                        <HelTextField fullWidth={true} name="facebook-url" floatingLabelText={<FormattedMessage id="facebook-url"/>} />
                        <HelTextField fullWidth={true} name="twitter-url" floatingLabelText={<FormattedMessage id="twitter-url"/>} />
                        <HelTextField fullWidth={true} name="instagram-url" floatingLabelText={<FormattedMessage id="instagram-url"/>} />
                    </div>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-categorization" />
                </FormHeader>
                <div className="row">
                    <LabeledCheckboxGroup groupLabel={<FormattedMessage id="hel-main-categories"/>}
                                    group="hel-main-categories"
                                    itemClassName="col-xs-6"
                                    options={helMainOptions} />
                    <LabeledCheckboxGroup groupLabel={<FormattedMessage id="target-groups"/>}
                                    group="target-groups"
                                    itemClassName="col-xs-6"
                                    options={helTargetOptions} />
                    <LabeledCheckboxGroup groupLabel={<FormattedMessage id="event-languages"/>}
                                    group="event-languages"
                                    itemClassName="col-xs-6"
                                    options={helEventLangOptions} />
                </div>
            </div>
        )
    }
}

export default FormFields
