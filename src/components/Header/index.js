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

import cityOfHelsinkiLogo from 'src/assets/images/helsinki-logo.1.svg'

class HeaderBar extends React.Component {

    render() {
        let buttonStyle = {color: '#ffffff'}
        let buttonStyle2 = {color: '#000000'}
        let navstyle = {
            width: '100%',
            display: 'grid',
            'grid-template-columns': '20% 60% 20%',
        }
        let verticalAlignMiddle = {verticalAlign: 'middle'}

        // NOTE: mockup for login button functionality
        let loginButton = <Button style={buttonStyle} onClick={() => this.props.login()}><Person/><FormattedMessage id="login"/></Button>
        if(this.props.user) {
            loginButton = <Button style={buttonStyle} onClick={() => this.props.logout()}>{this.props.user.displayName}</Button>
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
                <div className="navlinksHolder" style={navstyle}>
                    <div className="title-text" style={{'justify-self': 'center', color:'#1B914A', fontWeight:700, alignSelf:'center'}}>Linked Courses</div>
                    <div className="navbar-links">
                        <Button className="mui-flat-button" style={buttonStyle2} onClick={() => this.props.routerPush('/')}><FormattedMessage id="organization-events"/><List/></Button>
                        <Button className="mui-flat-button" style={buttonStyle2} onClick={() => this.props.routerPush('/search')}><FormattedMessage id="search-events"/><Search/></Button>
                        <Button className="mui-flat-button" style={{...buttonStyle2,...verticalAlignMiddle}} onClick={() => this.props.routerPush('/help')}><HelpOutline/> HelpOutline</Button>
                    </div>
                    <Button className="mui-flat-button" style={buttonStyle2} onClick={() => this.props.routerPush('/event/create/new')}><FormattedMessage id="create-event"/><Add/></Button>
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
