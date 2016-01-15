import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch'
import { receiveEvents } from './events'
import constants from '../constants'

function makeRequest(organization, page) {
    var url = `${appSettings.api_base}/event/?organization=${organization}&show_all=1&sort=-last_modified_time&page_size=100`
    //var url = `${appSettings.api_base}/event/?show_all=1&sort=-last_modified_time&page_size=100`
    return fetch(url);
}

export const startFetching = createAction(constants.REQUEST_EVENTS);

export function fetchUserEvents(user, page) {
    return (dispatch) => {
        dispatch(startFetching);
        makeRequest(user.organization, page).then(function (response) {
            if (response.status >= 400) {
                dispatch(receiveEvents({
                    error: 'API Error ' + response.status}));
            }
            response.json().then(json => dispatch(receiveEvents(json)));
        });
    }
}
