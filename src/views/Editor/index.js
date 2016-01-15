
// styles
import '!style!css!sass!./index.scss'
import 'style!vendor/stylesheets/typeahead.css'


import React from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import Snackbar from 'material-ui/lib/snackbar';
import { RaisedButton, FlatButton } from 'material-ui'

import {sendData, clearData, clearFlashMsg, fetchKeywordSets, fetchLanguages} from 'src/actions/editor.js'

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

    willReceiveProps() {
        this.forceUpdate()
    },

    componentWillMount() {
        this.props.dispatch(fetchKeywordSets())
        this.props.dispatch(fetchLanguages())
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
