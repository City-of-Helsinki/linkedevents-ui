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

import { IndexLink } from 'react-router'

import cityOfHelsinkiLogo from 'src/assets/images/helsinki-coat-of-arms-white.png'

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
                    <IndexLink to="/" className="title">
                        <img className="title-image" src={cityOfHelsinkiLogo} alt="City Of Helsinki" />
                        <div className="title-text">Linked Events</div>
                    </IndexLink>
                </ToolbarGroup>
                <ToolbarGroup key={1} float="left">
                    <div className="toolbar-actions">
                        <FlatButton linkButton={true} label={<span><FormattedMessage id="search-events"/><i className="material-icons">&#xE8B6;</i></span>} onClick={() => this.props.dispatch(pushPath('/'))} />
                        <FlatButton linkButton={true} label={<span><FormattedMessage id="create-event"/><i className="material-icons">&#xE145;</i></span>} onClick={() => this.props.dispatch(pushPath('/event/create/new'))} />
                    </div>
                </ToolbarGroup>
                <ToolbarGroup key={2} float="right">
                    {loginButton}
                </ToolbarGroup>
            </Toolbar>
        )
    }
}

// Adds dispatch to this.props for calling actions, add user from store to props
export default connect((state) => ({
    user: state.user
}))(HeaderBar)
