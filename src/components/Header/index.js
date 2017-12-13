require('!style-loader!css-loader!sass-loader!./index.scss')

import React from 'react'

import {connect} from 'react-redux'
import {pushPath} from 'redux-simple-router'
import {login, logout} from 'src/actions/user.js'

import {FormattedMessage} from 'react-intl'

// Material-ui Components
import { Toolbar, Button, FontIcon } from 'material-ui'
// Material-ui Icons
import List from 'material-ui-icons/List'
import Search from 'material-ui-icons/Search'
import Add from 'material-ui-icons/Add'
import HelpOutline from 'material-ui-icons/HelpOutline'

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
                <div float="left">
                    <IndexLink to="/" className="title">
                        <img className="title-image" src={cityOfHelsinkiLogo} alt="City Of Helsinki" />
                        <div className="title-text">Linked Events</div>
                    </IndexLink>
                </div>
                <div float="left">
                    <Button className="mui-flat-button" style={buttonStyle} onClick={() => this.props.dispatch(pushPath('/'))}><FormattedMessage id="organization-events"/><List/></Button>
                    <Button className="mui-flat-button" style={buttonStyle} onClick={() => this.props.dispatch(pushPath('/search'))}><FormattedMessage id="search-events"/><Search/></Button>
                    <Button className="mui-flat-button" style={buttonStyle} onClick={() => this.props.dispatch(pushPath('/event/create/new'))}><FormattedMessage id="create-event"/><Add/></Button>
                </div>
                <div float="right">
                    <Button className="mui-flat-button" style={buttonStyle} onClick={() => this.props.dispatch(pushPath('/help'))}><HelpOutline/></Button>
                    {loginButton}
                </div>
                <div className="clearfix"/>
            </Toolbar>
        )
    }
}

// Adds dispatch to this.props for calling actions, add user from store to props
export default connect((state) => ({
    user: state.user
}))(HeaderBar)
