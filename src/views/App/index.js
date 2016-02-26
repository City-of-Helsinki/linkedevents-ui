require('!style!css!sass!src/assets/main.scss');

import React from 'react'
import {connect} from 'react-redux'

import Headerbar from 'src/components/Header'
import Snackbar from 'material-ui/lib/snackbar';
import RaisedButton from 'material-ui/lib/raised-button';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

import {injectIntl} from 'react-intl'

import {retrieveUserFromSession} from 'src/actions/user'
import {fetchKeywordSets, fetchLanguages} from 'src/actions/editor.js'
import {clearFlashMsg, cancelAction, doAction} from 'src/actions/app.js'
import {FormattedMessage} from 'react-intl'

// Material-ui theming
import { HelTheme } from 'src/themes/hel'

class Notifications extends React.Component {

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(nextProps, this.props)
    }

    render() {
        let flashMsg = (<span/>)
        if(this.props.flashMsg && this.props.flashMsg.msg && this.props.flashMsg.msg.length) {
            flashMsg = (<FormattedMessage id={this.props.flashMsg.msg} />)
        }

        let sticky =  this.props.flashMsg && this.props.flashMsg.sticky
        let duration = sticky ? null : 7000
        let closeFn = sticky ? function() {} : () => this.props.dispatch(clearFlashMsg())

        let actionLabel = this.props.flashMsg && this.props.flashMsg.action && this.props.flashMsg.action.label
        let actionFn = this.props.flashMsg && this.props.flashMsg.action && this.props.flashMsg.action.fn


        return (
            <Snackbar
              className="notification-bar"
              open={(!!this.props.flashMsg)}
              message={flashMsg}
              bodyStyle={{'backgroundColor': 'rgb(0,108,188)'}}
              autoHideDuration={duration}
              onRequestClose={closeFn}
              action={actionLabel}
              onActionTouchTap={actionFn}
            />
        )
    }
}

class App extends React.Component {

    static propTypes = {
        children: React.PropTypes.node,
    };

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
        intl: React.PropTypes.object,
        dispatch: React.PropTypes.func
        // language: React.PropTypes.object,
        // user: React.PropTypes.object
    };

    getChildContext() {
        return {
            muiTheme: HelTheme,
            //language: this.props.language,
            //user: this.state.user
            dispatch: this.props.dispatch,
            intl: this.props.intl
        }
    }

    componentWillMount() {
        // Prefetch editor related hel.fi categories and event languages
        this.props.dispatch(fetchKeywordSets())
        this.props.dispatch(fetchLanguages())

        // Fetch userdata
        return this.props.dispatch(retrieveUserFromSession())
    }

    render() {

        let confirmMsg = (<span/>)
        if(this.props.app.confirmAction && this.props.app.confirmAction.msg && this.props.app.confirmAction.msg.length) {
            confirmMsg = (<FormattedMessage id={this.props.app.confirmAction.msg} />)
        }

        let additionalMsg = ''
        if(this.props.app.confirmAction && this.props.app.confirmAction.data && this.props.app.confirmAction.data.additionalMsg) {
            additionalMsg = this.props.app.confirmAction.data.additionalMsg
        }

        let buttonStyle = {
            marginLeft: '10px'
        }

        let warningButtonStyle = {
            'marginLeft': '10px',
            background: 'red',
            backgroundColor: 'red'
        }

        let isWarningModal = false;
        if(this.props.app.confirmAction && this.props.app.confirmAction.style === 'warning') {
            isWarningModal = true;
        }

        let actionButtonLabel = 'confirm'
        if(this.props.app.confirmAction && this.props.app.confirmAction.actionButtonLabel && this.props.app.confirmAction.actionButtonLabel.length > 0) {
            actionButtonLabel = this.props.app.confirmAction.actionButtonLabel;
        }
        var organization_missing_msg;
        if (this.props.user && !this.props.user.organization) {
            organization_missing_msg = <div><h1>Tervetuloa käyttämään Linked Eventsiä, {this.props.user.displayName}!</h1>
                <p>Sinulla ei ole vielä oikeutta hallinnoida yhdenkään viraston tapahtumia.
                    Ota yhteyttä <a href="mailto:aleksi.salonen@hel.fi">Aleksi Saloseen</a> saadaksesi oikeudet muokata virastosi tapahtumia.</p>
            </div>
        } else {
            organization_missing_msg = null;
        }

        return (
            <div>
                <Headerbar />
                {organization_missing_msg}
                <div className="content">
                    {this.props.children}
                </div>
                <Notifications flashMsg={this.props.app.flashMsg} dispatch={this.props.dispatch} />
                <Modal show={(!!this.props.app.confirmAction)} dialogClassName="custom-modal" onHide={e => this.props.dispatch(cancelAction())}>
                   <Modal.Header closeButton>
                   </Modal.Header>
                   <Modal.Body>
                     <p>{confirmMsg}</p>
                     <p>{additionalMsg}</p>
                   </Modal.Body>
                   <Modal.Footer>
                     <RaisedButton style={buttonStyle} label={<FormattedMessage id="cancel" />} onClick={e => this.props.dispatch(cancelAction())} />
                     <RaisedButton style={buttonStyle} backgroundColor={isWarningModal ? 'rgba(255,160,160,1)' : null} label={<FormattedMessage id={actionButtonLabel} />} onClick={e => this.props.dispatch(doAction(this.props.app.confirmAction.data))} />
                   </Modal.Footer>
                 </Modal>
            </div>
        )
    }
}

export default connect((state) => ({
    editor: state.editor,
    user: state.user,
    app: state.app
}))(injectIntl(App))
