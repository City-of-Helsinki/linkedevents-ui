require('!style-loader!css-loader!src/assets/additional_css/bootstrap.custom.min.css');
require('!style-loader!css-loader!sass-loader!src/assets/main.scss');

import PropTypes from 'prop-types';

import React from 'react'
import {connect} from 'react-redux'

import Headerbar from 'src/components/Header'
import Snackbar from 'material-ui/Snackbar';
import MaterialButton from 'material-ui/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well'

import {injectIntl} from 'react-intl'

import {retrieveUserFromSession} from 'src/actions/user'
import {fetchKeywordSets, fetchLanguages} from 'src/actions/editor.js'
import {clearFlashMsg, cancelAction, doAction} from 'src/actions/app.js'
import {FormattedMessage} from 'react-intl'

// Material-ui theming
import { MuiThemeProvider } from 'material-ui/styles'
import { HelTheme } from 'src/themes/hel'

class Notifications extends React.Component {

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(nextProps, this.props)
    }

    render() {
        let flashMsg = (<span/>)
        let sticky =  this.props.flashMsg && this.props.flashMsg.sticky

        if(this.props.flashMsg && this.props.flashMsg.data.response && this.props.flashMsg.data.response.status == 400) {
            flashMsg = _.values(_.omit(this.props.flashMsg.data, ['apiErrorMsg', 'response'])).join(' ')
            sticky = true
        }
        else if(this.props.flashMsg && this.props.flashMsg.msg && this.props.flashMsg.msg.length) {
            flashMsg = (<FormattedMessage id={this.props.flashMsg.msg} />)
        }

        let duration = sticky ? null : 7000
        let closeFn = sticky ? function() {} : () => this.props.dispatch(clearFlashMsg())

        let actionLabel = this.props.flashMsg && this.props.flashMsg.action && this.props.flashMsg.action.label
        let actionFn = this.props.flashMsg && this.props.flashMsg.action && this.props.flashMsg.action.fn

        return (
            <Snackbar
              className="notification-bar"
              open={(!!this.props.flashMsg)}
              message={flashMsg}
              autoHideDuration={duration}
              onRequestClose={closeFn}
              action={actionLabel}
              action={[
                <Button key="snackActionButton" onClick={actionFn}>
                  {actionLabel}
                </Button>
              ]}
              />
        )
    }
}

class App extends React.Component {

    static propTypes = {
        children: PropTypes.node,
    };

    static childContextTypes = {
        muiTheme: PropTypes.object,
        intl: PropTypes.object,
        dispatch: PropTypes.func
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

        let additionalMarkup = (<div/>)
        if(this.props.app.confirmAction && this.props.app.confirmAction.data && this.props.app.confirmAction.data.additionalMarkup) {
            additionalMarkup = this.props.app.confirmAction.data.additionalMarkup
        }
        const getMarkup = () => ({__html: additionalMarkup})

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
            organization_missing_msg = <Well><h4>Tervetuloa käyttämään Linked Eventsiä, {this.props.user.displayName}!</h4>
                <p>Sinulla ei ole vielä oikeutta hallinnoida yhdenkään viraston tapahtumia.
                    Ota yhteyttä <a href="mailto:aleksi.salonen@hel.fi">Aleksi Saloseen</a> saadaksesi oikeudet muokata virastosi tapahtumia.</p>
                <p>Jos olet jo saanut käyttöoikeudet, kirjautumisesi saattaa olla vanhentunut. Pahoittelemme, kokeile päivittää sivu (F5) ja kirjautua uudestaan.</p>
            </Well>
        } else {
            organization_missing_msg = null;
        }

        return (
            <MuiThemeProvider theme={HelTheme}>
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
                        <p><strong>{additionalMsg}</strong></p>
                        <div dangerouslySetInnerHTML={getMarkup()}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <MaterialButton style={buttonStyle} label={<FormattedMessage id="cancel" />} onClick={e => this.props.dispatch(cancelAction())} />
                        <MaterialButton style={buttonStyle} backgroundColor={isWarningModal ? 'rgba(255,160,160,1)' : null} label={<FormattedMessage id={actionButtonLabel} />} onClick={e => this.props.dispatch(doAction(this.props.app.confirmAction.data))} />
                    </Modal.Footer>
                    </Modal>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default connect((state) => ({
    editor: state.editor,
    user: state.user,
    app: state.app
}))(injectIntl(App))