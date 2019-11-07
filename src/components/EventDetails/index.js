import './index.scss'
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
import constants from '../../constants'
import {getEventIdFromUrl, getFirstMultiLanguageFieldValue, scrollToTop} from '../../utils/helpers'
import {Link} from 'react-router-dom'

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
    const {values, intl, rawData, publisher, superEvent} = props

    const isUmbrellaEvent = rawData.super_event_type === constants.SUPER_EVENT_TYPE_UMBRELLA
    const isRecurringEvent = rawData.super_event_type === constants.SUPER_EVENT_TYPE_RECURRING
    const superEventUrl = get(rawData, ['super_event', '@id'])
    const superEventId = getEventIdFromUrl(superEventUrl)
    const superEventName = getFirstMultiLanguageFieldValue(get(superEvent, 'name'))
    const superEventIsUmbrellaEvent = get(superEvent, 'super_event_type') === constants.SUPER_EVENT_TYPE_UMBRELLA
    const superEventIsRecurringEvent = get(superEvent, 'super_event_type') === constants.SUPER_EVENT_TYPE_RECURRING

    // NOTE: Currently don't show not selected options

    // let helMainOptions = mapKeywordSetToForm(keywordSets, 'helfi:topics')
    // let helTargetOptions = mapKeywordSetToForm(keywordSets, 'helfi:audiences')
    // let helEventLangOptions = mapLanguagesSetToForm(languages)
    let helfiCategories = _.map(values.hel_main, (id) => (
        _.find(rawData.keywords, (item) => (id.indexOf(item['@id']) > -1))
    ))

    return (
        <div className="event-details">
            <ImageValue labelKey="event-image" value={values['image']}/>
            <FormHeader>
                {intl.formatMessage({id: 'event-description-fields-header'})}
            </FormHeader>

            <MultiLanguageValue labelKey="event-headline" value={values['name']}/>
            <MultiLanguageValue labelKey="event-short-description" value={values['short_description']}/>
            <MultiLanguageValue labelKey="event-description" value={values['description']}/>
            <MultiLanguageValue labelKey="event-info-url" value={values['info_url']}/>
            <MultiLanguageValue labelKey="event-provider" value={values['provider']}/>
            {publisher && <TextValue labelKey="event-publisher" value={get(publisher, 'name')}/>}

            <FormHeader>
                {intl.formatMessage({id: 'event-datetime-fields-header'})}
            </FormHeader>
            <DateTime value={values['start_time']} labelKey="event-starting-datetime"/>
            <DateTime value={values['end_time']} labelKey="event-ending-datetime"/>

            <FormHeader>
                {intl.formatMessage({id: 'event-location-fields-header'})}
            </FormHeader>

            <MultiLanguageValue labelKey="event-location" value={get(values, 'location.name')}/>
            <TextValue labelKey="event-location-id" value={get(values, 'location.id')}/>
            <MultiLanguageValue
                labelKey="event-location-additional-info"
                value={values['location_extra_info']}
            />

            <FormHeader>
                {intl.formatMessage({id: 'event-price-fields-header'})}
            </FormHeader>
            <OffersValue values={values}/>

            <FormHeader>
                {intl.formatMessage({id: 'event-social-media-fields-header'})}
            </FormHeader>
            <TextValue labelKey="facebook-url" value={values['extlink_facebook']}/>
            <TextValue labelKey="twitter-url" value={values['extlink_twitter']}/>
            <TextValue labelKey="instagram-url" value={values['extlink_instagram']}/>

            <FormHeader>
                {intl.formatMessage({id: 'event-categorization'})}
            </FormHeader>

            <OptionGroup values={helfiCategories} labelKey="hel-main-categories"/>
            <OptionGroup values={values['keywords']} labelKey="hel-keywords"/>
            <OptionGroup values={rawData['audience']} labelKey="hel-target-groups"/>
            <OptionGroup values={rawData['in_language']} labelKey="hel-event-languages"/>

            {appSettings.ui_mode === 'courses' &&
                <React.Fragment>
                    <FormHeader>
                        {intl.formatMessage({id: 'audience-age-restrictions'})}
                    </FormHeader>
                    <TextValue labelKey="audience-min-age" value={values['audience_min_age']}/>
                    <TextValue labelKey="audience-max-age" value={values['audience_max_age']}/>

                    <FormHeader>
                        {intl.formatMessage({id: 'enrolment-time'})}
                    </FormHeader>
                    <DateTime labelKey="enrolment-start-time" value={values['enrolment_start_time']}/>
                    <DateTime labelKey="enrolment-end-time" value={values['enrolment_end_time']}/>

                    <FormHeader>
                        {intl.formatMessage({id: 'attendee-capacity'})}
                    </FormHeader>
                    <TextValue labelKey="minimum-attendee-capacity" value={values['minimum_attendee_capacity']}/>
                    <TextValue labelKey="maximum-attendee-capacity" value={values['maximum_attendee_capacity']}/>
                </React.Fragment>
            }

            <FormHeader>
                {intl.formatMessage({id: 'links-to-events'})}
            </FormHeader>
            {isUmbrellaEvent &&
                <p className="link-to-events-text">
                    <FormattedMessage id="super-event-of-umbrella" />
                </p>
            }
            {isRecurringEvent &&
                <p className="link-to-events-text">
                    <FormattedMessage id="super-event-of-series" />
                </p>
            }
            {superEventIsUmbrellaEvent && superEventId &&
                <p className="link-to-events-text">
                    <FormattedMessage id="sub-event-of-umbrella" />
                    <Link
                        to={`/event/${superEventId}`}
                        onClick={scrollToTop}
                    >
                        <span>{superEventName}</span>
                    </Link>
                </p>
            }
            {superEventIsRecurringEvent && superEventId &&
                <p className="link-to-events-text">
                    <FormattedMessage id="sub-event-of-series" />
                    <Link
                        to={`/event/${superEventId}`}
                        onClick={scrollToTop}
                    >
                        <span>{superEventName}</span>
                    </Link>
                </p>
            }
        </div>
    )
}

EventDetails.propTypes = {
    values: PropTypes.object,
    superEvent: PropTypes.object,
    rawData: PropTypes.object,
    intl: intlShape,
    publisher: PropTypes.object,
}

export default injectIntl(EventDetails)
