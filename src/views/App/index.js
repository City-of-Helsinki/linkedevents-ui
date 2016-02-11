require('!style!css!sass!src/assets/main.scss');

import React from 'react'
import {connect} from 'react-redux'

import Headerbar from 'src/components/Header'
import Snackbar from 'material-ui/lib/snackbar';
import Modal from 'react-bootstrap/lib/Modal';


import {injectIntl} from 'react-intl'

import {retrieveUserFromSession} from 'src/actions/user'
import {clearFlashMsg} from 'src/actions/app.js'
import {FormattedMessage} from 'react-intl'

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
        let flashMsg = (<span/>)
        if(this.props.app.flashMsg && this.props.app.flashMsg.msg && this.props.app.flashMsg.msg.length) {
            flashMsg = (<FormattedMessage id={this.props.app.flashMsg.msg} />)
        }

        return (
            <div>
                <Headerbar />
                <div className="content">
                    {this.props.children}
                </div>
                <Snackbar
                  open={(!!this.props.app.flashMsg)}
                  message={flashMsg}
                  bodyStyle={{'backgroundColor': 'rgb(0,108,188)'}}
                  autoHideDuration={6000}
                  onRequestClose={(e) => this.props.dispatch(clearFlashMsg())}
                />
            </div>
        )
    }
}

export default connect((state) => ({
    editor: state.editor,
    user: state.user,
    app: state.app
}))(injectIntl(App))
