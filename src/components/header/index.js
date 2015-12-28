import React from 'react';

import {connect} from 'react-redux';
import {pushPath} from 'redux-simple-router';

import {FormattedMessage} from 'react-intl';

// Material-ui components
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import FlatButton from 'material-ui/lib/flat-button';
import FontIcon from 'material-ui/lib/font-icon';
import Link from 'react-router';

import { HeaderTheme } from 'src/themes/hel'

class HeaderBar extends React.Component {

    static contextTypes = {
        muiTheme: React.PropTypes.object
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object
    }

    getChildContext () {
        return {
            muiTheme: HeaderTheme
        }
    }

    render() {
        return (
            <Toolbar>
                <ToolbarGroup key={0} float="left">
                    <ToolbarTitle text="Linked Events" />
                </ToolbarGroup>
                <ToolbarGroup key={1} float="left">
                    <FlatButton linkButton={true} label={<FormattedMessage id="search-events"/>} onClick={() => this.props.dispatch(pushPath('/'))} style={{ fontWeight: 300 }} />
                </ToolbarGroup>
                <ToolbarGroup key={2} float="right">
                    <FlatButton linkButton={true} label={<FormattedMessage id="login"/>} onClick={() => this.props.dispatch(pushPath('/signin'))} style={{ fontWeight: 300, minWidth: '30px' }} />
                    <FlatButton linkButton={true} label={<FormattedMessage id="create-event"/>} onClick={() => this.props.dispatch(pushPath('/event/create/new'))} style={{ fontWeight: 300, minWidth: '30px' }}>
                        <FontIcon className="material-icons">add</FontIcon>
                    </FlatButton>
                </ToolbarGroup>
            </Toolbar>
        )
    }
}

// Adds dispatch to this.props to call actions
export default connect()(HeaderBar);
