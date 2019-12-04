import './index.scss'

import React from 'react'
import {connect} from 'react-redux'
import {FormattedMessage, injectIntl, intlShape} from 'react-intl'
import {get} from 'lodash'
import PropTypes from 'prop-types'
import {Button, CircularProgress} from 'material-ui'
import Tooltip from 'material-ui/Tooltip'
import Close from 'material-ui-icons/Close'
import {
    executeSendRequest as executeSendRequestAction,
    clearData as clearDataAction,
    setEditorAuthFlashMsg as setEditorAuthFlashMsgAction,
    setLanguages as setLanguageAction,
    setEventForEditing as setEventForEditingAction,
} from '../../actions/editor'
import {confirmAction, clearFlashMsg as clearFlashMsgAction} from '../../actions/app'
import constants from '../../constants'
import {checkEventEditability} from '../../utils/checkEventEditability'
import FormFields from '../../components/FormFields'
import showConfirmationModal from '../../utils/confirm'
import {
    appendEventDataWithSubEvents,
    EventQueryParams,
    fetchEvent,
    getEventsWithSubEvents,
} from '../../utils/events'
import {push} from 'react-router-redux'
import moment from 'moment'
import {hasAffiliatedOrganizations} from '../../utils/user'

const {PUBLICATION_STATUS, SUPER_EVENT_TYPE_UMBRELLA, USER_TYPE} = constants

// sentinel for authentication alert
let sentinel = true

export class EditorPage extends React.Component {

    form = React.createRef()

    state = {
        event: {},
        superEvent: {},
        subEvents: [],
        loading: false,
        isDirty: false,
        isRegularUser: false,
    }

    componentDidMount() {
        this.props.setEditorAuthFlashMsg()
        const params = get(this.props, ['match', 'params'])
        const isRegularUser = get(this.props, ['user', 'userType']) === USER_TYPE.REGULAR

        this.setState({isRegularUser})

        if(params.action === 'update' && params.eventId) {
            this.fetchEventData()
        }
    }

    componentDidUpdate(prevProps) {
        const prevParams = get(prevProps, ['match', 'params'], {})
        const currParams = get(this.props, ['match', 'params'], {})

        // check if the editing mode or if the eventId params changed
        if (prevParams.action !== currParams.action || prevParams.eventId !== currParams.eventId) {
            currParams.action  === 'update'
                ? this.fetchEventData()
                : this.clearEventData()

            if (currParams.action === 'update') {
                this.fetchEventData()
            } else {
                this.clearEventData()
                this.setState({
                    event: {},
                    superEvent: {},
                    subEvents: [],
                })
            }
        }
    }

    componentWillUnmount() {
        this.props.clearFlashMsg()
        this.clearEventData()
    }

    /**
     * Fetches the event, sub event and super event data for the event that is being updated
     */
    fetchEventData = () => {
        const {setEventForEditing} = this.props
        const eventId = get(this.props, ['match', 'params', 'eventId'])

        if (!eventId) {
            return
        }

        this.setState({loading: true})

        const queryParams = new EventQueryParams()
        queryParams.include = 'keywords,location,audience,in_language,external_links,image,sub_events'
        queryParams.nocache = moment().unix()

        fetchEvent(eventId, queryParams, true)
            .then(eventData => {
                const [event, subEvents, superEvent] = eventData
                this.setState({event, superEvent, subEvents, loading: false})
                setEventForEditing(event)
            })
            .catch(() => this.setState({loading: false}))
    }

    /**
     * Clears the editor data and the event, super event and sub events from the store
     */
    clearEventData = () => {
        const {clearData} = this.props
        clearData()

        // Reset the state of the HelDatePicker and HelTimePicker components
        this.form.current.refs.start_time.refs.date.resetDate();
        this.form.current.refs.start_time.resetTime();
        
        this.form.current.refs.end_time.refs.date.resetDate();
        this.form.current.refs.end_time.resetTime();
    }

    setDirtyState = () => {
        if (!this.state.isDirty) {
            this.setState({isDirty: true})
        }
    }

