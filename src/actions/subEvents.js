import { createAction } from 'redux-actions';
// import fetch from 'isomorphic-fetch'

import authedFetch from '../utils/authedFetch'
import constants from '../constants'

function makeRequest(superEventID, user = {}, dispatch) {
    const url = `${appSettings.api_base}/event/?super_event=${superEventID}&page_size=100`

    const options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }

    return authedFetch(url, options, user, dispatch);
}

export const startFetching = createAction(constants.REQUEST_SUB_EVENTS);

export function receiveSubEvents(json) {
    return {
        type: constants.RECEIVE_SUB_EVENTS,
        events: json.data
    }
}

export function receiveSubEventsError(error) {
    return {
        type: constants.RECEIVE_SUB_EVENTS_ERROR,
        error: error
    }
}

export function fetchSubEvents(user, superEventID) {
    return (dispatch) => {
        dispatch(startFetching());
        makeRequest(user, superEventID, dispatch).then(function (response) {
            if (response.status >= 400) {
                dispatch(receiveSubEventsError({
                    error: 'API Error ' + response.status
                }));
            }
            response.json().then(json => dispatch(receiveSubEvents(json)));
        })
        .catch(e => {
            // Error happened while fetching ajax (connection or javascript)
        });
    }
}
