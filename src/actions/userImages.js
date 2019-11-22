import {createAction} from 'redux-actions'
import constants from '../constants'
import {setData} from './editor'
import {setFlashMsg} from './app'
import {get as getIfExists} from 'lodash'
import client from '../api/client'

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
}

export function selectImage(image) {
    return {
        type: constants.SELECT_IMAGE_BY_ID,
        img: image,
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

export function postImage(formData, user, imageId = null) {
    return async (dispatch) => {
        try {
            // Use PUT when updating the existing image metadata, use POST when adding a new image.
            const request = (imageId) ? await client.put(`image/${imageId}`, formData) : await client.post(`image/`, formData);

            // Append updated image data to the form
            dispatch(setData({'image': request}));
            
            dispatch(imageUploadComplete(request));
            
            dispatch(setFlashMsg(imageId ? 'image-update-success' : 'image-creation-success', 'success', request))
        } catch (error) {
            dispatch(setFlashMsg('image-creation-error', 'error', error));
    
            dispatch(imageUploadFailed(error));
            
            new Error(error);
        }
    }
}

export function deleteImage(selectedImage, user) {
    return async (dispatch) => {
        try {
            const request = await client.delete(`image/${selectedImage.id}`);
    
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
