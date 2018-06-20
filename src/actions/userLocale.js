import CONSTANTS from '../constants'

const {LOCALE_ACTIONS} = CONSTANTS

export function setLocale(locale) {
    return {
        type: LOCALE_ACTIONS.LOCALE_SET,
        locale: locale,
    }
}

export function resetLocale() {
    return {
        type: LOCALE_ACTIONS.LOCALE_RESET,
    }
}
