import { createAction } from 'redux-actions'
import fetch from 'isomorphic-fetch'
import $ from 'jquery' // can't set headers in fetch?!?
import constants from '../constants'
import { setData } from './editor'

export function selectImage(image) {
    return {
        type: constants.SELECT_IMAGE_BY_ID,
        img: image
    }
}

function makeRequest(organization, page) {
    var url = `${appSettings.api_base}/image/`
    return fetch(url);
}

export const startFetching = createAction(constants.REQUEST_IMAGES);

export function fetchUserImages(user, page) {
    return (dispatch) => {
        dispatch(startFetching);
        makeRequest(user.organization, page).then(function (response) {
            if (response.status >= 400) {
                dispatch(receiveUserImages({
                    error: 'API Error ' + response.status}));
            }
            response.json().then(json => dispatch(receiveUserImages(json)));
        });
    }
}

export function receiveUserImages(json) {
    if(json.error) {
        console.log("error fetching images")
        return {
            type: constants.RECEIVE_IMAGES_ERROR,
            apiErrorMsg: json.error,
            items: []
        }
    }
    else {
        return {
            type: constants.RECEIVE_IMAGES,
            items: json.data,
            receivedAt: Date.now()
        }
    }
}

export function uploadImage(formData, user, closeModalFn) {
    return (dispatch) => {
        let token = ''
        if(user) { //might not exist
            token = user.token
        }

        let settings = {
            "async": true,
            "crossDomain": true,
            "url": `${appSettings.api_base}/image/`,
            "method": "POST",
            "headers": {
                "authorization": 'JWT ' + token,
                "accept": "application/json",
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": formData
        }

        return $.ajax(settings).done(response => {
            let json = JSON.parse(response)
            // set the id of the newly created picture as the val of the form
            dispatch(setData({'image': json}))
            // and also set the preview image
            dispatch(imageUploadComplete(json))
            closeModalFn()
        }).fail(response => {
            dispatch(imageUploadFailed(response))
        })
    }
}

export function imageUploadFailed(json) {
    return {
        type: constants.IMAGE_UPLOAD_ERROR,
        data: json
    }
}

export function imageUploadComplete(json) {
    return {
        type: constants.IMAGE_UPLOAD_SUCCESS,
        data: json
    }
}
