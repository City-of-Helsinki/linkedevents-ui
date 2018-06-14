import CONSTANTS from '../constants'

const {LOCALE_ACTIONS, DEFAULT_LOCALE} = CONSTANTS

const initialState = {
    locale: DEFAULT_LOCALE,
}

const userLocale = (state = initialState, action) => {
    switch(action.type) {
        case LOCALE_ACTIONS.LOCALE_SET: 
            return Object.assign({}, state, {
                locale: action.locale,
            })
        case LOCALE_ACTIONS.LOCALE_RESET:
            return Object.assign({}, state, {
                locale: initialState.locale,
            })
        default:
            return state
    }
}

export default userLocale
