require('!style!css!sass!src/assets/main.scss');

import React from 'react'
import {connect} from 'react-redux'

import Headerbar from 'src/components/Header'

import {injectIntl} from 'react-intl'

import {retrieveUserFromSession} from 'src/actions/user'

// Material-ui theming
import { HelTheme } from 'src/themes/hel'

class App extends React.Component {

    static propTypes = {
        children: React.PropTypes.node,
    };

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
        intl: React.PropTypes.object,
        dispatch: React.PropTypes.func
        // language: React.PropTypes.object,
        // user: React.PropTypes.object
    };

    getChildContext() {
        return {
            muiTheme: HelTheme,
            //language: this.props.language,
            //user: this.state.user
            dispatch: this.props.dispatch,
            intl: this.props.intl
        }
    }

    componentWillMount() {
        return this.props.dispatch(retrieveUserFromSession())
    }

    render() {
        return (
            <div>
                <Headerbar />
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default connect()(injectIntl(App))
