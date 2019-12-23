import React from 'react'
import ReactDOM from 'react-dom'
import {Route} from 'react-router'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import {Provider, connect} from 'react-redux'
import {ConnectedRouter} from 'react-router-redux'
import {Feedback} from '@material-ui/icons';

// Views
import App from './views/App'
import Editor from './views/Editor'
import Search from './views/Search'
import Help from './views/Help'
import Event from './views/Event'
import EventCreated from './views/EventCreated'
import EventListingPage from './views/EventListing'
import ModerationPage from './views/Moderation/Moderation'

// Actors
import Validator from './actors/validator'

// JA addition
import Serializer from './actors/serializer';
import {report} from './utils/raven_reporter';
import {Modal, Button, Glyphicon} from 'react-bootstrap';

// translation 
import IntlProviderWrapper from './components/IntlProviderWrapper'
import store, {history} from './store'
import {HelTheme} from './themes/hel/material-ui'

// Setup actor for validation. Actor is a viewless component which can listen to store changes
// and send new actions accordingly. Bind the store as this for function
store.subscribe(_.bind(Validator, null, store))

// JA: Serializing state for debugging
store.subscribe(_.bind(Serializer, null, store));

const LayoutContainer = withRouter(connect()(App));

ReactDOM.render(
    <Provider store={store}>
        <IntlProviderWrapper>
            <ConnectedRouter history={history}>
                <LayoutContainer>
                    <Route exact path="/" component={EventListingPage}/>
                    <Route exact path="/event/:eventId" component={Event}/>
                    <Route exact path="/event/:action/:eventId" component={Editor}/>
                    <Route exact path="/event/done/:action/:eventId" component={EventCreated}/>
                    <Route exact path="/search" component={Search}/>
                    <Route exact path="/help" component={Help}/>
                    <Route exact path="/moderation" component={ModerationPage}/>
                </LayoutContainer>
            </ConnectedRouter>
        </IntlProviderWrapper>
    </Provider>,
    document.getElementById('content')
)

class DebugReporterModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''}

        this.handleChange = this.handleChange.bind(this)
        this.report = this.report.bind(this)
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    report() {
        this.props.sendReport(this.state.value);
    }

    render() {
        return <div id="debugreporterform">
            <Modal show={this.props.showModal} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Raportoi virhetilanne</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p>Kuvaile ongelmaa halutessasi</p>
                        <p><textarea cols="40" rows="10" onChange={this.handleChange} value={this.state.value} /></p>
                        <p><button onClick={this.report}>Lähetä raportti</button></p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.close}>Sulje</Button>
                    <div style={{fontSize: '80%', margin: '0.5em'}}>
                        Sovelluksen versiotunniste: {appSettings.commit_hash}
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    }
}

DebugReporterModal.propTypes = {
    sendReport: PropTypes.func,
    showModal: PropTypes.bool,
    close: PropTypes.func,
}

class DebugHelper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {reporting: false}

        this.showReportForm = this.showReportForm.bind(this)
        this.closeReportForm = this.closeReportForm.bind(this)
        this.serializeState = this.serializeState.bind(this)
    }

    showReportForm() {
        this.setState({reporting: true})
    }

    closeReportForm() {
        this.setState({reporting: false})
    }

    serializeState(reportmsg) {
        window.ARG.debug_message = reportmsg;
        window.ARG.commit_hash = appSettings.commit_hash;
        this.closeReportForm();
        report(JSON.stringify(window.ARG));

        window.setTimeout(
            () => alert('Raportti lähetetty, kiitoksia'),
            100);

    }

    render() {
        return <div>
            <DebugReporterModal showModal={this.state.reporting} close={this.closeReportForm} sendReport={this.serializeState} />
            <div id="debughelper">
                <div id="debughelper_container">
                    <Button bsSize="large" onClick={this.showReportForm}>
                        <Feedback style={{marginLeft: HelTheme.spacing(1)}} />
                    </Button>
                </div>
                <div id="slide">Jos tapahtumien hallinnassa tai syöttölomakkeen toiminnassa on virhe, klikkaa {`"raportoi virhe"`}&#x2011;nappia,
                    niin saamme virhetilanteesta tiedon ja voimme tutkia asiaa.</div>
            </div>
        </div>
    }

}

ReactDOM.render(
    <div>
        <DebugHelper />
    </div>,
    document.getElementById('debughelper'));
