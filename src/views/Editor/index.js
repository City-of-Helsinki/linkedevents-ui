
import '!style-loader!css-loader!sass-loader!./index.scss'
import 'style-loader!vendor/stylesheets/typeahead.css'

import React from 'react'
import Loader from 'react-loader'
import {connect} from 'react-redux'
import {FormattedMessage, injectIntl, intlShape} from 'react-intl'
import moment from 'moment'
import PropTypes from 'prop-types'

import {Button} from 'material-ui'
import Tooltip from 'material-ui/Tooltip'
import Close from 'material-ui-icons/Close'
import constants from 'src/constants.js'

import {getStringWithLocale} from 'src/utils/locale'

import {
    fetchEventForEditing as fetchEventForEditingAction, 
    deleteEvent as deleteEventAction, 
    cancelEvent as cancelEventAction, 
    sendData as sendDataAction, 
    clearData as clearDataAction, 
    fetchKeywordSets as fetchKeywordSetsAction, 
    fetchLanguages as fetchLanguagesAction, 
    setValidationErrors as setValidationErrorsAction,
} from 'src/actions/editor.js'

import {
    confirmAction, 
    clearFlashMsg as clearFlashMsgAction} from 'src/actions/app.js'
import {fetchSubEvents as fetchSubEventsAction} from 'src/actions/subEvents.js'

import {checkEventEditability} from 'src/utils/checkEventEditability.js'

// the backup doesn't support non-language links, so we use hardcoded
// 'fi' instead for the link language
var EXT_LINK_NO_LANGUAGE = 'fi'

// sentinel for authentication alert
var sentinel = true;

import FormFields from 'src/components/FormFields'

class EditorPage extends React.Component {
    constructor(props) {
        super(props)
        
        this.handler = (ev) => {
            ev.preventDefault();
            if (this.state.isDirty) {
                (ev || window.event).returnValue = null;
                this.state = {}
            }
        }
        this.state = {
            canSubmit: false,
            disabled: false,
            isDirty: false,
        }

        this.setDirtyState = this.setDirtyState.bind(this)
        this.clearForm = this.clearForm.bind(this)
    }

    UNSAFE_componentWillMount() {
        if(this.props.match.params.action === 'update' && this.props.match.params.eventId) {
            this.props.fetchEventForEditing(this.props.match.params.eventId, this.props.user)
            this.props.fetchSubEvents(this.props.match.params.eventId, this.props.user)
        }
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handler)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
    // Check if we are changing the editing mode on fly
    // (happens when jumping from update event page to create event page)
    // Clear page or fetch new eventdata accordingly
        if(nextProps.match && nextProps.match.params && this.props.match.params.action !== nextProps.match.params.action) {
            if(nextProps.match.params.action === 'update') {
                this.props.fetchEventForEditing(this.props.match.params.eventId, this.props.user)
            } else {
                this.props.clearData()
            }
        }

