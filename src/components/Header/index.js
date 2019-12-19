import './index.scss'

import React from 'react'
import PropTypes from 'prop-types'

import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {withRouter} from 'react-router'

import {login as loginAction, logout as logoutAction} from 'src/actions/user.js'
import {setLocale as setLocaleAction} from 'src/actions/userLocale'

import {FormattedMessage} from 'react-intl'

// Material-ui Components
import {Toolbar, Select, MenuItem, Hidden, Drawer} from 'material-ui'
import {Button} from '@material-ui/core'
import {Add, Menu, Language, Person} from '@material-ui/icons'

import {Link} from 'react-router-dom'
import constants from '../../constants'

import cityOfHelsinkiLogo from '../../assets/images/helsinki-logo.svg'
import {hasAffiliatedOrganizations} from '../../utils/user'
import {get} from 'lodash'
import {HelTheme} from '../../themes/hel'

const {USER_TYPE, APPLICATION_SUPPORT_TRANSLATION} = constants

class HeaderBar extends React.Component {
    state = {
        navBarOpen: false,
        showModerationLink: false,
    }

    componentDidMount() {
        const {user} = this.props

        if (user) {
            const showModerationLink = get(user, 'userType') === USER_TYPE.ADMIN && hasAffiliatedOrganizations(user)
            this.setState({showModerationLink})
        }
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        const {user} = this.props
        const oldUser = prevProps.user

        if (oldUser !== user) {
            const showModerationLink = get(user, 'userType') === USER_TYPE.ADMIN && hasAffiliatedOrganizations(user)
            this.setState({showModerationLink})
        }
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
        const {user, routerPush, logout, login, location} = this.props 
        const {showModerationLink} = this.state
        const languages = APPLICATION_SUPPORT_TRANSLATION

        const toMainPage = () => routerPush('/');
        const toSearchPage = () => routerPush('/search');
        const toHelpPage = () => routerPush('/help');
        const toModerationPage = () => routerPush('/moderation');

        const isInsideForm = location.pathname.startsWith('/event/create/new');

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
                        {user
                            ? <Button
                                style={{color: HelTheme.palette.primary.contrastText}}
                                onClick={() => logout()}
                            >
                                {user.displayName}
                            </Button>
                            : <Button
                                style={{color: HelTheme.palette.primary.contrastText}}
                                startIcon={<Person/>}
                                onClick={() => login()}
                            >
                                <FormattedMessage id="login"/>
                            </Button>}
                    </div>
                </Toolbar>
                
                <Toolbar className="linked-events-bar">
                    <div className="linked-events-bar__logo" onClick={() => routerPush('/')}><FormattedMessage id={`linked-${appSettings.ui_mode}`} /></div>
                    <div className="linked-events-bar__links">
                        <Hidden smDown>
                            <div className="linked-events-bar__links__list">
                                <NavLinks
                                    showModerationLink={showModerationLink}
                                    toMainPage={toMainPage}
                                    toSearchPage={toSearchPage}
                                    toHelpPage={toHelpPage}
                                    toModerationPage={toModerationPage}
                                />
                            </div>
                        </Hidden>
                        <div />
                        <div className="linked-events-bar__links__mobile">
                            {!isInsideForm && (
                                <Button
                                    variant="outlined"
                                    className="linked-events-bar__links__create-events"
                                    onClick={() => routerPush('/event/create/new')}
                                    startIcon={<Add/>}
                                >
                                    <FormattedMessage id={`create-${appSettings.ui_mode}`}/>
                                </Button>
                            )}
                            <Hidden mdUp>
                                <Menu className="linked-events-bar__icon" onClick={this.toggleNavbar} />
                                <Drawer anchor='right' open={this.state.navBarOpen} ModalProps={{onBackdropClick: this.toggleNavbar}}>
                                    <div className="menu-drawer-mobile">
                                        <NavLinks
                                            showModerationLink={showModerationLink}
                                            toMainPage={this.getNavigateMobile(toMainPage)}
                                            toSearchPage={this.getNavigateMobile(toSearchPage)}
                                            toHelpPage={this.getNavigateMobile(toHelpPage)}
                                            toModerationPage={this.getNavigateMobile(toModerationPage)}
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
    const {showModerationLink, toMainPage, toSearchPage, toHelpPage, toModerationPage} = props;
    return (
        <React.Fragment>
            <Button onClick={toMainPage}><FormattedMessage id={`${appSettings.ui_mode}-management`}/></Button>
            <Button onClick={toSearchPage}><FormattedMessage id={`search-${appSettings.ui_mode}`}/></Button>
            <Button onClick={toHelpPage}> <FormattedMessage id="more-info"/></Button>
            {showModerationLink &&
                <Button onClick={toModerationPage}> <FormattedMessage id="moderation-page"/></Button>
            }
        </React.Fragment>
    );
};

NavLinks.propTypes = {
    showModerationLink: PropTypes.bool,
    toMainPage: PropTypes.func,
    toSearchPage: PropTypes.func,
    toHelpPage: PropTypes.func,
    toModerationPage: PropTypes.func,
}

// Adds dispatch to this.props for calling actions, add user from store to props
HeaderBar.propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    routerPush: PropTypes.func,
    userLocale: PropTypes.object,
    setLocale: PropTypes.func,
    location: PropTypes.object,
    navBarOpen: PropTypes.bool,
    showModerationLink: PropTypes.bool,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderBar))
