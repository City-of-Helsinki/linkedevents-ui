import constants from '../constants'

import {mapUIDataToAPIFormat} from 'src/utils/formDataMapping.js'

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
        console.log(formValues, user)
        console.log('Sending: ', mapUIDataToAPIFormat(formValues))

        let url = `${appSettings.api_base}/event/`
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + user.token,
            },
            body: JSON.stringify(mapUIDataToAPIFormat(formValues))
        }).then(json => dispatch(sendDataComplete(json)))
    }
}

export function sendDataComplete(json) {
    if(json.apiErrorMsg) {
        return {
            type: constants.EDITOR_SENDDATA_ERROR,
            error: json.apiErrorMsg
        }
    }
    else {
        return {
            type: constants.EDITOR_SENDDATA_SUCCESS,
            data: json.data,
            createdAt: Date.now()
        }
    }
}
