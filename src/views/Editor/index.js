
// styles
import '!style!css!sass!./index.scss'
import 'style!vendor/stylesheets/typeahead.css'

import React from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import { RaisedButton, FlatButton } from 'material-ui'

import { getStringWithLocale } from 'src/utils/locale'

import {fetchEventForEditing, deleteEvent as deleteEventAction, cancelEvent as cancelEventAction, sendData, clearData, fetchKeywordSets, fetchLanguages, setValidationErrors} from 'src/actions/editor.js'
import {confirmAction, clearFlashMsg} from 'src/actions/app.js'

import constants from 'src/constants.js'

// the backup doesn't support non-language links, so we use hardcoded
// 'fi' instead for the link language
var EXT_LINK_NO_LANGUAGE = 'fi'

import FormFields from 'src/components/FormFields'

// === code ===
//
//

var EditorPage = React.createClass({

    getInitialState() {
        return {
            canSubmit: false,
            disabled: false
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

    getDeleteOrCancelButton: function() {
        let buttonStyle = {
            height: '64px',
            margin: '0 10px'
        }

        if(this.props.params.action === 'update') {
            let publicationStatus = _.get(this.props, 'editor.values.publication_status')

            if (publicationStatus === constants.PUBLICATION_STATUS.DRAFT) {
                return (
                    <RaisedButton
                        style={buttonStyle}
                        label="Poista tapahtuma"
                        onClick={ (e) => this.deleteEvent(e) }
                        />
                )
            } else if (publicationStatus === constants.PUBLICATION_STATUS.PUBLIC) {
                return (
                    <RaisedButton
                        style={buttonStyle}
                        label="Peruuta tapahtuma"
                        onClick={ (e) => this.cancelEvent(e) }
                        />
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

        if(this.props.params.action === 'update' && publicationStatus === constants.PUBLICATION_STATUS.PUBLIC) {
            return (
                <RaisedButton
                    style={buttonStyle}
                    label="Tallenna muutokset julkaistuun tapahtumaan"
                    primary={true}
                    onClick={ (e) => this.saveAsPublished(e) }
                />
            )
        } else {
            return (
                <span>
                    <RaisedButton
                        style={buttonStyle}
                        label="Tallenna ja siirry esikatseluun"
                        primary={true}
                        onClick={ (e) => this.saveAsDraft(e) }
                    />
                    <FlatButton
                        style={buttonStyle}
                        label="Julkaise tapahtuma"
                        onClick={ (e) => this.saveAsPublished(e) }
                    />
                </span>
            )
        }
    },

    getActionButtons: function() {
        return (
            <div className="actions">
                { this.getDeleteOrCancelButton() }
                { this.getSaveButtons() }
            </div>
        )
    },

    componentWillMount() {
        if(this.props.params.action === 'update' && this.props.params.eventId) {
            this.props.dispatch(fetchEventForEditing(this.props.params.eventId, this.props.user))
        }
    },

    componentWillUnmount() {
        this.props.dispatch(setValidationErrors({}))
    },

    clearForm() {
        this.props.dispatch(clearData())
    },

    goToPreview(event) {
        // console.log(event)
    },

    saveAsDraft(event) {
        let doUpdate = this.props.params.action === 'update'
        this.props.dispatch(sendData(this.props.editor.values, this.props.user, doUpdate, constants.PUBLICATION_STATUS.DRAFT))
    },

    saveAsPublished(event) {
        let doUpdate = this.props.params.action === 'update'
        this.props.dispatch(sendData(this.props.editor.values, this.props.user, doUpdate, constants.PUBLICATION_STATUS.PUBLIC))
    },

    deleteEvent() {
        // TODO: maybe do a decorator for confirmable actions etc...?
        this.props.dispatch(
            confirmAction(
                'confirm-delete',
                'warning',
                'delete',
                {
                    action: e => this.props.dispatch(deleteEventAction(this.props.params.eventId, this.props.user)),
                    additionalMsg: getStringWithLocale(this.props, 'editor.values.name', 'fi')
                }
            )
        )
    },

    cancelEvent() {
        // TODO: maybe do a decorator for confirmable actions etc...?
        this.props.dispatch(
            confirmAction(
                'confirm-cancel',
                'warning',
                'cancel',
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
            clearButton = (<RaisedButton onClick={this.clearForm} primary={true} className="pull-right" label={<span><FormattedMessage id="clear-form"/><i className="material-icons">&#xE14C;</i></span>}/>)
        }

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
                    <FormFields ref="form" action={this.props.params.action} editor={this.props.editor} />
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
    user: state.user
}))(EditorPage)
