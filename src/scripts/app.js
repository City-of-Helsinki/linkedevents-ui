require('bootstrap/dist/css/bootstrap.css');
require('!style!css!sass!../assets/main.scss');

import React from 'react';

// Material-ui components
import Headerbar from './components/header';

// Material-ui theming
import { HelTheme } from '../themes/hel';

class App extends React.Component {

    static propTypes = {
        children: React.PropTypes.node,
        muiTheme: React.PropTypes.object
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object
    }

    getChildContext() {
        return {
            muiTheme: HelTheme
        }
    }

    render() {
        return (
            <div>
                <Headerbar />
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default App;
