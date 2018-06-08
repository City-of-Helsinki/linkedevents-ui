import React, {Component} from 'react';
import moment from 'moment'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import {IntlProvider, addLocaleData} from 'react-intl';

import fiLocaleData from 'react-intl/locale-data/fi';
import enLocaleData from 'react-intl/locale-data/en';
import svLocaleData from 'react-intl/locale-data/sv';

import translations from 'src/i18n';

import CONSTANTS from '../../constants'
import {fetchLanguages as fetchLanguagesAction} from '../../actions/editor'
import {retrieveUserFromSession as retrieveUserFromSessionAction} from '../../actions/user'
import {setLocale as setLocaleAction} from '../../actions/userLocale'

import Intl from 'intl'


if(window && !window.Intl) {
    window.Intl = Intl
}

addLocaleData([...fiLocaleData, ...enLocaleData, ...svLocaleData])

class IntlProviderWrapper extends Component {
    UNSAFE_componentWillMount() {
        // fetch Hel.fi languages
        this.props.fetchLanguages()

        // Fetch userdata
        this.props.retrieveUserFromSession()
    }

    UNSAFE_componentWillReceiveProps(nextProps){ 
        // this part is placeholder in case user have specific language selection with them in data
        if(nextProps.user.hasOwnProperty('locale') && this.props.user.hasOwnProperty('locale')) {
            if(nextProps.user.locale !== this.props.user.locale) {
                this.props.setLocale(nextProps.user.locale)
            }
        }
    }

    componentDidMount() {
        const userLocale = this.getSupportUserLocale()
        moment.locale(userLocale)
    }

    getSupportUserLocale() {
        const {languages, userLocale: {locale}} = this.props

        const isLocaleSupported = languages.find(lang => lang.id === locale)
        // check if current user locale is part of supporting languages

        return isLocaleSupported ? locale : CONSTANTS.DEFAULT_LOCALE
    }

    render() {
        const {user} = this.props
        const userLocale = this.getSupportUserLocale()
        
        const mergedMessages = Object.assign({}, translations[CONSTANTS.DEFAULT_LOCALE], translations[userLocale])

        return (
            <div>
                <IntlProvider locale={userLocale} messages={mergedMessages}>
                    {this.props.children}
                </IntlProvider>
            </div>
        );
    }
}

IntlProviderWrapper.propTypes = {
    children: PropTypes.element,
    messages: PropTypes.object,
    fetchLanguages: PropTypes.func,
    retrieveUserFromSession: PropTypes.func,
    user: PropTypes.object,
    languages: PropTypes.array,
    setLocale: PropTypes.func,
    userLocale: PropTypes.object,
}

IntlProviderWrapper.defautlProps = {
    user: {},
}

const mapDispatchToProps = (dispatch) => ({
    fetchLanguages:() => dispatch(fetchLanguagesAction()),
    retrieveUserFromSession: () => dispatch(retrieveUserFromSessionAction()),
    setLocale: (locale) => dispatch(setLocaleAction(locale)),
})

const mapStateToProps = ({user, userLocale, editor}) => {
    const supportedLanguages = editor && editor.languages ? 
        editor.languages.filter(lang => lang.translation_available) : [CONSTANTS.DEFAULT_LOCALE]

    return {
        languages: supportedLanguages,
        user,
        userLocale,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IntlProviderWrapper)
