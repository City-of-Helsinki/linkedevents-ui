require('!style!css!sass!src/assets/main.scss');

import React from 'react';
import {connect} from 'react-redux';

// Translations
import {IntlProvider} from 'react-intl';
import translations from 'src/i18n';

import Headerbar from 'src/components/Header';

class App extends React.Component {
    
    render() {
        //const locale = this.props.language;
        let locale = 'en';
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
