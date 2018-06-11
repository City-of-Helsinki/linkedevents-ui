require('!style-loader!css-loader!sass-loader!./index.scss')

import React from 'react'
import PropTypes from 'prop-types'

import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {login as loginAction, logout as logoutAction} from 'src/actions/user.js'

import {FormattedMessage} from 'react-intl'

// Material-ui Components
import {Toolbar, Button, FontIcon} from 'material-ui'
// Material-ui Icons
import List from 'material-ui-icons/List'
import Search from 'material-ui-icons/Search'
import Add from 'material-ui-icons/Add'
import HelpOutline from 'material-ui-icons/HelpOutline'
import Person from 'material-ui-icons/Person'

import {Link} from 'react-router-dom'

import cityOfHelsinkiLogo from 'src/assets/images/helsinki-logo.svg'

class HeaderBar extends React.Component {

    render() {
        const {user, routerPush, logout, login} = this.props 

        return (
            <div className="main-navbar">
                <Toolbar className="helsinki-bar">
                    <div className="helsinki-bar__logo">
                        <Link to="/">
                            <img src={cityOfHelsinkiLogo} alt="City Of Helsinki" />
                        </Link>
                    </div>
                    <div className="helsinki-bar__login-button">
                        {user ? 
                            <Button onClick={() => logout()}>{user.displayName}</Button> :
                            <Button onClick={() => login()}><Person/><FormattedMessage id="login"/></Button>}
                    </div>
                </Toolbar>
                
                <Toolbar className="linked-courses-bar">
                    <div className="linked-courses-bar__logo" onClick={() => routerPush('/')}><FormattedMessage id="link-courses" /></div>
                    <div className="linked-courses-bar__links">
                        <div>
                            <Button onClick={() => routerPush('/')}><FormattedMessage id="organization-course"/></Button>
                            <Button onClick={() => routerPush('/search')}><FormattedMessage id="search-course"/></Button>
                            <Button onClick={() => routerPush('/help')}> <FormattedMessage id="more-info-course"/></Button>
                        </div>
                        <Button className="linked-courses-bar__links__create-courses" onClick={() => routerPush('/event/create/new')}>
                            <Add/>
                            <FormattedMessage id="create-course"/>
                        </Button>
                    </div>
                </Toolbar>
            </div>
        )
    }
}

// Adds dispatch to this.props for calling actions, add user from store to props
HeaderBar.propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    routerPush: PropTypes.func,
}

const mapStateToProps = (state) => ({
    user: state.user,
})
const mapDispatchToProps = (dispatch) => ({
    login: () => dispatch(loginAction()),
    logout: () => dispatch(logoutAction()),
    routerPush: (url) => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar)
