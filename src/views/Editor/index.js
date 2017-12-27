
// styles
import '!style-loader!css-loader!sass-loader!./index.scss'
import 'style-loader!vendor/stylesheets/typeahead.css'

import React from 'react'
import Loader from 'react-loader'
import {connect} from 'react-redux'
import { Lifecycle } from 'react-router'
import {FormattedMessage} from 'react-intl'
import moment from 'moment'

import { Button } from 'material-ui'
// Material-ui Icons
import Close from 'material-ui-icons/Close'

import { getStringWithLocale } from 'src/utils/locale'

import {fetchEventForEditing, deleteEvent as deleteEventAction, cancelEvent as cancelEventAction, sendData, clearData, fetchKeywordSets, fetchLanguages, setValidationErrors} from 'src/actions/editor.js'
import {confirmAction, clearFlashMsg} from 'src/actions/app.js'
import {fetchSubEvents} from 'src/actions/subEvents.js'

import constants from 'src/constants.js'

// the backup doesn't support non-language links, so we use hardcoded
// 'fi' instead for the link language
var EXT_LINK_NO_LANGUAGE = 'fi'

// sentinel for authentication alert
var sentinel = true;

import FormFields from 'src/components/FormFields'

// === code ===
//
//

var EditorPage = React.createClass({
    mixins: [ Lifecycle ],

    getInitialState() {
        this.handler = (ev) => {
            ev.preventDefault();
            if (this.state.isDirty) {
                (ev || window.event).returnValue = null;
                return null
            }
        }
        return {
            canSubmit: false,
            disabled: false,
            isDirty: false
        }
    },

    componentWillMount() {
        if(this.props.params.action === 'update' && this.props.params.eventId) {
            this.props.dispatch(fetchEventForEditing(this.props.params.eventId, this.props.user))
            this.props.dispatch(fetchSubEvents(this.props.params.eventId, this.props.user))
        }
    },

    componentDidMount() {
        window.addEventListener("beforeunload", this.handler)
    },

    componentWillReceiveProps: function(nextProps) {
        // Check if we are changing the editing mode on fly
        // (happens when jumping from update event page to create event page)
        // Clear page or fetch new eventdata accordingly
        if(nextProps.params && this.props.params.action !== nextProps.params.action) {
            if(nextProps.params.action === 'update') {
                this.props.dispatch(fetchEventForEditing(this.props.params.eventId), this.props.user)
            } else {
                this.props.dispatch(clearData())
            }
        }

        this.forceUpdate()
    },

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.handler)
        this.props.dispatch(setValidationErrors({}))
    },

    routerWillLeave(nextLocation) {
        if (this.state.isDirty) {
            return 'Muutoksiasi ei ole tallennettu.\n\nOletko varma että haluat jatkaa?'
        }
    },

    setDirtyState() {
        if (!this.state.isDirty) {
            this.setState({ isDirty: true })
        }
    },

    enableButton() {
        return this.setState({
            canSubmit: true
        });
    },

    disableButton() {
        return this.setState({
            canSubmit: false
        });
    },

    getDeleteButton: function() {
        let buttonStyle = {
            height: '64px',
            margin: '0 10px'
        }

        if(this.props.params.action === 'update') {
            let publicationStatus = _.get(this.props, 'editor.values.publication_status')

            if (publicationStatus === constants.PUBLICATION_STATUS.DRAFT) {
                return (
                    <Button
                        raised
                        style={buttonStyle}
                        onClick={ (e) => this.confirmDelete(e) }>Poista tapahtuma</Button>
                )
            }
            if (publicationStatus === constants.PUBLICATION_STATUS.PUBLIC) {
                return (
                    <Button
                        raised
                        style={buttonStyle}
                        onClick={ (e) => this.confirmDelete(e) }>Poista tapahtuma</Button>
                    )
            }
        }
    },

    getCancelButton: function() {
        let buttonStyle = {
            height: '64px',
            margin: '0 10px'
        }

        if(this.props.params.action === 'update') {
            let publicationStatus = _.get(this.props, 'editor.values.publication_status')

            if (publicationStatus === constants.PUBLICATION_STATUS.PUBLIC) {
                return (
                    <Button
                        raised
                        style={buttonStyle}
                        onClick={ (e) => this.confirmCancel(e) }>Peruuta tapahtuma</Button>
                )
            } else {
                return null
            }
        }
    },

    getSaveButtons: function() {
        let buttonStyle = {
            height: '64px',
            margin: '0 10px'
        }
        let publicationStatus = _.get(this.props, 'editor.values.publication_status')
        let labelText = this.props.editor.isSending ? "Julkaistaan tapahtumaa" : "Julkaise tapahtuma"
        if (_.keys(this.props.editor.values.sub_events).length > 0) {
            labelText = this.props.editor.isSending ? "Julkaistaan tapahtumia" : "Julkaise tapahtumat"
        }
        if(this.props.params.action === 'update' && publicationStatus === constants.PUBLICATION_STATUS.PUBLIC) {
            return (
                <Button
                    raised
                    style={buttonStyle}
                    color="primary"
                    onClick={ (e) => this.saveAsPublished(e) }
                >Tallenna muutokset julkaistuun tapahtumaan</Button>
            )
        } else {
            return (
                <span>
                    <Loader loaded={!this.props.editor.isSending} scale={1}/>
                    <Button
                        raised
                        style={buttonStyle}
                        color="primary"
                        disabled={this.props.editor.isSending || (this.props.user && !this.props.user.organization)}
                        onClick={ (e) => this.saveAsPublished(e) }
                    >{labelText}</Button>
                </span>
            )
        }
    },

    getActionButtons: function() {
        return (
            <div className="actions">
                { this.getDeleteButton() }
                { this.getCancelButton() }
                { this.getSaveButtons() }
            </div>
        )
    },

    clearForm() {
        this.props.dispatch(clearData())
    },

    goToPreview(event) {
        // console.log(event)
    },

    getWarningMarkup() {
        let warningText = 'VAROITUS: Tämä toiminto poistaa tapahtuman lopullisesti. Voit tarvittaessa myös perua tapahtuman tai lykätä sitä.<br/>'
        let subEventWarning = ''
        if (this.props.subEvents.items && this.props.subEvents.items.length) {
            const subEventNames = []
            for (const subEvent of this.props.subEvents.items) {
                subEventNames.push(`</br><strong>${subEvent.name.fi}</strong> (${moment(subEvent.start_time).format("DD.MM.YYYY")})`)
            }
            subEventWarning = '</br>Poistaessasi tämän tapahtuman myös seuraavat alitapahtumat poistetaan:</br>' + subEventNames
        }
        return warningText + subEventWarning
    },

    saveAsDraft(event) {
        let doUpdate = this.props.params.action === 'update'
        const {values, contentLanguages} = this.props.editor
        this.setState({ isDirty: false })
        this.props.dispatch(sendData(values, contentLanguages, this.props.user, doUpdate, constants.PUBLICATION_STATUS.DRAFT))
    },

    saveAsPublished(event) {
        let doUpdate = this.props.params.action === 'update'
        const {values, contentLanguages} = this.props.editor
        this.setState({ isDirty: false })
        this.props.dispatch(sendData(values, contentLanguages, this.props.user, doUpdate, constants.PUBLICATION_STATUS.PUBLIC))
    },

    confirmDelete() {
        // TODO: maybe do a decorator for confirmable actions etc...?
        this.props.dispatch(
            confirmAction(
                'confirm-delete',
                'warning',
                'delete',
                {
                    action: () => this.deleteEvents(),
                    additionalMsg: getStringWithLocale(this.props, 'editor.values.name', 'fi'),
                    additionalMarkup: this.getWarningMarkup()
                }
            )
        )
    },

    deleteEvents() {
        if (this.props.subEvents.items.length) {
            for (const subEvent of this.props.subEvents.items) {
                this.deleteSubEvent(subEvent.id, this.props.user)
            }
        }
        return this.props.dispatch(deleteEventAction(this.props.params.eventId, this.props.user))
    },

    deleteSubEvent(eventId) {
        return this.props.dispatch(deleteEventAction(eventId, this.props.user))
    },

    confirmCancel() {
        // TODO: maybe do a decorator for confirmable actions etc...?
        this.props.dispatch(
            confirmAction(
                'confirm-cancel',
                'warning',
                'cancel-event',
                {
                    action: e => this.props.dispatch(cancelEventAction(this.props.params.eventId, this.props.user, this.props.editor.values)),
                    additionalMsg: getStringWithLocale(this.props, 'editor.values.name', 'fi')
                }
            )
        )
    },

    render() {
        var sharedProps = {
            disabled: this.state.disabled
        }

        let buttonStyle = {
            height: '64px',
            margin: '0 5px'
        }

        let headerTextId = (this.props.params.action === 'update') ? 'edit-event' : 'create-event'

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
                    alert("Voit katsella lomaketta, mutta sinulla ei ole oikeuksia julkaista tai muokata tapahtumia. Et ole kirjautunut sisään tai kirjautumisesi on vanhentunut.")
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
                    <FormFields ref="form" action={this.props.params.action} editor={this.props.editor} setDirtyState={this.setDirtyState} />
                </div>

                <div className="editor-action-buttons">
                    <div className="container">
                        <div className="row">
                            <div className="pull-right">
                                {this.getActionButtons()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export default connect((state) => ({
    editor: state.editor,
    subEvents: state.subEvents,
    user: state.user
}))(EditorPage)
