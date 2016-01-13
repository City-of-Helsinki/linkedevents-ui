import constants from '../constants'

import {mapUIDataToAPIFormat} from 'src/utils/formDataMapping.js'

// Clear editor data. Called explicitly by the user or
export function clearFlashMsg() {
    return {
        type: constants.EDITOR_CLEAR_FLASHMSG
    }
}

// Set data and save it to localStorage
export function setData(formValues) {
    return {
        type: constants.EDITOR_SETDATA,
        values: formValues
    }
}

// Clear editor data. Called explicitly by the user or
export function clearData() {
    return {
        type: constants.EDITOR_CLEARDATA
    }
}

// Send data and create sendDataComplete event afterwards
// NOTE: values are passed from the editor view. There's no apparent way to access state from here
export function sendData(formValues, user) {
    return (dispatch) => {
        console.log('Sending: ', mapUIDataToAPIFormat(formValues))

        let url = `${appSettings.api_base}/event/`

        let token = ''
        if(user) {
             token = user.token
        }

        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token,
            },
            body: JSON.stringify(mapUIDataToAPIFormat(formValues))
        }).then(response => {
            console.log('Received', response)

            let json = response.json()
            if(response.status === 200 || response.status === 201) {
                dispatch(sendDataComplete(json))
            }
            // Validation errors
            else if(response.status === 400) {
                json.apiErrorMsg = 'validation-error'
                dispatch(sendDataComplete(json))
            }

            // Auth errors
            else if(response.status === 401 || response.status === 403) {
                json.apiErrorMsg = 'authorization-required'
                dispatch(sendDataComplete(json))
            }

            else {
                json.apiErrorMsg = 'server-error'
                dispatch(sendDataComplete(json))
            }
        })
    }
}

export function sendDataComplete(json) {
    if(json.apiErrorMsg) {
        return {
            type: constants.EDITOR_SENDDATA_ERROR,
            apiErrorMsg: json.apiErrorMsg,
            data: json
        }
    }
    else {
        return {
            type: constants.EDITOR_SENDDATA_SUCCESS,
            createdAt: Date.now(),
            data: json
        }
    }
}
