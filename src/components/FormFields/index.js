require('!style-loader!css-loader!sass-loader!./index.scss')
import PropTypes from 'prop-types';
import React from 'react'

import {FormattedMessage, injectIntl, intlShape} from 'react-intl'
import CopyToClipboard from 'react-copy-to-clipboard'

import ImagePickerForm from '../ImagePicker'
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
    NewEvent,
} from 'src/components/HelFormFields'
import RecurringEvent from 'src/components/RecurringEvent'

import {Button} from 'material-ui'
// Material-ui Icons
import Add from 'material-ui-icons/Add'
import Autorenew from 'material-ui-icons/Autorenew'

import {mapKeywordSetToForm, mapLanguagesSetToForm} from '../../utils/apiDataMapping'
import {connect} from 'react-redux'

import {setEventData} from '../../actions/editor'

import moment from 'moment'

import API from '../../api'

import CONSTANTS from '../../constants'

let FormHeader = (props) => (
    <div className="row">
        <legend className="col-sm-12">{ props.children }</legend>
    </div>
)

FormHeader.propTypes = {
    children: PropTypes.element,
}

let SideField = (props) => (
    <div className="side-field col-sm-5 col-sm-push-1">
        { props.children }
    </div>
)

SideField.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
}

class FormFields extends React.Component {

