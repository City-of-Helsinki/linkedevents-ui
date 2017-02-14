import { createAction } from 'redux-actions'
// import fetch from 'isomorphic-fetch'
import $ from 'jquery' // how do i the same thing in fetch?!? horrible docs
import constants from '../constants'
import { setData } from './editor'
import { setFlashMsg } from './app'
import { get as getIfExists } from 'lodash'


export function selectImage(image) {
    return {
        type: constants.SELECT_IMAGE_BY_ID,
        img: image
    }
}

function makeRequest(organization, pg_size) {
    var url = `${appSettings.api_base}/image/?page_size=${pg_size}&publisher=${organization}`
    if(appSettings.nocache) {
        url += `&nocache=${Date.now()}`
    }
    return $.getJSON(url);
}

function getRequestBaseSettings(user, method = "POST", image_id = null) {
    let token = user ? user.token : ""

    let url = appSettings.api_base + "/image/"
    if (image_id) {
        url += image_id + "/"
    }

    return {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": method,
        "headers": {
            "authorization": 'JWT ' + token,
            "accept": "application/json",
        },
        "processData": false
    }

}

export const startFetching = createAction(constants.REQUEST_IMAGES);

export function fetchUserImages(user, page_size) {
    return (dispatch) => {
        dispatch(startFetching)
        makeRequest(getIfExists(user, 'organization', null), page_size).done(response => {
            dispatch(receiveUserImages(response))
        }).fail(response => {
            dispatch(setFlashMsg(getIfExists(response, 'detail', 'Error fetching images'), 'error', response))
            dispatch(receiveUserImagesFail(response))
        });
    }
}

export function receiveUserImages(response) {
    return {
        type: constants.RECEIVE_IMAGES,
        items: response.data,
    }
}

export function receiveUserImagesFail(response) {
    return {
        type: constants.RECEIVE_IMAGES_ERROR,
        items: []
    }
}

export function postImage(formData, user) {
    return (dispatch) => {
        const requestContentSettings = {
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": formData
        }

        const baseSettings = getRequestBaseSettings(user);

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
            // and flash a message
            dispatch(setFlashMsg('image-creation-success', 'success', response))

        }).fail(response => {
            dispatch(setFlashMsg('image-creation-error', 'error', response))
            dispatch(imageUploadFailed(response)) //this doesn't do anything ATM
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

export function deleteImage(selectedImage, user) {
    return (dispatch) => {
        const settings = getRequestBaseSettings(user, "DELETE", selectedImage.id)
        return $.ajax(settings).done(response => {

            // update form image value
            dispatch(setData({'image': null}))

            dispatch(setFlashMsg('image-deletion-success', 'success', response))

            // update image picker images
            dispatch(fetchUserImages(user, 1000))

        }).fail(response => {
            dispatch(setFlashMsg('image-deletion-error', 'error', response))
        })
    }
}
