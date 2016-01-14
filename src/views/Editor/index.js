
// styles
import '!style!css!sass!./index.scss'
import 'style!vendor/stylesheets/typeahead.css'

// js
import typeahead from 'typeahead.js'

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

var EditEventForm = React.createClass({

    getInitialState() {
        return {
            canSubmit: false,
            layout: 'horizontal',
            validatePristine: false,
            disabled: false,
            location_id: '',
        }
    },

    componentDidUpdate() {
        // @trackActionChanges()

        // set up typeahead

        var taOptions = {
            hint: true,
            highlight: true,
            minLength: 1
        };

        var taDatasets = {
            limit: 25,
            display: 'value',
            templates: {
                suggestion(model) {
                   return '<div><class="place_name">' +
                   model.value +
                   '</span><br><span class="place_address">' +
                   model.street_address +
                   '</span></div>';
                },
                empty(d) {
                    return '<p class="repo-name">No Matches</p>';
                }
            },
            source: Typeahead.bloodhoundInstance.ttAdapter()
        };

        var taSelectHandler = (function(evt, item) {
            this.setState({
                location_id: item.id
            });
            return this.refs.__location_search_field.value = item.value;
        }
        ).bind(this);

        var taEm = $('#__location_search_field');
        taEm.typeahead(taOptions, taDatasets);
        return taEm.on('typeahead:selected', taSelectHandler);
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

    clearForm() {
        this.props.dispatch(clearData())
    },

    willReceiveProps() {
        this.forceUpdate()
    },

    componentWillMount() {
        this.props.dispatch(fetchKeywordSets())
    },

    goToPreview(event) {
        console.log(event)
    },

    handleSubmit(event) {
        let doUpdate = this.props.action === 'update'
        this.props.dispatch(sendData(this.props.editor.values, this.props.user, doUpdate))
    },

    render() {
        var sharedProps = {
            layout: this.state.layout,
            validatePristine: this.state.validatePristine,
            disabled: this.state.disabled
        };

        // TODO: move to scss
        let paddingStyle = { paddingBottom: "1em" };
        let greenStyle = {color: 'green'};
        let blueStyle = {color: 'blue'};

        let buttonStyle = {
            height: '72px',
            margin: '0 10px'
        }

        let flashMsg = 'No message'
        if(this.props.editor.flashMsg) {
            flashMsg = (<FormattedMessage id={this.props.editor.flashMsg.msg} />)
        }

        let headerTextId = (this.props.action === 'update') ? 'edit-event' : 'create-event'

        return (
            <div>
                <div className="container header">
                    <h1>
                        <FormattedMessage id={headerTextId}/>
                    </h1>
                    <span className="controls">
                        <RaisedButton onClick={this.clearForm} primary={true} className="pull-right" label={<span><FormattedMessage id="clear-form"/><i className="material-icons">&#xE14C;</i></span>}/>
                    </span>
                </div>
                <Formsy.Form className="form-horizontal"
                             onSubmit={this.handleSubmit}
                             onValid={this.enableButton}
                             onInvalid={this.disableButton}
                             ref="editForm"
                             >
                    <div className="container">
                        <FormFields action={this.props.action} editor={this.props.editor} />
                    </div>

                    <div className="editor-action-buttons">
                        <div className="container">
                            <div className="row">
                                <div className="spread-right">
                                    <RaisedButton
                                        style={buttonStyle}
                                        label="Tallenna vedokseksi"
                                        onClick={ (e) => this.goToPreview(e) }
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
                                        onClick={ (e) => this.handleSubmit(e) }
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

EditEventForm = connect((state) => ({
    editor: state.editor,
    user: state.user
}))(EditEventForm)

var EditorPage = React.createClass({

    getInitialState() {
        return {
            data: {},
            layout: 'horizontal',
            apiErrorMsg: ''
        }
    },

    getLocation(d) {
        var ret = null;
        if ('location' in d && d['location']) {
            if ('@id' in d['location'] && d['location']['@id']) {
                $.ajax({
                    type: 'GET',
                    url: d['location']['@id'],
                    dataType: 'json',
                    complete(response) {
                        return ret = $.parseJSON(response.responseText);
                    },
                    async: false
                });
            }
        }
        return ret;
    },

    render() {
        return (
            <div className="editor-page">
                <EditEventForm
                    eventId={this.props.params.eventId}
                    switchToPreview={this.switchToPreview}
                    updateData={this.updateData}
                    ref="formContainer"
                    action={this.props.params.action}
                    editor={this.props.editor}
                />
            </div>
        )
    }
});

export default connect((state) => ({
    editor: state.editor,
    user: state.user
}))(EditorPage)
