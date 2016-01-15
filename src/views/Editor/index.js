
// styles
import '!style!css!sass!./index.scss'
import 'style!vendor/stylesheets/typeahead.css'

// js
import typeahead from 'typeahead.js'
import constants from 'src/constants.js'

// react-specific
import Formsy from 'formsy-react'
import React from 'react'
import {connect} from 'react-redux'
import {sendData, clearData, clearFlashMsg, fetchKeywordSets} from 'src/actions/editor.js'

import {FormattedMessage} from 'react-intl'

import Snackbar from 'material-ui/lib/snackbar';

import {
    Input,
    Textarea,
    Row
} from 'formsy-react-components'

import { RaisedButton, FlatButton } from 'material-ui'

// our components
import FF from 'src/formfields.js'
import Typeahead from 'src/typeahead.js'
import API from 'src/api.js'

// === constants ===

// the backup doesn't support non-language links, so we use hardcoded
// 'fi' instead for the link language
var EXT_LINK_NO_LANGUAGE = 'fi'

import FormFields from 'src/components/FormFields'

// === code ===
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

    willReceiveProps() {
        this.forceUpdate()
    },

    componentWillMount() {
        this.props.dispatch(fetchKeywordSets())
    },

    clearForm() {
        this.props.dispatch(clearData())
    },

    goToPreview(event) {
        console.log(event)
    },

    saveAsDraft(event) {
        let doUpdate = this.props.params.action === 'update'
        let data = Object.assign({}, this.props.editor.values, { publication_status: constants.PUBLICATION_STATUS.DRAFT })
        this.props.dispatch(sendData(data, this.props.user, doUpdate))
    },

    saveAsPublished(event) {
        let doUpdate = this.props.params.action === 'update'
        let data = Object.assign({}, this.props.editor.values, { publication_status: constants.PUBLICATION_STATUS.PUBLIC })
        this.props.dispatch(sendData(data, this.props.user, doUpdate))
    },

    render() {
        var sharedProps = {
            disabled: this.state.disabled
        }

        let buttonStyle = {
            height: '72px',
            margin: '0 10px'
        }

        let flashMsg = (<span/>)
        if(this.props.editor.flashMsg) {
            flashMsg = (<FormattedMessage id={this.props.editor.flashMsg.msg} />)
        }

        let headerTextId = (this.props.params.action === 'update') ? 'edit-event' : 'create-event'

        return (
            <div className="editor-page">
                <div className="container header">
                    <h1>
                        <FormattedMessage id={headerTextId}/>
                    </h1>
                    <span className="controls">
                        <RaisedButton onClick={this.clearForm} primary={true} className="pull-right" label={<span><FormattedMessage id="clear-form"/><i className="material-icons">&#xE14C;</i></span>}/>
                    </span>
                </div>
                <Formsy.Form className="form-horizontal"
                             onValid={this.enableButton}
                             onInvalid={this.disableButton}
                             ref="editForm"
                             >
                    <div className="container">
                        <FormFields action={this.props.params.action} editor={this.props.editor} />
                    </div>

                    <div className="editor-action-buttons">
                        <div className="container">
                            <div className="row">
                                <div className="spread-right">
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
                            </div>
                        </div>
                    </div>
                </Formsy.Form>
                <Snackbar
                  open={(!!this.props.editor.flashMsg)}
                  message={flashMsg}
                  bodyStyle={{'backgroundColor': 'rgb(0,108,188)'}}
                  autoHideDuration={6000}
                  onRequestClose={(e) => this.props.dispatch(clearFlashMsg())}
                />
            </div>
        )
    }
});

export default connect((state) => ({
    editor: state.editor,
    user: state.user
}))(EditorPage)
