import './index.scss'

import moment from 'moment'
import React from 'react'

import {injectIntl, FormattedMessage} from 'react-intl'

import {mapKeywordSetToForm, mapLanguagesSetToForm} from 'src/utils/apiDataMapping.js'

let NoValue = (props) => {
    let header = props.label ? (<label>'<FormattedMessage id={`${props.label}`} />'&nbsp;</label>) : null
    return (
        <div className="no-value">
            {header}
            <FormattedMessage id="no-value" />
        </div>
    )
}

let CheckedValue = (props) => {
    let checkIcon = props.checked ? (<i className="green material-icons">&#xE834;</i>) : (<i className="material-icons">&#xE835;</i>)
    return (
        <span className="checked-value">{checkIcon}<label><FormattedMessage id={`${props.label}`} /></label></span>
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

    let elements = _.map(value, (val, key) => {
        return (<div className={colClass} key={key}><div className={`in-${key} indented`}><label className="language"><FormattedMessage id={`in-${key}`} /></label><div>{val}</div></div></div>)
    })

    if(elements.length > 0) {
        return (
            <div className="multi-value-field">
                <label><FormattedMessage id={`${props.label}`} /></label>
                <div className="row">
                    {elements}
                </div>
            </div>
        )
    } else {
        return (
            <NoValue label={props.label}/>
        )
    }

}

let TextValue = (props) => {
    if(props.value.length !== undefined && props.value.length > 0) {
        return (
            <div className="single-value-field">
                <div><label><FormattedMessage id={`${props.label}`} /></label></div>
                <div>
                    <span className="value">{props.value}</span>
                </div>
            </div>
        )
    } else {
        return (<NoValue label={props.label}/>)
    }
}

let OptionGroup = (props) => {

    let values = props.values || []

    let elements = _.map(values, (val, key) => {
        return (<span key={key}>{ val.label || val  }</span>)
    })

    return (
        <span>
            {elements}
        </span>
    )
}

let DateTime = (props) => {

    // TODO: if all day event show it on this field. Add a props for it
    if(props.value.length !== undefined && props.value.length > 0) {

        let time = moment(props.value).tz('Europe/Helsinki');
        let value = ''
        if(time.isValid()) {
            value = time.format('dddd D.M.YYYY H.mm')
        }
        return (
            <div className="single-value-field">
                <label><FormattedMessage id={`${props.label}`} /></label>
                <span className="value">
                    {value}
                </span>
            </div>
        )
    } else {
        return (<NoValue label={props.label}/>)
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
                <CheckedValue checked={offer.is_free} label="is-free"/>
                <MultiLanguageValue label="event-purchase-link" value={offer.info_url} />
                <MultiLanguageValue label="event-price" hidden={offer.is_free} value={offer.price} />
                <MultiLanguageValue label="event-price-info" hidden={offer.is_free} value={offer.description} />
            </div>
        )
    } else {
        return (<NoValue label={props.label}/>)
    }
}

class EventDetails extends React.Component {

    render() {

        let props = this.props
        // NOTE: Currently don't show not selected options

        // let helMainOptions = mapKeywordSetToForm(props.keywordSets, 'helfi:topics')
        // let helTargetOptions = mapKeywordSetToForm(props.keywordSets, 'helfi:audiences')
        // let helEventLangOptions = mapLanguagesSetToForm(props.languages)

        return (
            <div>
                <FormHeader>
                    { props.intl.formatMessage({id: "event-description-fields-header"}) }
                </FormHeader>
                <div className="row">
                    <div className="col-sm-12">
                        <MultiLanguageValue label="event-headline" value={props.values["name"]} />
                        <MultiLanguageValue label="event-short-description" value={props.values["short_description"]} />
                        <MultiLanguageValue label="event-description" value={props.values["description"]} />
                        <MultiLanguageValue label="event-info-url" value={props.values["info_url"]} />
                    </div>
                </div>

                <FormHeader>
                    { props.intl.formatMessage({id: "event-datetime-fields-header"}) }
                </FormHeader>
                <div className="row">
                    <div className="col-sm-12">
                        <DateTime value={props.values['start_time']} label="event-starting-datetime" />
                        <DateTime value={props.values['end_time']} label="event-ending-datetime" />
                    </div>
                </div>

                <FormHeader>
                    { props.intl.formatMessage({id: "event-location-fields-header"}) }
                </FormHeader>
                <div className="row">
                    <div className="col-sm-12">
                        <MultiLanguageValue label="event-location" value={props.values.location.name} />
                        <TextValue label="event-location-id" value={props.values.location.id} />
                        <MultiLanguageValue label="event-location-additional-info" value={props.values["location_extra_info"]} />
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
                        <TextValue label="facebook-url" value={props.values['extlink_facebook']} />
                        <TextValue label="twitter-url" value={props.values['extlink_twitter']} />
                        <TextValue label="instagram-url" value={props.values['extlink_instagram']} />
                    </div>
                </div>

                <FormHeader>
                    { props.intl.formatMessage({id: "event-categorization"}) }
                </FormHeader>
                <div className="row">
                    <div className="col-sm-12">
                        <OptionGroup values={props.values['hel_main']} label={"hel-main-categories"} />
                        <OptionGroup values={props.values['keywords']} label={"hel-keywords"} />
                        <OptionGroup values={props.values['hel_target']} label={"hel-target-groups"} />
                        <OptionGroup values={props.values['in_language']} label={"hel-event-languages"} />
                    </div>
                </div>
            </div>
        )
    }
}

export default injectIntl(EventDetails)
