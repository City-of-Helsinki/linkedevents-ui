require('bootstrap/dist/css/bootstrap.css');
require('!style!css!sass!../assets/main.scss');

import React from 'react';

// Material-ui components
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import FlatButton from 'material-ui/lib/flat-button';
import FontIcon from 'material-ui/lib/font-icon';

// Material-ui theming
import HelTheme from '../themes/hel.js';

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
                <Toolbar>
                    <div className="container">
                        <ToolbarGroup key={0} float="left">
                            <ToolbarTitle text="Linked Events" />
                        </ToolbarGroup>
                        <ToolbarGroup key={1} float="left">
                            <FlatButton linkButton={true} label="Hae tapahtumia" primary={true} href="/#/" />
                        </ToolbarGroup>
                        <ToolbarGroup key={2} float="right">
                            <FlatButton linkButton={true} label="Lisää uusi tapahtuma" href="/#/event/create/new">
                                <FontIcon className="material-icons">add</FontIcon>
                            </FlatButton>
                        </ToolbarGroup>
                    </div>
                </Toolbar>
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default App;
