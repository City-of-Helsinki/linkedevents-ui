import {IntlProvider, addLocaleData} from 'react-intl'
import {MemoryRouter as Router} from 'react-router'
import {Provider} from 'react-redux'
import React from 'react'

import translations from '../src/i18n'

const ReduxIntWrappeComponent = (store, component, locale = 'fi') => {
    const lang = require('react-intl/locale-data/' + locale)
    addLocaleData(lang)

    return (
        <Provider store={store}>
            <IntlProvider locale={locale} messages={translations[locale]}>
                <Router>
                    {component}
                </Router>
            </IntlProvider>
        </Provider>
    )
}

export default ReduxIntWrappeComponent;
