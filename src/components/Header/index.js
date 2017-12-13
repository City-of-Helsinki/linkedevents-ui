require('!style-loader!css-loader!sass-loader!./index.scss')

import React from 'react'

import {connect} from 'react-redux'
import {pushPath} from 'redux-simple-router'
import {login, logout} from 'src/actions/user.js'

import {FormattedMessage} from 'react-intl'

// Material-ui Components
import { Toolbar, Button, FontIcon } from 'material-ui'

import { IndexLink } from 'react-router'

import cityOfHelsinkiLogo from 'src/assets/images/helsinki-coat-of-arms-white.png'

class HeaderBar extends React.Component {

    render() {
        let buttonStyle = { color: '#ffffff' }

        // NOTE: mockup for login button functionality
        let loginButton = <Button style={buttonStyle} label={<FormattedMessage id="login"/>} onClick={() => this.props.dispatch(login())} />
        if(this.props.user) {
            loginButton = <Button style={buttonStyle} label={this.props.user.displayName} onClick={() => this.props.dispatch(logout())} />
        }

        return (
            <Toolbar className="mui-toolbar">
                <IndexLink to="/" className="title">
                    <img className="title-image" src={cityOfHelsinkiLogo} alt="City Of Helsinki" />
                    <div className="title-text">Linked Events</div>
                </IndexLink>
                <Button className="mui-flat-button" style={buttonStyle} label={<span><FormattedMessage id="organization-events"/><i className="material-icons">&#xE896;</i></span>} onClick={() => this.props.dispatch(pushPath('/'))} />
                <Button className="mui-flat-button" style={buttonStyle} label={<span><FormattedMessage id="search-events"/><i className="material-icons">&#xE8B6;</i></span>} onClick={() => this.props.dispatch(pushPath('/search'))} />
                <Button className="mui-flat-button" style={buttonStyle} label={<span><FormattedMessage id="create-event"/><i className="material-icons">&#xE145;</i></span>} onClick={() => this.props.dispatch(pushPath('/event/create/new'))} />
                <Button className="mui-flat-button" style={buttonStyle} label={<i className="material-icons info-icon">&#xE8FD;</i>} onClick={() => this.props.dispatch(pushPath('/help'))} />
                {loginButton}
                <div className="clearfix"/>
            </Toolbar>
        )
    }
}

// Adds dispatch to this.props for calling actions, add user from store to props
export default connect((state) => ({
    user: state.user
}))(HeaderBar)
