import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';

// Views
import App from './views/app';
import Editor from './views/editor';
import Search from './views/search';

// Initialize tap event plugin (used by material-ui components)
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

ReactDOM.render(
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={Search}/>
            <Route path="event/:action/:eventId" component={Editor}/>
        </Route>
    </Router>,
    document.getElementById('content')
)