        this.forceUpdate()
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handler)
        this.props.setValidationErrors({})
    }

    setDirtyState() {
        if (!this.state.isDirty) {
            this.setState({isDirty: true})
        }
    }

    enableButton() {
        return this.setState({
            canSubmit: true,
        });
    }

    disableButton() {
        return this.setState({
            canSubmit: false,
        });
    }

    getDeleteButton(disabled = false) {
        let buttonStyle = {
            height: '64px',
            margin: '0 10px',
            color: '#ffffff',
        }

        if(this.props.match.params.action === 'update') {
            return (
                <Button
                    raised
                    color="accent"
                    style={buttonStyle}
                    disabled={disabled}
                    onClick={ (e) => this.confirmDelete(e) }><FormattedMessage id="delete-event"/></Button>
            )
        }
    }

    eventExists() {
        if (this.props.match.params.action !== 'update') {
            // we are not updating an existing event
            return false
        }
        let publicationStatus = _.get(this.props, 'editor.values.publication_status')
        if (!publicationStatus) {
            // if the field is missing, the user is not logged in, so the event is public
            return true
        }
        if (publicationStatus === constants.PUBLICATION_STATUS.PUBLIC) {
            return true
        }
        // the publication status field exists and the event is not public
        return false
    }

    getCancelButton(disabled = false) {
        let buttonStyle = {
            height: '64px',
            margin: '0 10px',
            color: '#ffffff',
        }

        if(this.eventExists()) {
            return (
                <Button
                    raised
                    color="accent"
                    style={buttonStyle}
                    disabled={disabled}
                    onClick={ (e) => this.confirmCancel(e) }><FormattedMessage id="cancel-event"/></Button>
            )
        } else {
            return null
        }
    }

    getSaveButtons(disabled = false) {
        let buttonStyle = {
            height: '64px',
            margin: '0 10px',
        }
        let eventExists = this.eventExists()
        let labelTextId = this.props.editor.isSending ?
            (eventExists ? 'event-action-save-existing-active' : 'event-action-save-new-active')
            : (eventExists ? 'event-action-save-existing' : 'event-action-save-new')
        if (_.keys(this.props.editor.values.sub_events).length > 0) {
            labelTextId = this.props.editor.isSending ? 'event-action-save-multiple-active' : 'event-action-save-multiple'
        }

        return (
            <Button
                raised
                style={buttonStyle}
                color="primary"
                disabled={disabled}
                onClick={ (e) => this.saveAsPublished(e) }
            ><FormattedMessage id={labelTextId}/></Button>
        )
    }

    getActionButtons() {
        let {eventIsEditable, eventEditabilityExplanation} = checkEventEditability(this.props.user, this.props.editor.values)

        let disabled = this.props.editor.isSending || !eventIsEditable
        let buttons = <div className="actions">
            <div>
                { this.getDeleteButton(disabled) }
                { this.getCancelButton(disabled) }
            </div>
            { this.getSaveButtons(disabled) }
        </div>
        return (
            <div>
                {eventIsEditable ? buttons :
                    <Tooltip title={eventEditabilityExplanation}>
                        <span>{buttons}</span>
                    </Tooltip>
                }
            </div>
        )
    }

    clearForm() {
        this.props.clearData()
    }

    goToPreview(event) {
    // console.log(event)
    }

    getWarningMarkup() {
        let warningText = this.props.intl.formatMessage('editor-delete-warning') + '<br/>'
        let subEventWarning = ''
        if (this.props.subEvents.items && this.props.subEvents.items.length) {
            const subEventNames = []
            for (const subEvent of this.props.subEvents.items) {
                subEventNames.push(`</br><strong>${subEvent.name.fi}</strong> (${moment(subEvent.start_time).format('DD.MM.YYYY')})`)
            }
            subEventWarning = `</br>${this.props.intl.formatMessage('editor-delete-subevents-warning')}</br>${subEventNames}`
        }
        return warningText + subEventWarning
    }

    saveAsDraft(event) {
        let doUpdate = this.props.match.params.action === 'update'
        const {values, contentLanguages} = this.props.editor
        this.setState({isDirty: false})
        this.props.sendData(values, contentLanguages, this.props.user, doUpdate, constants.PUBLICATION_STATUS.DRAFT)
    }

    saveAsPublished(event) {
        let doUpdate = this.props.match.params.action === 'update'
        const {values, contentLanguages} = this.props.editor
        this.setState({isDirty: false})
        this.props.sendData(values, contentLanguages, this.props.user, doUpdate, constants.PUBLICATION_STATUS.PUBLIC)
    }

    confirmDelete() {
    // TODO: maybe do a decorator for confirmable actions etc...?
        this.props.confirm(
            'confirm-delete',
            'warning',
            'delete',
            {
                action: () => this.deleteEvents(),
                additionalMsg: getStringWithLocale(this.props, 'editor.values.name', 'fi'),
                additionalMarkup: this.getWarningMarkup(),
            }
        )
    }

    deleteEvents() {
        if (this.props.subEvents.items.length) {
            for (const subEvent of this.props.subEvents.items) {
                this.deleteSubEvent(subEvent.id, this.props.user)
            }
        }
        return this.props.deleteEvent(this.props.match.params.eventId, this.props.user)
    }

    deleteSubEvent(eventId) {
        return this.props.deleteEvent(eventId, this.props.user)
    }

    confirmCancel() {
    // TODO: maybe do a decorator for confirmable actions etc...?
        this.props.confirm(
            'confirm-cancel',
            'warning',
            'cancel-event',
            {
                action: e => this.props.cancelEvent(this.props.match.params.eventId, this.props.user, this.props.editor.values),
                additionalMsg: getStringWithLocale(this.props, 'editor.values.name', 'fi'),
            }
        )
    }

    render() {
        var sharedProps = {
            disabled: this.state.disabled,
        }

        let buttonStyle = {
            height: '64px',
            margin: '0 5px',
        }

        let headerTextId = (this.props.match.params.action === 'update') ? 'edit-event' : 'create-event'

        let clearButton = null
        if(_.keys(this.props.editor.values).length) {
            clearButton = (
                <Button
                    raised
                    onClick={this.clearForm}
                    color="primary"
                    className="pull-right"
                ><FormattedMessage id="clear-form"/> <Close/></Button>
            )
        }

        // TODO: fix flow for non-authorized users
        setTimeout(
            ()=>
            {if (this.props.user && !this.props.user.organization && sentinel) {
                alert(this.props.intl.formatMessage('editor-sentinel-alert'));
                sentinel = false;
            }
            }, 1000);

        return (
            <div className="editor-page">
                <div className="container header">
                    <h1>
                        <FormattedMessage id={headerTextId}/>
                    </h1>
                    <span className="controls">
                        {clearButton}
                    </span>
                </div>

                <div className="container">
                    <FormFields ref="form" action={this.props.match.params.action} editor={this.props.editor} setDirtyState={this.setDirtyState} />
                </div>

                <div className="editor-action-buttons">
                    <div className="container">
                        <div className="row">
                            <Loader loaded={!this.props.editor.isSending} scale={1}/>
                            {this.getActionButtons()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    editor: state.editor,
    subEvents: state.subEvents,
    user: state.user,
})

const mapDispatchToProps = (dispatch) => ({
    fetchEventForEditing: (eventId, user) => dispatch(fetchEventForEditingAction(eventId, user)),
    fetchSubEvents: (eventId, user) => dispatch(fetchSubEventsAction(eventId, user)),
    clearData: () => dispatch(clearDataAction()),
    setValidationErrors: (errors) => dispatch(setValidationErrorsAction(errors)),
    sendData: (formValues, contentLanguages, user, updateExisting, publicationStatus) => 
        dispatch(sendDataAction(formValues, contentLanguages, user, updateExisting, publicationStatus)),
    confirm: (msg, style, actionButtonLabel, data) => dispatch(confirmAction(msg, style, actionButtonLabel, data)),
    deleteEvent: (eventId, user) => dispatch(deleteEventAction(eventId, user)),
    cancelEvent: (eventId, user, values) => dispatch(cancelEventAction(eventId, user, values)),
})

EditorPage.propTypes = {
    match: PropTypes.object,
    fetchEventForEditing: PropTypes.func,
    fetchSubEvents: PropTypes.func,
    setValidationErrors: PropTypes.func,
    clearData: PropTypes.func,
    user: PropTypes.object,
    editor: PropTypes.object,
    subEvents: PropTypes.object,
    sendData: PropTypes.func,
    confirm: PropTypes.func,
    deleteEvent: PropTypes.func,
    cancelEvent: PropTypes.func,
    intl: intlShape.isRequired,
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(EditorPage))