    eventIsPublished = () => {
        if (this.props.match.params.action !== 'update') {
            // we are not updating an existing event
            return false
        }
        let publicationStatus = get(this.props, 'editor.values.publication_status')
        if (!publicationStatus) {
            // if the field is missing, the user is not logged in, so the event is public
            return true
        }
        if (publicationStatus === PUBLICATION_STATUS.PUBLIC) {
            return true
        }
        // the publication status field exists and the event is not public
        return false
    }

    /**
     * Returns a button for the given action
     * @param action    Action to run
     * @param onClick   onClick function that should be used instead of the default one
     * @returns {*}
     */
    getActionButton = (action, onClick) => {
        const eventIsPublished = this.eventIsPublished()
        const {event, loading, isRegularUser} = this.state
        const {user, editor, intl} = this.props
        const formHasSubEvents = get(editor, ['values', 'sub_events'], []).length > 0
        const isDraft = get(event, 'publication_status') === PUBLICATION_STATUS.DRAFT
        const {editable, explanationId} = checkEventEditability(user, event, action)
        const disabled = !editable || loading

        let color = 'default'
        let buttonLabel = formHasSubEvents ? `${action}-events` : `${action}-event`

        if (action === 'return') {
            buttonLabel = 'return-without-saving'
        }
        if (action === 'update') {
            color = 'primary'
            buttonLabel = isRegularUser
                ? isDraft ? 'event-action-save-draft-existing' : 'event-action-save-draft-new'
                : eventIsPublished ? 'event-action-save-existing' : 'event-action-save-new'

            if (!eventIsPublished && formHasSubEvents) {
                buttonLabel = 'event-action-save-multiple'
            }
        }
        if (action === 'cancel' || action === 'delete') {
            color = 'accent'
        }

        const button = <Button
            raised
            disabled={disabled}
            className={`editor-${action}-button`}
            onClick={() => onClick ? onClick() : this.confirmAction(action)}
            color={color}
        >
            <FormattedMessage id={buttonLabel}/>
        </Button>

        return disabled && explanationId
            ? <Tooltip title={intl.formatMessage({id: explanationId})}>
                <span>{button}</span>
            </Tooltip>
            : button
    }

    /**
     * Saves the editor changes
     */
    saveChanges = () => {
        const {subEvents, isRegularUser} = this.state
        const {match, editor: {values: formValues}, executeSendRequest} = this.props
        const updateExisting = get(match, ['params', 'action']) === 'update'
        const publicationStatus = isRegularUser
            ? PUBLICATION_STATUS.DRAFT
            : PUBLICATION_STATUS.PUBLIC

        this.setState({isDirty: false})
        executeSendRequest(formValues, updateExisting, publicationStatus, subEvents)
    }

    /**
     * Opens a confirmation modal and runs the given action
     * @param action    Action to run
     */
    confirmAction = (action) => {
        const {confirm, intl, routerPush} = this.props;
        const {event, subEvents} = this.state
        const customAction = action === 'update' ? this.saveChanges : undefined
        let eventData = [event, ...subEvents]

        // opens the confirm modal
        const doConfirm = (data) => {
            showConfirmationModal(data, action, confirm, intl, event.publication_status, customAction)
                .then(() => {
                    // navigate to event listing after delete action
                    if (action === 'delete') {
                        routerPush('/')
                    }
                    // navigate to event view after cancel action
                    if (action === 'cancel') {
                        routerPush(`/event/${event.id}`)
                    }
                })
        }

        // get the id's of events that have sub events
        // don't re-fetch sub event data for the event that the action is run for, as we already have it
        const eventsWithSubEvents = getEventsWithSubEvents(eventData)
            .filter(eventId => eventId !== event.id)

        // we need to append the event data with sub events of recurring events,
        // when we're running the action for an umbrella event
        eventsWithSubEvents.length > 0
            ? appendEventDataWithSubEvents(eventData, eventsWithSubEvents)
                .then((appendedData) => doConfirm(appendedData))
            : doConfirm(eventData)
    }

