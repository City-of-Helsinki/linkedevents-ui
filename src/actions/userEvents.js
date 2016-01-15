import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch'
import { receiveEvents } from './events'
import constants from '../constants'

function makeRequest(organization) {
    var url = `${appSettings.api_base}/event/?organization=${organization}&show_all=1`
    return fetch(url);
}

export const startFetching = createAction(constants.REQUEST_EVENTS);

export function fetchUserEvents(user) {
    return (dispatch) => {
        dispatch(startFetching);
        makeRequest(user.organization).then(function (response) {
            if (response.status >= 400) {
                dispatch(receiveEvents({
                    error: 'API Error ' + response.status}));
            }
            json = response.json().then(json => dispatch(receiveEvents(json)));
        });
    }
}
