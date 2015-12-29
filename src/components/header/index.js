require('!style!css!sass!./index.scss')

import React from 'react'

import {connect} from 'react-redux'
import {pushPath} from 'redux-simple-router'
import {login, logout} from 'src/actions/user.js'

import {FormattedMessage} from 'react-intl'

// Material-ui-with-sass components
import Toolbar from 'node_modules/material-ui-with-sass/src/js/toolbar.jsx'
import ToolbarGroup from 'node_modules/material-ui-with-sass/src/js/toolbar-group.jsx'
import FlatButton from 'node_modules/material-ui-with-sass/src/js/flat-button.jsx'
import FontIcon from 'node_modules/material-ui-with-sass/src/js/font-icon.jsx'

import Link from 'react-router'

class HeaderBar extends React.Component {

    render() {
        // NOTE: mockup for login button functionality
        let loginButton = <FlatButton linkButton={true} label={<FormattedMessage id="login"/>} onClick={() => this.props.dispatch(login())} style={{ fontWeight: 300, minWidth: '30px' }} />
        if(this.props.user) {
            loginButton = <FlatButton linkButton={true} label={this.props.user.displayName} onClick={() => this.props.dispatch(logout())} style={{ fontWeight: 300, minWidth: '30px' }} />
        }

        return (
            <Toolbar>
                <ToolbarGroup key={0} float="left">
                    <div className="title-text">Linked Events</div>
                </ToolbarGroup>
                <ToolbarGroup key={1} float="left">
                    <FlatButton linkButton={true} label={<FormattedMessage id="search-events"/>} onClick={() => this.props.dispatch(pushPath('/'))} style={{ fontWeight: 300 }} />
                </ToolbarGroup>
                <ToolbarGroup key={2} float="right">
                    {loginButton}
                    <FlatButton linkButton={true} label={<FormattedMessage id="create-event"/>} onClick={() => this.props.dispatch(pushPath('/event/create/new'))} style={{ fontWeight: 300, minWidth: '30px' }}>
                        <FontIcon className="material-icons">add</FontIcon>
                    </FlatButton>
                </ToolbarGroup>
            </Toolbar>
        )
    }
}

// Adds dispatch to this.props for calling actions, add user from store to props
export default connect((state) => ({
    user: state.user
}))(HeaderBar)
