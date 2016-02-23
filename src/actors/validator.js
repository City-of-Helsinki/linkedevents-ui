// Validator actor which listens to validation changes and sets flash message if validation errors are cleared.
// Subscribes for store changes in src/index.js

import { setFlashMsg } from 'src/actions/app'

let wasErrors = false

export default (store) => {

    const { editor } = store.getState()
    const dispatch = store.dispatch

    let errorCount = _.keys(editor.validationErrors).length;

    if(errorCount > 0 && wasErrors === false) {
        wasErrors = true

        let action = {
            label: 'Siirry virheeseen',
            fn: () => {
                let popovers = document.getElementsByClassName('validation-error-popover')
                if(popovers[0]) { window.scrollTo(0, window.scrollY+popovers[0].getBoundingClientRect().top) }
            }
        }

        dispatch(setFlashMsg('validation-error', 'error', { sticky: true, action: action }))
    }

    if(wasErrors === true) {
        if(errorCount === 0) {
            wasErrors = false
            dispatch(setFlashMsg('no-validation-errors', 'success'))
        }
    }
}