    /**
     * Navigates to the moderation page
     */
    navigateToModeration = () => {
        const {routerPush} = this.props
        routerPush('/moderation')
    }

    render() {
        const {editor, user, match, organizations, intl} = this.props
        const {event, subEvents, superEvent, loading} = this.state
        const editMode = get(match, ['params', 'action'])
        const isUmbrellaEvent = get(editor, ['values', 'super_event_type']) === SUPER_EVENT_TYPE_UMBRELLA
        const isDraft = get(event, ['publication_status']) === PUBLICATION_STATUS.DRAFT
        const hasSubEvents = subEvents && subEvents.length > 0
        const headerTextId = editMode === 'update'
            ? 'edit-event'
            : 'create-event'

        // TODO: fix flow for non-authorized users
        if (user && !user.organization && sentinel) {
            setTimeout(() => alert(intl.formatMessage({id:'editor-sentinel-alert'})), 1000);
            sentinel = false;
        }

        return (
            <div className="editor-page">
                <div className="container header">
                    <h1>
                        <FormattedMessage id={headerTextId}/>
                    </h1>
                    <span className="controls">
                        <Button
                            raised
                            onClick={this.clearEventData}
                            color="primary"
                            className="pull-right"
                        >
                            <FormattedMessage id="clear-form"/><Close/>
                        </Button>
                    </span>
                </div>

                <div className="container">
                    <FormFields
                        ref={this.form}
                        action={editMode}
                        editor={editor}
                        event={event}
                        superEvent={superEvent}
                        user={user}
                        organizations={organizations}
                        setDirtyState={this.setDirtyState}
                    />
                </div>

                <div className="editor-action-buttons">
                    {loading
                        ? <CircularProgress className="loading-spinner" size={50}/>
                        : <div className='buttons-group container'>
                            {editMode === 'update' && this.getActionButton('cancel')}
                            {editMode === 'update' && this.getActionButton('delete')}
                            {isDraft && hasAffiliatedOrganizations(user) &&
                                this.getActionButton('return', this.navigateToModeration)}
                            {// show confirmation modal when the updated event has sub events and isn't an umbrella event, otherwise save directly
                                this.getActionButton(
                                    'update',
                                    !hasSubEvents || isUmbrellaEvent ? this.saveChanges : undefined
                                )}
                        </div>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    editor: state.editor,
    user: state.user,
    organizations: state.organizations.admin,
})

const mapDispatchToProps = (dispatch) => ({
    setEventForEditing: (eventId, user) => dispatch(setEventForEditingAction(eventId, user)),
    clearData: () => dispatch(clearDataAction()),
    setEditorAuthFlashMsg: () => dispatch(setEditorAuthFlashMsgAction()),
    setLanguages: (languages) => dispatch(setLanguageAction(languages)),
    clearFlashMsg: () => dispatch(clearFlashMsgAction()),
    executeSendRequest: (formValues, updateExisting, publicationStatus, subEvents) =>
        dispatch(executeSendRequestAction(formValues, updateExisting, publicationStatus, subEvents)),
    confirm: (msg, style, actionButtonLabel, data) => dispatch(confirmAction(msg, style, actionButtonLabel, data)),
    routerPush: (url) => dispatch(push(url)),
})

EditorPage.propTypes = {
    match: PropTypes.object,
    intl: intlShape.isRequired,
    editor: PropTypes.object,
    user: PropTypes.object,
    organizations: PropTypes.arrayOf(PropTypes.object),
    setEventForEditing: PropTypes.func,
    clearData: PropTypes.func,
    setEditorAuthFlashMsg: PropTypes.func,
    setLanguages: PropTypes.func,
    clearFlashMsg: PropTypes.func,
    executeSendRequest: PropTypes.func,
    confirm: PropTypes.func,
    routerPush: PropTypes.func,
    event: PropTypes.object,
    superEvent: PropTypes.object,
    subEvents: PropTypes.array,
    loading: PropTypes.bool,
    isDirty: PropTypes.bool,
    isRegularUser: PropTypes.bool,
}
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(EditorPage))
