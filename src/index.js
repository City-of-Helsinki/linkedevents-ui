import Intl from 'intl'


if(window && !window.Intl) {
    window.Intl = Intl
}

import React from 'react'
import ReactDOM from 'react-dom'
import { Route } from 'react-router'
import { Link, withRouter } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory' //'history/createHashHistory'

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider, connect } from 'react-redux'

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import thunk from 'redux-thunk'

import reducers from './reducers'

// Translations
import {IntlProvider, addLocaleData} from 'react-intl';
import fiLocaleData from 'react-intl/locale-data/fi';

import translations from 'src/i18n';
import moment from 'moment'

// Views
import App from './views/App'
import Editor from './views/Editor'
import Search from './views/Search'
import Help from './views/Help'
import Event from './views/Event'
import EventCreated from './views/EventCreated'
import EventListing from './views/EventListing'

// Actors
import Validator from './actors/validator'

// JA addition
import Serializer from './actors/serializer';
import {report} from './utils/raven_reporter';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

// Initialize tap event plugin
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

const history = createHistory()

const allReducers = combineReducers(Object.assign({}, reducers, {
  router: routerReducer
}))

const allMiddlewares = compose(
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(history)),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
)

const store = createStore(allReducers, allMiddlewares)

let locale = 'fi'
moment.locale(locale)

// Setup actor for validation. Actor is a viewless component which can listen to store changes
// and send new actions accordingly. Bind the store as this for function
store.subscribe(_.bind(Validator, null, store))

// JA: Serializing state for debugging
store.subscribe(_.bind(Serializer, null, store));

addLocaleData(fiLocaleData);
const LayoutContainer = withRouter(connect()(App));

ReactDOM.render(
    <Provider store={store}>
        <IntlProvider locale={locale} messages={translations[locale] || {}}>
            <ConnectedRouter history={history}>
                <LayoutContainer>
                    <Route exact path="/" component={EventListing}/>
                    <Route exact path="/event/:eventId" component={Event}/>
                    <Route exact path="/event/:action/:eventId" component={Editor}/>
                    <Route exact path="/event/done/:action/:eventId" component={EventCreated}/>
                    <Route exact path="/search" component={Search}/>
                    <Route exact path="/help" component={Help}/>
                </LayoutContainer>
            </ConnectedRouter>
        </IntlProvider>
    </Provider>,
    document.getElementById('content')
)

var DebugReporterModal = React.createClass({

    getInitialState: function() {
        return {value: ''};
    },

    handleChange: function(event) {
        this.setState({value: event.target.value});
    },

    report: function () {
        this.props.send_report(this.state.value);
    },

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

});

var DebugHelper = React.createClass({

    getInitialState() {
        return {reporting: false};
    },

    show_reportform() {
        this.setState({reporting: true})
    },

    close_reportform() {
        this.setState({reporting: false})
    },

    serialize_state(reportmsg) {
        window.ARG.debug_message = reportmsg;
        window.ARG.commit_hash = appSettings.commit_hash;
        this.close_reportform();
        report(JSON.stringify(window.ARG));

        window.setTimeout(
            () => alert("Raportti lähetetty, kiitoksia"),
            100);

    },

    render() {
        return <div>
            <DebugReporterModal showModal={this.state.reporting} close={this.close_reportform} send_report={this.serialize_state} />
            <div id="debughelper">
                <div id="debughelper_container">
                    <Button bsSize="large" onClick={this.show_reportform}>
                        <i className="material-icons">feedback</i>
                    </Button>
                </div>
                <div id="slide">Jos tapahtumien hallinnassa tai syöttölomakkeen toiminnassa on virhe, klikkaa "raportoi virhe"&#x2011;nappia,
                    niin saamme virhetilanteesta tiedon ja voimme tutkia asiaa.</div>
            </div>
        </div>
    }

});

ReactDOM.render(
    <div>
        <DebugHelper />
    </div>,
    document.getElementById('debughelper'));
