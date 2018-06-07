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
        // NOTE: mockup for login button functionality
        let loginButton = <Button onClick={() => this.props.login()}><Person/><FormattedMessage id="login"/></Button>
        if(this.props.user) {
            loginButton = <Button onClick={() => this.props.logout()}>{this.props.user.displayName}</Button>
        }
        return (
            <div>
                <Toolbar className="mui-toolbar">
                    <div>
                        <Link to="/" className="title">
                            <img className="title-image" src={cityOfHelsinkiLogo} alt="City Of Helsinki" />
                        </Link>
                    </div>
                    <div>
                        {loginButton}
                    </div>
                </Toolbar>
                <div className="navlinksHolder" >
                    <div className="title-text" onClick={() => this.props.routerPush('/')}>Linked Courses</div>
                    <div className="navbar-links">
                        <Button className="mui-flat-button" onClick={() => this.props.routerPush('/')}><FormattedMessage id="organization-course"/></Button>
                        <Button className="mui-flat-button" onClick={() => this.props.routerPush('/search')}><FormattedMessage id="search-course"/></Button>
                        <Button className="mui-flat-button" onClick={() => this.props.routerPush('/help')}> <FormattedMessage id="more-info-course"/></Button>
                    </div>
                    <div className="navbar-links-two">
                        <Button className="mui-flat-add-button" onClick={() => this.props.routerPush('/event/create/new')}><Add/><FormattedMessage id="create-course"/></Button>
                    </div>
                </div>
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