    static contextTypes = {
        intl: PropTypes.object,
        dispatch: PropTypes.func,
        showNewEvents: PropTypes.bool,
        showRecurringEvent: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
            showNewEvents: true,
            showRecurringEvent: false,
        };
    }

    UNSAFE_componentWillReceiveProps() {
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
        let subEventKeys = Object.keys(this.props.editor.values.sub_events)
        let key = subEventKeys.length > 0 ? Math.max.apply(null, subEventKeys) + 1 : 1
        const newEventObject = {[key]: {}}
        this.context.dispatch(setEventData(newEventObject, key))
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

    getKeywords(keywords) {
        const regExp = /keyword\/\s*([^\n\r]*)\//i
        const keywordIds = []

        for (const key in keywords) {
            const match = regExp.exec(keywords[key].value)
            keywordIds.push(match[1])
        }

        return keywordIds.join()
    }

    trimmedDescription() {
        let descriptions = Object.assign({}, this.props.editor.values['description'])
        for (const lang in descriptions) {
            descriptions[lang] = descriptions[lang].replace(/<\/p><p>/gi, '\n\n').replace(/<br\s*[\/]?>/gi, '\n').replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/&amp;/g, '&')
        }
        return descriptions
    }

    render() {
        let helMainOptions = mapKeywordSetToForm(this.props.editor.keywordSets, 'helfi:topics')
        let helTargetOptions = mapKeywordSetToForm(this.props.editor.keywordSets, 'helsinki:audiences')
        let helEventLangOptions = mapLanguagesSetToForm(this.props.editor.languages)

        const getAddRecurringEventButtonColor = (showRecurringEvent) => {
            if (showRecurringEvent == true) {
                return 'secondary'
            } else {
                return 'primary'
            }

        }
        const {values, validationErrors, contentLanguages} = this.props.editor
        const newEvents = this.generateNewEventFields(this.props.editor.values.sub_events);

        const {VALIDATION_RULES, DEFAULT_CHARACTER_LIMIT} = CONSTANTS
        
        return (
            <div>
                <div className="col-sm-12 highlighted-block">
                    <div className="col-xl-4 col-sm-12">
                        <label>
                            <FormattedMessage id="event-presented-in-languages"/>
                        </label>
                    </div>
                    <div className="col-xl-8 col-sm-12">
                        <HelLanguageSelect 
                            options={API.eventInfoLanguages()} 
                            checked={contentLanguages}
                        />
                    </div>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-description-fields-header"/>
                </FormHeader>

                <div className="row">
                    <div className="col-sm-6">
                        <MultiLanguageField 
                            required={true} 
                            multiLine={false} 
                            label="event-headline" 
                            ref="name" name="name" 
                            validationErrors={validationErrors['name']} 
                            defaultValue={values['name']} 
                            languages={this.props.editor.contentLanguages} 
                            setDirtyState={this.props.setDirtyState} 
                        />
                        
                        <MultiLanguageField 
                            required={true} multiLine={true} 
                            label="event-short-description" 
                            ref="short_description" 
                            name="short_description" 
                            validationErrors={validationErrors['short_description']} 
                            defaultValue={values['short_description']} 
                            languages={this.props.editor.contentLanguages} 
                            validations={[VALIDATION_RULES.SHORT_STRING]} 
                            setDirtyState={this.props.setDirtyState} 
                            forceApplyToStore 
                        />

                        <MultiLanguageField 
                            required={true} 
                            multiLine={true} 
                            label="event-description" 
                            ref="description" 
                            name="description" 
                            validationErrors={validationErrors['description']} 
                            defaultValue={this.trimmedDescription()} 
                            languages={this.props.editor.contentLanguages} 
                            validations={[VALIDATION_RULES.LONG_STRING]} 
                            setDirtyState={this.props.setDirtyState} 
                        />
                        <MultiLanguageField 
                            required={false} 
                            multiLine={false} 
                            label="event-info-url" 
                            ref="info_url" 
                            name="info_url" 
                            validationErrors={validationErrors['info_url']} 
                            defaultValue={values['info_url']} 
                            languages={this.props.editor.contentLanguages} 
                            validations={[VALIDATION_RULES.IS_URL]} 
                            setDirtyState={this.props.setDirtyState} 
                            forceApplyToStore 
                        />
                        <MultiLanguageField 
                            required={false} 
                            multiLine={false} 
                            label="event-provider-input" 
                            ref="provider" 
                            name="provider" 
                            validationErrors={validationErrors['provider']} 
                            defaultValue={values['provider']} 
                            languages={this.props.editor.contentLanguages} 
                            setDirtyState={this.props.setDirtyState} 
                        />
                    </div>
                    <SideField>
                        <label><FormattedMessage id="event-image"/></label>
                        <ImagePickerForm label="image-preview" name="image" />
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
                        <div className={'new-events ' + (this.state.showNewEvents ? 'show' : 'hidden')}>
                            { newEvents }
                        </div>
                        { this.state.showRecurringEvent &&
                            <RecurringEvent toggle={() => this.showRecurringEventDialog()} validationErrors={validationErrors} values={values}/>
                        }
                        <Button
                            raised
                            className="base-material-btn"
                            color="primary"
                            onClick={ () => this.addNewEventDialog() }
                        ><Add/> <FormattedMessage id="event-add-new-occasion" /></Button>
                        <Button
                            raised
                            className="base-material-btn"
                            color={getAddRecurringEventButtonColor(this.state.showRecurringEvent)}
                            onClick={ () => this.showRecurringEventDialog() }
                        ><Autorenew/> <FormattedMessage id="event-add-recurring" /></Button>
                    </div>
                    <SideField>
                        <div className="tip">
                            <p><FormattedMessage id="editor-tip-time-start"/></p>
                            <p><FormattedMessage id="editor-tip-time-end"/></p>
                            <p><FormattedMessage id="editor-tip-time-multi"/></p>
                            <p><FormattedMessage id="editor-tip-time-delete"/></p>
                        </div>
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-location-fields-header" />
                </FormHeader>
                <div className="row location-row">
                    <div className="col-sm-6">
                        <HelAutoComplete
                            ref="location"
                            name="location"
                            dataSource={`${appSettings.api_base}/place/?show_all_places=1&text=`}
                            resource="place"
                            required={true}
                            validationErrors={validationErrors['location']}
                            defaultValue={values['location']}
                            label={this.context.intl.formatMessage({id: 'event-location'})}
                            placeholder={this.context.intl.formatMessage({id: 'event-location'})}
                            setDirtyState={this.props.setDirtyState}
                        />
                        <CopyToClipboard text={values['location'] ? values['location'].id : ''}><button className="clipboard-copy-button" title={this.context.intl.formatMessage({id: 'copy-to-clipboard'})}><i className="material-icons">&#xE14D;</i></button></CopyToClipboard>
                        <MultiLanguageField 
                            multiLine={true} 
                            label="event-location-additional-info" 
                            ref="location_extra_info" 
                            name="location_extra_info" 
                            validationErrors={validationErrors['location_extra_info']}
                            validations={[VALIDATION_RULES.SHORT_STRING]} 
                            defaultValue={values['location_extra_info']} 
                            languages={this.props.editor.contentLanguages} 
                            setDirtyState={this.props.setDirtyState}
                        />
                    </div>
                    <SideField>
                        <div className="tip">
                            <p><FormattedMessage id="editor-tip-location"/></p>
                            <p><FormattedMessage id="editor-tip-location-extra"/></p>
                            <p><FormattedMessage id="editor-tip-location-not-found"/></p>
                        </div>
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-price-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-sm-6">
                        <HelOffersField ref="offers" name="offers" validationErrors={validationErrors} defaultValue={values['offers']} languages={this.props.editor.contentLanguages} setDirtyState={this.props.setDirtyState} />
                    </div>
                    <SideField>
                        <div className="tip">
                            <p><FormattedMessage id="editor-tip-price"/></p>
                            <p><FormattedMessage id="editor-tip-price-multi"/></p>
                        </div>
                    </SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-social-media-fields-header" />
                </FormHeader>
                <div className="row">
                    <div className="col-sm-6">
                        <HelTextField validations={[VALIDATION_RULES.IS_URL]} ref="extlink_facebook" name="extlink_facebook" label={<FormattedMessage id="facebook-url"/>} validationErrors={validationErrors['extlink_facebook']} defaultValue={values['extlink_facebook']} setDirtyState={this.props.setDirtyState} forceApplyToStore />
                        <HelTextField validations={[VALIDATION_RULES.IS_URL]} ref="extlink_twitter" name="extlink_twitter" label={<FormattedMessage id="twitter-url"/>} validationErrors={validationErrors['extlink_twitter']} defaultValue={values['extlink_twitter']} setDirtyState={this.props.setDirtyState} forceApplyToStore />
                        <HelTextField validations={[VALIDATION_RULES.IS_URL]} ref="extlink_instagram" name="extlink_instagram" label={<FormattedMessage id="instagram-url"/>} validationErrors={validationErrors['extlink_instagram']} defaultValue={values['extlink_instagram']} setDirtyState={this.props.setDirtyState} forceApplyToStore />
                    </div>
                    <SideField><p className="tip"><FormattedMessage id="editor-tip-social-media"/></p></SideField>
                </div>

                <FormHeader>
                    <FormattedMessage id="event-categorization" />
                </FormHeader>
                <div className="row keyword-row">
                    <HelSelect selectedValues={values['keywords']} legend={this.context.intl.formatMessage({id: 'event-keywords'})} ref="keywords" name="keywords" resource="keyword" dataSource={`${appSettings.api_base}/keyword/?show_all_keywords=1&data_source=yso&text=`} validationErrors={validationErrors['keywords']} setDirtyState={this.props.setDirtyState} />
                    <CopyToClipboard text={values['keywords'] ? this.getKeywords(values['keywords']) : ''}><button className="clipboard-copy-button" title={this.context.intl.formatMessage({id: 'copy-to-clipboard'})}><i className="material-icons">&#xE14D;</i></button></CopyToClipboard>
                    <SideField><p className="tip"><FormattedMessage id="editor-tip-keywords"/></p></SideField>
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
                    <SideField><p className="tip"><FormattedMessage id="editor-tip-hel-main-category"/></p></SideField>
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
                    <SideField><p className="tip"><FormattedMessage id="editor-tip-hel-target-group"/></p></SideField>
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
                    <SideField><p className="tip"><FormattedMessage id="editor-tip-event-languages"/></p></SideField>
                </div>
            </div>
        )
    }
}

FormFields.propTypes = {
    editor: PropTypes.object,
    setDirtyState: PropTypes.func,
}

export default FormFields
