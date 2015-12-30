import React from 'react'

import { FormattedMessage } from 'react-intl'

import TextField from 'node_modules/material-ui-with-sass/src/js/text-field.jsx'
import Checkbox from 'node_modules/material-ui-with-sass/src/js/checkbox.jsx'

let WrappedTextField = (props) => (
    <div className={ props.half ? "col-xs-6" : "col-xs-12" } >
        <TextField {...props} />
    </div>
)

let FormHeader = (props) => (
    <div className="row">
        <legend className="col-xs-12">{ props.children }</legend>
    </div>
)

let Description = (props) => (
    <div className="col-xs-5 col-sm-push-1">
        { props.children }
    </div>
)

let FormFields = (props) => (
    <div>
            <div className="col-xs-12 highlighted-block">
                <div className="pull-left">
                    <FormattedMessage id="event-presented-in-languages"/>
                </div>
                <div className="pull-right">
                    <Checkbox name="lang-fi" value="true" label={<FormattedMessage id="in-fi"/>} />
                    <Checkbox name="lang-sv" value="true" label={<FormattedMessage id="in-sv"/>} />
                    <Checkbox name="lang-en" value="true" label={<FormattedMessage id="in-en"/>} />
                </div>
            </div>

        <FormHeader>
            <FormattedMessage id="event-description-fields-header"/>
        </FormHeader>

        <div className="row">
            <div className="col-xs-6">
                <TextField floatingLabelText={<FormattedMessage id="event-name"/>} />
                <TextField floatingLabelText={<FormattedMessage id="event-short-description"/>} />
                <TextField floatingLabelText={<FormattedMessage id="event-description"/>} />
                <TextField floatingLabelText={<FormattedMessage id="event-home-page"/>} />
            </div>
            <Description>
                A description which is pretty longish string of text. The quick brown fox jumped over the lazy fox.
            </Description>
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
            <Description>
                A description which is pretty longish string of text. The quick brown fox jumped over the lazy fox.
            </Description>
        </div>

    </div>
)

export default FormFields
