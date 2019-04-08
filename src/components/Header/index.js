import './index.scss'

import React from 'react'
import PropTypes from 'prop-types'

import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {login as loginAction, logout as logoutAction} from 'src/actions/user.js'
import {setLocale as setLocaleAction} from 'src/actions/userLocale'

import {FormattedMessage} from 'react-intl'

// Material-ui Components
import {Toolbar, Button, FontIcon, Select, MenuItem, Hidden, Drawer} from 'material-ui'
// Material-ui Icons
import List from 'material-ui-icons/List'
import Search from 'material-ui-icons/Search'
import Add from 'material-ui-icons/Add'
import MenuIcon from 'material-ui-icons/Menu'
import Language from 'material-ui-icons/Language'
import HelpOutline from 'material-ui-icons/HelpOutline'
import Person from 'material-ui-icons/Person'

import {Link} from 'react-router-dom'
import CONSTANTS from '../../constants'

import cityOfHelsinkiLogo from '../../assets/images/helsinki-logo.svg'

class HeaderBar extends React.Component {
    state = {
        navBarOpen: false,
    }

    changeLanguage = (e) => {
        this.props.setLocale(e.target.value)
    }

    toggleNavbar = () => {
        this.setState({navBarOpen: !this.state.navBarOpen});
    }

    getNavigateMobile = (navigate) => () => {
        navigate();
        this.toggleNavbar();
    }

    render() {
        const {user, routerPush, logout, login} = this.props 
        const languages = CONSTANTS.APPLICATION_SUPPORT_TRANSLATION

        const toMainPage = () => routerPush('/');
        const toSearchPage = () => routerPush('/search');
        const toHelpPage = () => routerPush('/help');

        return (
            <div className="main-navbar">
                <Toolbar className="helsinki-bar">
                    <div className="helsinki-bar__logo">
                        <Link to="/">
                            <img src={cityOfHelsinkiLogo} alt="City Of Helsinki" />
                        </Link>
                    </div>
                    <div className="helsinki-bar__login-button">
                        <div className="helsinki-bar__language-button">
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
                        </div>
                        {user ? 
                            <Button onClick={() => logout()}>{user.displayName}</Button> :
                            <Button onClick={() => login()}><Person/><FormattedMessage id="login"/></Button>}
                    </div>
                </Toolbar>
                
                <Toolbar className="linked-events-bar">
                    <div className="linked-events-bar__logo" onClick={() => routerPush('/')}><FormattedMessage id={`linked-${appSettings.ui_mode}`} /></div>
                    <div className="linked-events-bar__links">
                        <Hidden smDown>
                            <div className="linked-events-bar__links__list">
                                <NavLinks toMainPage={toMainPage} toSearchPage={toSearchPage} toHelpPage={toHelpPage} />
                            </div>
                        </Hidden>
                        <div />
                        <div className="linked-events-bar__links__mobile">
                            <Button className="linked-events-bar__links__create-events" onClick={() => routerPush('/event/create/new')}>
                                <Add/>
                                <FormattedMessage id={`create-${appSettings.ui_mode}`}/>
                            </Button>
                            <Hidden mdUp>
                                <MenuIcon className="linked-events-bar__icon" onClick={this.toggleNavbar} />
                                <Drawer anchor='right' open={this.state.navBarOpen} ModalProps={{onBackdropClick: this.toggleNavbar}}>
                                    <div className="menu-drawer-mobile">
                                        <NavLinks
                                            toMainPage={this.getNavigateMobile(toMainPage)}
                                            toSearchPage={this.getNavigateMobile(toSearchPage)}
                                            toHelpPage={this.getNavigateMobile(toHelpPage)}
                                        />
                                    </div> 
                                </Drawer>
                            </Hidden>
                        </div>
                    </div>
                </Toolbar>
            </div>
        )
    }
}

const NavLinks = (props) => {
    const {toMainPage, toSearchPage, toHelpPage} = props;
    return (
        <React.Fragment>
            <Button onClick={toMainPage}><FormattedMessage id={`${appSettings.ui_mode}-management`}/></Button>
            <Button onClick={toSearchPage}><FormattedMessage id={`search-${appSettings.ui_mode}`}/></Button>
            <Button onClick={toHelpPage}> <FormattedMessage id="more-info"/></Button>
        </React.Fragment>
    );
};

NavLinks.propTypes = {
    toMainPage: PropTypes.func,
    toSearchPage: PropTypes.func,
    toHelpPage: PropTypes.func,
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
