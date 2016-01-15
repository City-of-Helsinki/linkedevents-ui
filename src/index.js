import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import { createHashHistory } from 'history'
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router'

import thunk from 'redux-thunk'

import reducers from './reducers'

// Views
import App from './views/App'
import Editor from './views/Editor'
import Search from './views/Search'
import Event from './views/Event'

// Initialize tap event plugin (used by material-ui components)
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin()

const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routeReducer
}))

const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore)

const store = createStoreWithMiddleware(reducer)
const history = createHashHistory()

syncReduxAndRouter(history, store)

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={Search}/>
                <Route path="/:eventId" component={Event}/>
                <Route path="/event/:action/:eventId" component={Editor}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('content')
)
