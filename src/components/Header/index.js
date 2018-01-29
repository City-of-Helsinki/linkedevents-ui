require('!style-loader!css-loader!sass-loader!./index.scss')

import React from 'react'

import {connect} from 'react-redux'
import { push } from 'react-router-redux'
import {login, logout} from 'src/actions/user.js'

import {FormattedMessage} from 'react-intl'

// Material-ui Components
import { Toolbar, Button, FontIcon } from 'material-ui'
// Material-ui Icons
import List from 'material-ui-icons/List'
import Search from 'material-ui-icons/Search'
import Add from 'material-ui-icons/Add'
import HelpOutline from 'material-ui-icons/HelpOutline'

import { Link } from 'react-router-dom'

import cityOfHelsinkiLogo from 'src/assets/images/helsinki-coat-of-arms-white.png'

class HeaderBar extends React.Component {

    render() {
        let buttonStyle = { color: '#ffffff' }
        let verticalAlignMiddle = { verticalAlign: 'middle' }

        // NOTE: mockup for login button functionality
        let loginButton = <Button style={buttonStyle} onClick={() => this.props.dispatch(login())}><FormattedMessage id="login"/></Button>
        if(this.props.user) {
            loginButton = <Button style={buttonStyle} onClick={() => this.props.dispatch(logout())}>{this.props.user.displayName}</Button>
        }

        return (
            <Toolbar className="mui-toolbar">
                <div style={{float: 'left'}}>
                    <Link to="/" className="title">
                        <img className="title-image" src={cityOfHelsinkiLogo} alt="City Of Helsinki" />
                        <div className="title-text">Linked Events</div>
                    </Link>
                </div>
                <div style={{float: 'left'}}>
                    <Button className="mui-flat-button" style={buttonStyle} onClick={() => this.props.dispatch(push('/'))}><FormattedMessage id="organization-events"/><List/></Button>
                    <Button className="mui-flat-button" style={buttonStyle} onClick={() => this.props.dispatch(push('/search'))}><FormattedMessage id="search-events"/><Search/></Button>
                    <Button className="mui-flat-button" style={buttonStyle} onClick={() => this.props.dispatch(push('/event/create/new'))}><FormattedMessage id="create-event"/><Add/></Button>
                </div>
                <div style={{float: 'right'}}>
                    <Button className="mui-flat-button" style={{...buttonStyle,...verticalAlignMiddle}} onClick={() => this.props.dispatch(push('/help'))}><HelpOutline/></Button>
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
