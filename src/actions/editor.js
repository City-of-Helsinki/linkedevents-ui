import constants from '../constants'

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
export function sendData() {
    // Call ajax, then sendDataComplete
    return {
        type: constants.EDITOR_SENDDATA
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
