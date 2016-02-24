import { createAction } from 'redux-actions'
// import fetch from 'isomorphic-fetch'
import $ from 'jquery' // how do i the same thing in fetch?!? horrible docs
import constants from '../constants'
import { setData } from './editor'

export function selectImage(image) {
    return {
        type: constants.SELECT_IMAGE_BY_ID,
        img: image
    }
}

function makeRequest(organization, pg_size) {
    var url = `${appSettings.api_base}/image/?page_size=${pg_size}`
    return $.getJSON(url);
}

export const startFetching = createAction(constants.REQUEST_IMAGES);

export function fetchUserImages(user, page_size) {
    return (dispatch) => {
        dispatch(startFetching);
        makeRequest(user.organization, page_size).then(function (response) {
            if (response.status >= 400) {
                return dispatch(receiveUserImages({
                    error: 'API Error ' + response.status}));
            }
            return dispatch(receiveUserImages(response))
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

export function postImage(formData = null, user, externalUrl = null) {
    return (dispatch) => {
        let token = ''
        if(user) { //might not exist
            token = user.token
        }

        let requestContentSettings = {}
        if(formData) {
            requestContentSettings = {
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": formData
            }
        } else {
            requestContentSettings = {
                "contentType": "application/json",
                "data": JSON.stringify({'url':externalUrl})
            }
        }

        let baseSettings = {
            "async": true,
            "crossDomain": true,
            "url": `${appSettings.api_base}/image/`,
            "method": "POST",
            "headers": {
                "authorization": 'JWT ' + token,
                "accept": "application/json",
            },
            "processData": false
        }

        let settings = Object.assign({}, baseSettings, requestContentSettings)
        return $.ajax(settings).done(response => {
            //if we POST form-data, jquery won't parse the response
            let resp = response
            if(typeof(response) == "string") {
                resp = JSON.parse(response)
            }

            //creation success. set the newly created image as the val of the form
            dispatch(setData({'image': resp}))
            // and also set the preview image
            dispatch(imageUploadComplete(resp))
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
