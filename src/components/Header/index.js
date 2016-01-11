require('!style!css!sass!./index.scss')

import React from 'react'

import {connect} from 'react-redux'
import {pushPath} from 'redux-simple-router'
import {login, logout} from 'src/actions/user.js'

import {FormattedMessage} from 'react-intl'

// Material-ui Components
import { Toolbar, ToolbarGroup, FlatButton, FontIcon } from 'material-ui'

import { IndexLink } from 'react-router'

import cityOfHelsinkiLogo from 'src/assets/images/helsinki-coat-of-arms-white.png'

class HeaderBar extends React.Component {

    render() {
        let buttonStyle = { color: '#ffffff' }

        // NOTE: mockup for login button functionality
        let loginButton = <FlatButton style={buttonStyle} linkButton={true} label={<FormattedMessage id="login"/>} onClick={() => this.props.dispatch(login())} />
        if(this.props.user) {
            loginButton = <FlatButton style={buttonStyle} linkButton={true} label={this.props.user.displayName} onClick={() => this.props.dispatch(logout())} />
        }

        return (
            <Toolbar className="mui-toolbar">
                <ToolbarGroup key={0} float="left">
                    <IndexLink to="/" className="title">
                        <img className="title-image" src={cityOfHelsinkiLogo} alt="City Of Helsinki" />
                        <div className="title-text">Linked Events</div>
                    </IndexLink>
                </ToolbarGroup>
                <ToolbarGroup key={1} float="left">
                    <FlatButton style={buttonStyle} linkButton={true} label={<span><FormattedMessage id="search-events"/><i className="material-icons">&#xE8B6;</i></span>} onClick={() => this.props.dispatch(pushPath('/'))} />
                    <FlatButton style={buttonStyle} linkButton={true} label={<span><FormattedMessage id="create-event"/><i className="material-icons">&#xE145;</i></span>} onClick={() => this.props.dispatch(pushPath('/event/create/new'))} />
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
