import {createAction} from 'redux-actions'
// import fetch from 'isomorphic-fetch'
import $ from 'jquery' // how do i the same thing in fetch?!? horrible docs
import constants from '../constants'
import {setData} from './editor'
import {setFlashMsg} from './app'
import {get as getIfExists} from 'lodash'
import client from '../api/client'


export function selectImage(image) {
    return {
        type: constants.SELECT_IMAGE_BY_ID,
        img: image,
    }
}

// TODO: Remove this with jquery
function makeRequest(organization, pg_size) {
    var url = `${appSettings.api_base}/image/?page_size=${pg_size}&publisher=${organization}`
    if (appSettings.nocache) {
        url += `&nocache=${Date.now()}`
    }
    return $.getJSON(url);
}

/**
 * Fetch images from the API.
 *
 * @param organization
 * @param pg_size = page size, how many images do you want to display on a single page.
 * @returns Object
 */
async function makeImageRequest(organization, pageSize, pageNumber = null) {
    let result;
    
    if (!pageNumber) {
        // Default request when the modal is loaded
        result = await client.get('image', {page_size: pageSize, $publisher: organization});
    } else {
        // When the user wants to load another page of images
        result = await client.get('image', {page_size: pageSize, $publisher: organization, page: pageNumber});
        
        // Append the page number to the JSON array so that it can be easily used in the pagination
        result.data.meta.currentPage = pageNumber;
    }
    
    return result;
}

export function fetchUserImages(organization, pageSize = 100, pageNumber = null) {
    const startFetching = createAction(constants.REQUEST_IMAGES_AND_META);
    
    return async (dispatch) => {
        let response;
        
        try {
            dispatch(startFetching);
    
            response = await makeImageRequest(getIfExists(organization, 'organization', null), pageSize, pageNumber);
            
            dispatch(receiveUserImagesAndMeta(response));
        } catch (error) {
            dispatch(setFlashMsg(getIfExists(response, 'detail', 'Error fetching images'), 'error', response));
            dispatch(receiveUserImagesFail(response));
            new Error(error);
        }
    };
    
    // Original
    // return (dispatch) => {
    //     dispatch(startFetching)
    //     makeRequest(getIfExists(organization, 'organization', null), pageSize).done(response => {
    //         dispatch(receiveUserImages(response))
    //     }).fail(response => {
    //         dispatch(setFlashMsg(getIfExists(response, 'detail', 'Error fetching images'), 'error', response))
    //         dispatch(receiveUserImagesFail(response))
    //     });
    // }
}

// TODO: Remove this (and the reducer?) with jquery
export function receiveUserImages(response) {
    return {
        type: constants.RECEIVE_IMAGES,
        items: response.data,
    }
}

/**
 * An action for fetching both images and meta data, that holds the next / previous page information and image count.
 *
 * @param response
 * @returns Object
 */
export function receiveUserImagesAndMeta(response) {
    return {
        type: constants.RECEIVE_IMAGES_AND_META,
        items: response.data.data,
        meta: response.data.meta,
    }
}

export function receiveUserImagesFail(response) {
    return {
        type: constants.RECEIVE_IMAGES_ERROR,
        items: [],
    }
}

export function imageUploadFailed(json) {
    return {
        type: constants.IMAGE_UPLOAD_ERROR,
        data: json,
    }
}

export function imageUploadComplete(json) {
    return {
        type: constants.IMAGE_UPLOAD_SUCCESS,
        data: json,
    }
}

function getRequestBaseSettings(user, method = 'POST', imageId = null) {
    let token = user ? user.token : ''
    
    let url = appSettings.api_base + '/image/'
    if (imageId) {
        url += imageId + '/'
    }
    
    return {
        'async': true,
        'crossDomain': true,
        'url': url,
        'method': method,
        'headers': {
            'authorization': 'JWT ' + token,
            'accept': 'application/json',
        },
        'processData': false,
    }
}

export function postImage(formData, user, imageId = null) {
    // return async (dispatch) => {
    //     try {
    //         const requestContentSettings = {
    //             'mimeType': 'multipart/form-data',
    //             'contentType': false,
    //             'data': formData,
    //         };
    //
    //     } catch (error) {
    //
    //     }
    // }
    
    return (dispatch) => {
        const requestContentSettings = {
            'mimeType': 'multipart/form-data',
            'contentType': false,
            'data': formData,
        };

        const baseSettings = imageId ? getRequestBaseSettings(user, 'PUT', imageId) : getRequestBaseSettings(user)

        let settings = Object.assign({}, baseSettings, requestContentSettings)
        return $.ajax(settings).done(response => {
            //if we POST form-data, jquery won't parse the response
            let resp = response
            if(typeof(response) == 'string') {
                resp = JSON.parse(response)
            }

            //creation success. set the newly created image as the val of the form
            dispatch(setData({'image': resp}))
            // and also set the preview image
            dispatch(imageUploadComplete(resp))
            // and flash a message
            dispatch(setFlashMsg(imageId ? 'image-update-success' : 'image-creation-success', 'success', response))

        }).fail(response => {
            dispatch(setFlashMsg('image-creation-error', 'error', response))
            dispatch(imageUploadFailed(response)) //this doesn't do anything ATM
        })
    }
}

export function deleteImage(selectedImage, user) {
    return async (dispatch) => {
        try {
            const query = await client.delete(`image/${selectedImage.id}`);
    
            // Update form image value
            dispatch(setData({'image': null}));
    
            dispatch(setFlashMsg('image-deletion-success', 'success', ''));
    
            // Update image listing
            dispatch(fetchUserImages(user));
        } catch (error) {
            dispatch(setFlashMsg('image-deletion-error', 'error', error));
            
            new Error(error);
        }
    }
}
