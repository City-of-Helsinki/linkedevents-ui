require('!style!css!sass!src/assets/main.scss');

import React from 'react';
import {connect} from 'react-redux';

// Translations
import {IntlProvider} from 'react-intl';
import translations from 'src/i18n';

import Headerbar from 'src/components/Header';

// Material-ui theming
import { HelTheme } from 'src/themes/hel';

class App extends React.Component {

    static propTypes = {
        children: React.PropTypes.node,
        muiTheme: React.PropTypes.object
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object
        // language: React.PropTypes.object,
        // user: React.PropTypes.object
    }

    getChildContext() {
        return {
            muiTheme: HelTheme
            // language: this.props.language,
            // user: this.props.user
        }
    }

    render() {
        //const locale = this.props.language;
        let locale = 'fi';
        return (
            <IntlProvider locale={locale} messages={translations[locale] || {}}>
                <div>
                    <Headerbar />
                    <div className="content">
                        {this.props.children}
                    </div>
                </div>
            </IntlProvider>
        )
    }
}

export default connect()(App)
