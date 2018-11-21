require('!style-loader!css-loader!sass-loader!./index.scss')

import React from 'react'
import PropTypes from 'prop-types'

import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {login as loginAction, logout as logoutAction} from 'src/actions/user.js'
import {setLocale as setLocaleAction} from 'src/actions/userLocale'

import {FormattedMessage} from 'react-intl'

// Material-ui Components
import {Toolbar, Button, FontIcon, Select, MenuItem} from 'material-ui'
// Material-ui Icons
import List from 'material-ui-icons/List'
import Search from 'material-ui-icons/Search'
import Add from 'material-ui-icons/Add'
import Language from 'material-ui-icons/Language'
import HelpOutline from 'material-ui-icons/HelpOutline'

import {Link} from 'react-router-dom'
import CONSTANTS from '../../constants'

import cityOfHelsinkiLogo from '../../assets/images/helsinki-coat-of-arms-white.png'

class HeaderBar extends React.Component {

    changeLanguage = (e) => {
        this.props.setLocale(e.target.value)
    }

    render() {
        let buttonStyle = {color: '#ffffff'}
        let verticalAlignMiddle = {verticalAlign: 'middle'}

        // NOTE: mockup for login button functionality
        let loginButton = <Button style={buttonStyle} onClick={() => this.props.login()}><FormattedMessage id="login"/></Button>
        if(this.props.user) {
            loginButton = <Button style={buttonStyle} onClick={() => this.props.logout()}>{this.props.user.displayName}</Button>
        }
        const languages = CONSTANTS.APPLICATION_SUPPORT_TRANSLATION
        return (
            <Toolbar className="mui-toolbar">
                <div>
                    <Link to="/" className="title">
                        <img className="title-image" src={cityOfHelsinkiLogo} alt="City Of Helsinki" />
                        <div className="title-text">Linked Events</div>
                    </Link>
                </div>
                <div className="navbar-links">
                    <Button className="mui-flat-button" style={buttonStyle} onClick={() => this.props.routerPush('/')}><FormattedMessage id="organization-events"/><List/></Button>
                    <Button className="mui-flat-button" style={buttonStyle} onClick={() => this.props.routerPush('/search')}><FormattedMessage id="search-events"/><Search/></Button>
                    <Button className="mui-flat-button" style={buttonStyle} onClick={() => this.props.routerPush('/event/create/new')}><FormattedMessage id="create-event"/><Add/></Button>
                </div>
                <div className="navbar-right">
                    <div className="language-selector">
                        <Language className="language-icon"/>
                        <Select
                            className="language-select-box"
                            value={this.props.userLocale.locale}
                            onChange={this.changeLanguage}
                        >
                            {languages.map((lang, index) => (
                                <MenuItem 
                                    value={lang} 
                                    key={index}>
                                    {lang}
                                </MenuItem>
                            ))}
                        </Select> 
                    </div>                 
                    <Button className="mui-flat-button" style={{...buttonStyle,...verticalAlignMiddle}} onClick={() => this.props.routerPush('/help')}><HelpOutline/></Button>
                    {loginButton}
                </div>
            </Toolbar>
        )
    }
}

// Adds dispatch to this.props for calling actions, add user from store to props
HeaderBar.propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    routerPush: PropTypes.func,
    userLocale: PropTypes.object,
    setLocale: PropTypes.func,
}

const mapStateToProps = (state) => ({
    user: state.user,
    userLocale: state.userLocale,
})

const mapDispatchToProps = (dispatch) => ({
    login: () => dispatch(loginAction()),
    logout: () => dispatch(logoutAction()),
    routerPush: (url) => dispatch(push(url)),
    setLocale: (locale) => dispatch(setLocaleAction(locale)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar)
