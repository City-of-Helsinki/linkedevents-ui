import 'src/assets/additional_css/bootstrap.custom.min.css';
import 'src/assets/main.scss';

import PropTypes from 'prop-types';

import React from 'react'
import {connect} from 'react-redux'

import Headerbar from 'src/components/Header'
import MaterialButton from 'material-ui/Button';
import {Modal, Well} from 'react-bootstrap';

import {injectIntl, FormattedMessage} from 'react-intl'

import {fetchLanguages as fetchLanguagesAction, fetchKeywordSets as fetchKeywordSetsAction} from '../../actions/editor'
import {retrieveUserFromSession as retrieveUserFromSessionAction} from '../../actions/user'

import {cancelAction, doAction} from 'src/actions/app'

import {MuiThemeProvider} from 'material-ui/styles'
import {HelTheme} from 'src/themes/hel'
import Notifications from '../Notification'

class App extends React.Component {

    static propTypes = {
        children: PropTypes.node,
        fetchKeywordSets: PropTypes.func,
        cancel: PropTypes.func,
        do: PropTypes.func,
    };

    static childContextTypes = {
        muiTheme: PropTypes.object,
        intl: PropTypes.object,
        dispatch: PropTypes.func,
    };

    getChildContext() {
        return {
            muiTheme: HelTheme,
            dispatch: this.props.dispatch,
            intl: this.props.intl,
        }
    }

    UNSAFE_componentWillMount() {
        // fetch Hel.fi languages
        this.props.fetchLanguages()

        // Prefetch editor related hel.fi categories
        this.props.fetchKeywordSets()

        // Fetch userdata
        this.props.retrieveUserFromSession()
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
            marginLeft: '10px',
            color: 'white',
            backgroundColor: HelTheme.palette.primary.main,
        }

        let warningButtonStyle = {
            marginLeft: '10px',
            color: 'white',
            backgroundColor: HelTheme.palette.secondary.main,
        }
        let useWarningButtonStyle = false
        if (this.props.app.confirmAction && this.props.app.confirmAction.style === 'warning') {
            useWarningButtonStyle = true
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
                <p>Sinulla ei ole vielä oikeutta hallinnoida yhdenkään yksikön tapahtumia.
                    Ota yhteyttä <a href="mailto:aleksi.salonen@hel.fi">Aleksi Saloseen</a> saadaksesi oikeudet muokata yksikkösi tapahtumia.</p>
                <p>Jos olet jo saanut käyttöoikeudet, kirjautumisesi saattaa olla vanhentunut. Kokeile sivun päivittämistä (F5) ja kirjautumista uudestaan.</p>
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
                    <Notifications flashMsg={this.props.app.flashMsg} />
                    <Modal show={(!!this.props.app.confirmAction)} dialogClassName="custom-modal" onHide={e => this.props.dispatch(cancelAction())}>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                            <p>{confirmMsg}</p>
                            <p><strong>{additionalMsg}</strong></p>
                            <div dangerouslySetInnerHTML={getMarkup()}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <MaterialButton 
                                style={buttonStyle} 
                                onClick={e => this.props.cancel()}>
                                <FormattedMessage id="cancel" />
                            </MaterialButton>

                            <MaterialButton 
                                style={useWarningButtonStyle ? warningButtonStyle : buttonStyle} 
                                onClick={e => this.props.do(this.props.app.confirmAction.data)}>
                                <FormattedMessage id={actionButtonLabel} />
                            </MaterialButton>
                        </Modal.Footer>
                    </Modal>
                </div>
            </MuiThemeProvider>
        )
    }
}

App.propTypes = {
    intl: PropTypes.object,
    app: PropTypes.object,
    user: PropTypes.object,
    dispatch: PropTypes.func,
    fetchLanguages: PropTypes.func,
    retrieveUserFromSession: PropTypes.func,
}

const mapStateToProps = (state) => ({
    editor: state.editor,
    user: state.user,
    app: state.app,
})

const mapDispatchToProps = (dispatch) => ({
    fetchKeywordSets: () => dispatch(fetchKeywordSetsAction()),
    fetchLanguages:() => dispatch(fetchLanguagesAction()),
    retrieveUserFromSession: () => dispatch(retrieveUserFromSessionAction()),
    do: (data) => dispatch(doAction(data)),
    cancel: () => dispatch(cancelAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(App))
