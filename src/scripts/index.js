import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';

// Pages
import App from './app.js';
import EditorPage from './components/editorpage/editorpage.js';
import SearchPage from './components/searchpage/searchpage.js';

// Initialize tap event plugin (used by material-ui components)
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

ReactDOM.render(
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={SearchPage}/>
            <Route path="event/:action/:eventId" component={EditorPage}/>
        </Route>
    </Router>,
    document.getElementById('content')
)
//
