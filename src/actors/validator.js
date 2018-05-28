// Validator actor which listens to validation changes and sets flash message if validation errors are cleared.
// Subscribes for store changes in src/index.js

import {setFlashMsg, clearFlashMsg} from 'src/actions/app'
import constants from 'src/constants'

let wasErrors = false

export default (store) => {

    const {editor, router} = store.getState()
    const dispatch = store.dispatch

    let errorCount = _.keys(editor.validationErrors).length;

    if(errorCount > 0 && wasErrors === false) {
        wasErrors = true

        let action = {
            label: 'Siirry virheeseen',
            fn: () => {
                let top = (window.scrollY || window.pageYOffset)
                let popovers = document.getElementsByClassName('validation-error-popover')
                if(popovers[0]) { window.scrollTo(0, top + popovers[0].getBoundingClientRect().top - 16) }
            },
        }

        dispatch(setFlashMsg('validation-error', 'error', {sticky: true, action: action}))
    }

    if(wasErrors === true) {
        if(errorCount === 0) {
            wasErrors = false
            if((router.location.pathname.indexOf('/event/create/') > -1 || router.location.pathname.indexOf('/event/update/') > -1)
                && editor.validationStatus === constants.VALIDATION_STATUS.RESOLVE) {
                dispatch(setFlashMsg('no-validation-errors', 'success'))
            } else {
                dispatch(clearFlashMsg())
            }
        }
    }
}
