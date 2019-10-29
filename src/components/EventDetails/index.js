import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import {
    injectIntl,
    FormattedMessage,
    FormattedDate,
    FormattedTime,
    intlShape,
} from 'react-intl'

import {getStringWithLocale} from '../../utils/locale'

import './index.scss'

const NoValue = (props) => {
    let header = props.labelKey ? (<span><FormattedMessage id={`${props.labelKey}`}/>&nbsp;</span>) : null
    return (
        <div className="no-value">
            {header}
            <FormattedMessage id="no-value"/>
        </div>
    )
}

NoValue.propTypes = {
    labelKey: PropTypes.string,
}

const CheckedValue = (props) => {
    let checkIcon = props.checked ? (<i className="green material-icons">&#xE834;</i>) : (
        <i className="material-icons">&#xE835;</i>)
    let label = props.labelKey ? <FormattedMessage id={`${props.labelKey}`}/> : props.label
    return (
        <div className="checked-value">{checkIcon}<label>{label}</label></div>
    )
}

CheckedValue.propTypes = {
    checked: PropTypes.bool,
    labelKey: PropTypes.string,
    label: PropTypes.string,
}

const MultiLanguageValue = (props) => {
    if (props.hidden) {
        return (<div/>)
    }

    let value = props.value || []

    let count = (_.keys(value)).length

    // Determine column size depending on the amount of language options
    let colClass = 'col-md-12'
    if (count > 1) {
        colClass = (count === 2) ? 'col-md-6' : 'col-md-4'
    }

    // Use a separate array to ensure correct field order
    let langOptions = ['fi', 'sv', 'en', 'ru', 'zh_hans', 'ar']
    let elements = []

    _.each(langOptions, (key) => {
        let val = value[key]
        const createHTML = () => ({__html: val})

        if (val) {
            elements.push(<div className={colClass} key={key}>
                <div className={`in-${key} indented`}>
                    <label className="language"><FormattedMessage id={`in-${key}`}/></label>
                    <div dangerouslySetInnerHTML={createHTML()}/>
                </div>
            </div>)
        }
    })

    if (elements.length > 0) {
        return (
            <div className="multi-value-field">
                <label><FormattedMessage id={`${props.labelKey}`}/></label>
                <div className="row">
                    {elements}
                </div>
            </div>
        )
    } else {
        return (
            <div className="multi-value-field">
                <label><FormattedMessage id={`${props.labelKey}`}/></label>
                <div>
                    <NoValue labelKey={props.labelKey}/>
                </div>
            </div>

        )
    }
}

const TextValue = (props) => {
    if (_.isInteger(props.value) || (props.value && props.value.length !== undefined && props.value.length > 0)) {
        return (
            <div className="single-value-field">
                <div><label><FormattedMessage id={`${props.labelKey}`}/></label></div>
                <div>
                    <span className="value">{props.value}</span>
                </div>
            </div>
        )
    } else {
        return (
            <div className="single-value-field">
                <div><label><FormattedMessage id={`${props.labelKey}`}/></label></div>
                <div>
                    <NoValue labelKey={props.labelKey}/>
                </div>
            </div>
        )
    }
}

const ImageValue = (props) => {
    if (props.value !== undefined && props.value instanceof Object) {
        return <legend><img src={props.value.url} className="event-image"/></legend>
    }

    return (
        <FormHeader>
            <FormattedMessage id="no-image"/>
        </FormHeader>
    )
}

ImageValue.propTypes = {
    value: PropTypes.object,
}

const OptionGroup = (props) => {
    let values = props.values || []

    let elements = _.map(values, (val, key) => {
        let name = getStringWithLocale(val, 'name') || val.label || val.id || val || ''
        return (<CheckedValue checked={true} label={name} key={key}/>)
    })

    if (elements.length === 0) {
        elements = (<NoValue labelKey={props.labelKey}/>)
    }

    return (
        <div className="option-group">
            <div><label><FormattedMessage id={`${props.labelKey}`}/></label></div>
            {elements}
        </div>
    )
}

OptionGroup.propTypes = {
    values: PropTypes.array,
    labelKey: PropTypes.string,
}

const DateTime = (props) => {
    // TODO: if all day event show it on this field. Add a props for it
    if (props.value && props.value.length !== undefined && props.value.length > 0) {
        let time = moment(props.value).tz('Europe/Helsinki')
        let value = ''
        if (time.isValid()) {
            value = <div>
                <FormattedDate
                    value={time}
                    year="numeric"
                    month="short"
                    day="numeric"
                    weekday="long"
                />
                <FormattedTime
                    value={time}
                    hour="numeric"
                    minute="2-digit"
                />
            </div>
        }
        return (
            <div className="single-value-field">
                <label><FormattedMessage id={`${props.labelKey}`}/></label>
                <span className="value">
                    {value}
                </span>
            </div>
        )
    } else {
        return (
            <div className="single-value-field">
                <label><FormattedMessage id={`${props.labelKey}`}/></label>
                <span className="value">
                    <NoValue labelKey={props.labelKey}/>
                </span>
            </div>
        )
    }
}

const FormHeader = props => <legend>{props.children}</legend>

FormHeader.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
}

