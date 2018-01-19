import { Provider } from 'react-redux'
import React from 'react'
import { IntlProvider } from 'react-intl'
import translations from '../i18n'

export default (store, component, locale = 'fi') => {
  return (
    <Provider store={store}>
      <IntlProvider locale={locale} messages={translations[locale]}>
        {component}
      </IntlProvider>
    </Provider>
  )
}
