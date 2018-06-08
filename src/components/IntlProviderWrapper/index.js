import React, {Component} from 'react';
import moment from 'moment'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import {IntlProvider, addLocaleData} from 'react-intl';

import fiLocaleData from 'react-intl/locale-data/fi';
// import enLocaleData from 'react-intl/locale-data/en';
// import svLocaleData from 'react-intl/locale-data/sv';
// TODO: enable this when translation sheet for en and sv is finished

import translations from 'src/i18n';

import CONSTANTS from '../../constants'
import {setLocale as setLocaleAction, resetLocale as resetLocaleAction} from '../../actions/userLocale'

import Intl from 'intl'


if(window && !window.Intl) {
    window.Intl = Intl
}

addLocaleData([...fiLocaleData])

class IntlProviderWrapper extends Component {
    componentDidMount() {
        const {userLocale: {locale}} = this.props
        
        moment.locale(locale)
    }

    render() {
        const {user, userLocale: {locale}} = this.props
        
        const mergedMessages = Object.assign({}, translations[CONSTANTS.DEFAULT_LOCALE], translations[locale])

        return (
            <div>
                <IntlProvider locale={locale} messages={mergedMessages}>
                    {this.props.children}
                </IntlProvider>
            </div>
        );
    }
}

IntlProviderWrapper.propTypes = {
    children: PropTypes.element,
    messages: PropTypes.object,
    user: PropTypes.object,
    userLocale: PropTypes.object,
}

const mapStateToProps = ({userLocale}) => {
    return {
        userLocale,
    }
}

export default connect(mapStateToProps)(IntlProviderWrapper)