const OffersValue = (props) => {
    const {offers} = props.values

    if (!offers || offers[0] && typeof offers[0] !== 'object') {
        return (<NoValue labelKey={props.labelKey}/>)
    }

    return (
        <div>
            <CheckedValue checked={offers[0].is_free} labelKey="is-free"/>
            {props.values.offers.map((offer, key) => (
                <div key={`offer-value-${key}`} className="offer-values">
                    <MultiLanguageValue
                        labelKey="event-purchase-link"
                        value={offer.info_url}
                    />
                    <MultiLanguageValue
                        labelKey="event-price"
                        hidden={offer.is_free}
                        value={offer.price}
                    />
                    <MultiLanguageValue
                        labelKey="event-price-info"
                        hidden={offer.is_free}
                        value={offer.description}
                    />
                </div>
            ))}
        </div>
    )
}

OffersValue.propTypes = {
    values: PropTypes.object,
    labelKey: PropTypes.string,
}

const EventDetails = (props) => {
    // NOTE: Currently don't show not selected options

    // let helMainOptions = mapKeywordSetToForm(props.keywordSets, 'helfi:topics')
    // let helTargetOptions = mapKeywordSetToForm(props.keywordSets, 'helfi:audiences')
    // let helEventLangOptions = mapLanguagesSetToForm(props.languages)
    let helfiCategories = _.map(props.values.hel_main, (id) => (
        _.find(props.rawData.keywords, (item) => (id.indexOf(item['@id']) > -1))
    ))

    return (
        <div className="event-details">
            <ImageValue labelKey="event-image" value={props.values['image']}/>
            <FormHeader>
                {props.intl.formatMessage({id: 'event-description-fields-header'})}
            </FormHeader>

            <MultiLanguageValue labelKey="event-headline" value={props.values['name']}/>
            <MultiLanguageValue labelKey="event-short-description" value={props.values['short_description']}/>
            <MultiLanguageValue labelKey="event-description" value={props.values['description']}/>
            <MultiLanguageValue labelKey="event-info-url" value={props.values['info_url']}/>
            <MultiLanguageValue labelKey="event-provider" value={props.values['provider']}/>
            {props.publisher && <TextValue labelKey="event-publisher" value={get(props.publisher, 'name')}/>}

            <FormHeader>
                {props.intl.formatMessage({id: 'event-datetime-fields-header'})}
            </FormHeader>
            <DateTime value={props.values['start_time']} labelKey="event-starting-datetime"/>
            <DateTime value={props.values['end_time']} labelKey="event-ending-datetime"/>

            <FormHeader>
                {props.intl.formatMessage({id: 'event-location-fields-header'})}
            </FormHeader>

            <MultiLanguageValue labelKey="event-location" value={get(props.values, 'location.name')}/>
            <TextValue labelKey="event-location-id" value={get(props.values, 'location.id')}/>
            <MultiLanguageValue
                labelKey="event-location-additional-info"
                value={props.values['location_extra_info']}
            />

            <FormHeader>
                {props.intl.formatMessage({id: 'event-price-fields-header'})}
            </FormHeader>
            <OffersValue values={props.values}/>

            <FormHeader>
                {props.intl.formatMessage({id: 'event-social-media-fields-header'})}
            </FormHeader>
            <TextValue labelKey="facebook-url" value={props.values['extlink_facebook']}/>
            <TextValue labelKey="twitter-url" value={props.values['extlink_twitter']}/>
            <TextValue labelKey="instagram-url" value={props.values['extlink_instagram']}/>

            <FormHeader>
                {props.intl.formatMessage({id: 'event-categorization'})}
            </FormHeader>

            <OptionGroup values={helfiCategories} labelKey="hel-main-categories"/>
            <OptionGroup values={props.values['keywords']} labelKey="hel-keywords"/>
            <OptionGroup values={props.rawData['audience']} labelKey="hel-target-groups"/>
            <OptionGroup values={props.rawData['in_language']} labelKey="hel-event-languages"/>

            {appSettings.ui_mode === 'courses' && <React.Fragment>
                <FormHeader>
                    {props.intl.formatMessage({id: 'audience-age-restrictions'})}
                </FormHeader>
                <TextValue labelKey="audience-min-age" value={props.values['audience_min_age']}/>
                <TextValue labelKey="audience-max-age" value={props.values['audience_max_age']}/>

                <FormHeader>
                    {props.intl.formatMessage({id: 'enrolment-time'})}
                </FormHeader>
                <DateTime labelKey="enrolment-start-time" value={props.values['enrolment_start_time']}/>
                <DateTime labelKey="enrolment-end-time" value={props.values['enrolment_end_time']}/>

                <FormHeader>
                    {props.intl.formatMessage({id: 'attendee-capacity'})}
                </FormHeader>
                <TextValue labelKey="minimum-attendee-capacity" value={props.values['minimum_attendee_capacity']}/>
                <TextValue labelKey="maximum-attendee-capacity" value={props.values['maximum_attendee_capacity']}/>
            </React.Fragment>}
        </div>
    )
}

EventDetails.propTypes = {
    values: PropTypes.object,
    rawData: PropTypes.object,
    intl: intlShape,
    publisher: PropTypes.object,
}

export default injectIntl(EventDetails)
