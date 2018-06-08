import CONSTANTS from '../constants'

const {LOCALE, LOCALE_ACTIONS} = CONSTANTS

export function setLocale(locale) {
    return {
        type: LOCALE_ACTIONS.LOCALE_SET,
        locale: locale,
    }
}

export function getLocale() {
    return {
        type: LOCALE_ACTIONS.LOCALE_GET,
    }
}
