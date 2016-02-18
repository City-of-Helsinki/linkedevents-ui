
// styles
import '!style!css!sass!./index.scss'
import 'style!vendor/stylesheets/typeahead.css'

import React from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import { RaisedButton, FlatButton } from 'material-ui'

import {fetchEventForEditing, deleteEvent as deleteEventAction, sendData, clearData, fetchKeywordSets, fetchLanguages} from 'src/actions/editor.js'
import {confirmAction} from 'src/actions/app.js'


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
                this.props.dispatch(fetchEventForEditing(this.props.params.eventId))
            } else {
                this.props.dispatch(clearData())
            }
        }

        this.forceUpdate()
    },

    getActionButtons: function() {
        let buttonStyle = {
            height: '72px',
            margin: '0 10px'
        }

        if(this.props.params.action === 'update') {
            return (
                <div className="actions">
                    <RaisedButton
                        style={buttonStyle}
                        label="Poista tapahtuma"
                        onClick={ (e) => this.deleteEvent(e) }
                    />
                    <RaisedButton
                        style={buttonStyle}
                        label="Tallenna vedoksena"
                        onClick={ (e) => this.saveAsDraft(e) }
                    />
                    <RaisedButton
                        style={buttonStyle}
                        label="Siirry esikatseluun"
                        primary={true}
                        onClick={ (e) => this.goToPreview(e) }
                    />
                    <FlatButton
                        style={buttonStyle}
                        label="Julkaise tapahtuma"
                        onClick={ (e) => this.saveAsPublished(e) }
                    />
                </div>
            )
        } else {
            return (
                <div className="actions">
                    <RaisedButton
                        style={buttonStyle}
                        label="Tallenna vedokseksi"
                        onClick={ (e) => this.saveAsDraft(e) }
                    />
                    <RaisedButton
                        style={buttonStyle}
                        label="Siirry esikatseluun"
                        primary={true}
                        onClick={ (e) => this.goToPreview(e) }
                    />
                    <FlatButton
                        style={buttonStyle}
                        label="Julkaise tapahtuma"
                        onClick={ (e) => this.saveAsPublished(e) }
                    />
                </div>
            )
        }

    },

    componentWillMount() {
        if(this.props.params.action === 'update' && this.props.params.eventId) {
            this.props.dispatch(fetchEventForEditing(this.props.params.eventId))
        }
    },

    clearForm() {
        this.props.dispatch(clearData())
    },

    goToPreview(event) {
        // console.log(event)
    },

    saveAsDraft(event) {
        let doUpdate = this.props.params.action === 'update'
        let data = Object.assign({}, this.props.editor.values, { publication_status: constants.PUBLICATION_STATUS.DRAFT })
        this.props.dispatch(sendData(data, this.props.user, doUpdate))
    },

    saveAsPublished(event) {

        // TODO: in more redux way. Define validations in editor store and use the store to do validation. It's an app state

        // let validations = this.refs.form.getValidationErrors()
        // if(validations) {
        //     return
        // }

        let doUpdate = this.props.params.action === 'update'
        let data = Object.assign({}, this.props.editor.values, { publication_status: constants.PUBLICATION_STATUS.PUBLIC })
        this.props.dispatch(sendData(data, this.props.user, doUpdate))
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
                    additionalMsg: (this.props.values && this.props.values.name) && (this.props.values.name.fi || this.props.values.name.se || this.props.values.name.en)
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
                    <FormFields ref="form" action={this.props.params.action} editor={this.props.editor} values={this.props.values} />
                </div>

                <div className="editor-action-buttons">
                    <div className="container">
                        <div className="row">
                            <div className="spread-right">
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
    values: state.editor.values,
    user: state.user
}))(EditorPage)
