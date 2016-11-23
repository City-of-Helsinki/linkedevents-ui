import './index.scss'

import moment from 'moment'
import React from 'react'

import {injectIntl, FormattedMessage} from 'react-intl'
import { getStringWithLocale } from 'src/utils/locale'

import {mapKeywordSetToForm, mapLanguagesSetToForm} from 'src/utils/apiDataMapping.js'

let NoValue = (props) => {
    let header = props.labelKey ? (<span>'<FormattedMessage id={`${props.labelKey}`} />'&nbsp;</span>) : null
    return (
        <div className="no-value">
            {header}
            <FormattedMessage id="no-value" />
        </div>
    )
}

let CheckedValue = (props) => {
    let checkIcon = props.checked ? (<i className="green material-icons">&#xE834;</i>) : (<i className="material-icons">&#xE835;</i>)
    let label = props.labelKey ? <FormattedMessage id={`${props.labelKey}`} /> : props.label
    return (
        <div className="checked-value">{checkIcon}<label>{label}</label></div>
    )
}

let MultiLanguageValue = (props) => {

    if(props.hidden) {
        return (<div/>)
    }

    let value = props.value || []

    let count = (_.keys(value)).length

    // Determine column size depending on the amount of language options
    let colClass = "col-md-12"
    if(count > 1) {
        colClass = (count === 2) ? "col-md-6" : "col-md-4"
    }

    // Use a separate array to ensure correct field order
    let langOptions = ['fi', 'sv', 'en']
    let elements = []

    _.each(langOptions, (key) => {
        let val = value[key]
        if(val) {
            elements.push(<div className={colClass} key={key}><div className={`in-${key} indented`}><label className="language"><FormattedMessage id={`in-${key}`} /></label><div>{val}</div></div></div>)
        }
    })

    if(elements.length > 0) {
        return (
            <div className="multi-value-field">
                <label><FormattedMessage id={`${props.labelKey}`} /></label>
                <div className="row">
                    {elements}
                </div>
            </div>
        )
    } else {
        return (
            <div className="multi-value-field">
                <label><FormattedMessage id={`${props.labelKey}`} /></label>
                <div>
                    <NoValue labelKey={props.labelKey}/>
                </div>
            </div>

        )
    }

}

let TextValue = (props) => {
    if(props.value && props.value.length !== undefined && props.value.length > 0) {
        return (
            <div className="single-value-field">
                <div><label><FormattedMessage id={`${props.labelKey}`} /></label></div>
                <div>
                    <span className="value">{props.value}</span>
                </div>
            </div>
        )
    } else {
        return (
            <div className="single-value-field">
                <div><label><FormattedMessage id={`${props.labelKey}`} /></label></div>
                <div>
                    <NoValue labelKey={props.labelKey}/>
                </div>
            </div>
        )
    }
}

let ImageValue = (props) => {
    if(props.value !== undefined && props.value instanceof Object) {
        let bgStyle = {backgroundImage: 'url(' + props.value.url + ')'}

        return (
        <div className="row">
            <div className="thumbnail" style={bgStyle} />
        </div>
        )
    } else {
        return (
            <FormHeader>
                    <FormattedMessage id="no-image"/>
            </FormHeader>
        )
    }
}

let OptionGroup = (props) => {

    let values = props.values || []

    let elements = _.map(values, (val, key) => {
        let name = getStringWithLocale(val, 'name') || val.label || val.id || val || ''
        return (<CheckedValue checked={true} label={name} key={key}/>)
    })

    if(elements.length === 0) {
        elements = (<NoValue labelKey={props.labelKey}/>)
    }

    return (
        <div className="option-group col-xl-6">
            <div><label><FormattedMessage id={`${props.labelKey}`} /></label></div>
            {elements}
        </div>
    )
}

let DateTime = (props) => {

    // TODO: if all day event show it on this field. Add a props for it
    if(props.value && props.value.length !== undefined && props.value.length > 0) {

        let time = moment(props.value).tz('Europe/Helsinki');
        let value = ''
        if(time.isValid()) {
            value = time.format('dddd D.M.YYYY H.mm')
        }
        return (
            <div className="single-value-field">
                <label><FormattedMessage id={`${props.labelKey}`} /></label>
                <span className="value">
                    {value}
                </span>
            </div>
        )
    } else {
        return (
            <div className="single-value-field">
                <label><FormattedMessage id={`${props.labelKey}`} /></label>
                <span className="value">
                    <NoValue labelKey={props.labelKey}/>
                </span>
            </div>
        )
    }
}

let FormHeader = (props) => (
    <div className="row">
        <legend className="col-sm-12">{ props.children }</legend>
    </div>
)


let OffersValue = (props) => {
    if(props.values.offers && props.values.offers[0] && typeof props.values.offers[0] === 'object') {
        let offer = props.values.offers[0]
        return (
            <div>
                <CheckedValue checked={offer.is_free} labelKey="is-free"/>
                <MultiLanguageValue labelKey="event-purchase-link" value={offer.info_url} />
                <MultiLanguageValue labelKey="event-price" hidden={offer.is_free} value={offer.price} />
                <MultiLanguageValue labelKey="event-price-info" hidden={offer.is_free} value={offer.description} />
            </div>
        )
    } else {
        return (<NoValue labelKey={props.labelKey}/>)
    }
}

class EventDetails extends React.Component {

    render() {

        let props = this.props
        // NOTE: Currently don't show not selected options

        // let helMainOptions = mapKeywordSetToForm(props.keywordSets, 'helfi:topics')
        // let helTargetOptions = mapKeywordSetToForm(props.keywordSets, 'helfi:audiences')
        // let helEventLangOptions = mapLanguagesSetToForm(props.languages)
        let helfiCategories = _.map(props.values.hel_main, (id) => (
            _.find(props.rawData.keywords, (item) => (id.indexOf(item['@id']) > -1))
        ))

        return (
            <div>
                <ImageValue labelKey="event-image" value={props.values["image"]}/>
                <FormHeader>
                    { props.intl.formatMessage({id: "event-description-fields-header"}) }
                </FormHeader>
                <div className="row">
                    <div className="col-sm-12">
                        <MultiLanguageValue labelKey="event-headline" value={props.values["name"]} />
                        <MultiLanguageValue labelKey="event-short-description" value={props.values["short_description"]}/>
                        <MultiLanguageValue labelKey="event-description" value={props.values["description"]} />
                        <MultiLanguageValue labelKey="event-info-url" value={props.values["info_url"]} />
                    </div>
                </div>

                <FormHeader>
                    { props.intl.formatMessage({id: "event-datetime-fields-header"}) }
                </FormHeader>
                <div className="row">
                    <div className="col-sm-12">
                        <DateTime value={props.values['start_time']} labelKey="event-starting-datetime" />
                        <DateTime value={props.values['end_time']} labelKey="event-ending-datetime" />
                    </div>
                </div>

                <FormHeader>
                    { props.intl.formatMessage({id: "event-location-fields-header"}) }
                </FormHeader>
                <div className="row">
                    <div className="col-sm-12">
                        <MultiLanguageValue labelKey="event-location" value={props.values.location.name} />
                        <TextValue labelKey="event-location-id" value={props.values.location.id} />
                        <MultiLanguageValue labelKey="event-location-additional-info" value={props.values["location_extra_info"]} />
                    </div>
                </div>

                <FormHeader>
                    { props.intl.formatMessage({id: "event-price-fields-header"}) }
                </FormHeader>
                <div className="row">
                    <div className="col-sm-12">
                        <OffersValue values={props.values} />
                    </div>
                </div>

                <FormHeader>
                    { props.intl.formatMessage({id: "event-social-media-fields-header"}) }
                </FormHeader>
                <div className="row">
                    <div className="col-sm-12">
                        <TextValue labelKey="facebook-url" value={props.values['extlink_facebook']} />
                        <TextValue labelKey="twitter-url" value={props.values['extlink_twitter']} />
                        <TextValue labelKey="instagram-url" value={props.values['extlink_instagram']} />
                    </div>
                </div>

                <FormHeader>
                    { props.intl.formatMessage({id: "event-categorization"}) }
                </FormHeader>
                <div className="row">
                    <div className="col-sm-12">
                        <OptionGroup values={helfiCategories} labelKey="hel-main-categories" />
                        <OptionGroup values={props.values['keywords']} labelKey="hel-keywords" />
                        <div className="row"/>
                        <OptionGroup values={props.rawData['audience']} labelKey="hel-target-groups" />
                        <OptionGroup values={props.rawData['in_language']} labelKey="hel-event-languages" />
                    </div>
                </div>
            </div>
        )
    }
}

export default injectIntl(EventDetails)
