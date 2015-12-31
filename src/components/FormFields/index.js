import React from 'react'

import { FormattedMessage } from 'react-intl'

import TextField from 'node_modules/material-ui-with-sass/src/js/text-field.jsx'
import Checkbox from 'node_modules/material-ui-with-sass/src/js/checkbox.jsx'

import ImageUpload from 'src/components/ImageUpload'

let HelTextField = (props) => {
    let { required, floatingLabelText } = props

    if(required) {
        if(typeof floatingLabelText === 'string') {
            floatingLabelText += ' *'
        }
        if(typeof floatingLabelText === 'object') {
            floatingLabelText = (<span>{floatingLabelText} *</span>)
            console.log(floatingLabelText)
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

let FormFields = (props) => (
    <div>
            <div className="col-xs-12 highlighted-block">
                <div className="col-xs-6">
                    <label>
                        <FormattedMessage id="event-presented-in-languages"/>
                    </label>
                </div>
                <div className="col-xs-6">
                    <div className="spread-evenly">
                        <Checkbox name="lang-fi" value="true" label={<FormattedMessage id="in-fi"/>} />
                        <Checkbox name="lang-sv" value="true" label={<FormattedMessage id="in-sv"/>} />
                        <Checkbox name="lang-en" value="true" label={<FormattedMessage id="in-en"/>} />
                    </div>
                </div>
            </div>

        <FormHeader>
            <FormattedMessage id="event-description-fields-header"/>
        </FormHeader>

        <div className="row">
            <div className="col-xs-6">
                <HelTextField required={true} floatingLabelText={<FormattedMessage id="event-name"/>} />
                <HelTextField required={true} floatingLabelText={<FormattedMessage id="event-short-description"/>} />
                <HelTextField required={true} floatingLabelText={<FormattedMessage id="event-description"/>} />
                <HelTextField floatingLabelText={<FormattedMessage id="event-home-page"/>} />
            </div>
            <SideField>
                <label><FormattedMessage id="event-picture"/></label>
                <ImageUpload />
            </SideField>
        </div>

        <FormHeader>
            <FormattedMessage id="event-datetime-fields-header" />
        </FormHeader>
        <div className="row">
            <div className="col-xs-6">
                <TextField floatingLabelText={<FormattedMessage id="event-starting-date"/>} />
                <TextField floatingLabelText={<FormattedMessage id="event-starting-time"/>} />
                <TextField floatingLabelText={<FormattedMessage id="event-ending-date"/>} />
                <TextField floatingLabelText={<FormattedMessage id="event-ending-time"/>} />
            </div>
            <SideField>
                A description which is pretty longish string of text. The quick brown fox jumped over the lazy fox.
            </SideField>
        </div>

    </div>
)

export default FormFields
