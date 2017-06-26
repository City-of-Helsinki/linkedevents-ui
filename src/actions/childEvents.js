import { createAction } from 'redux-actions';
// import fetch from 'isomorphic-fetch'

import authedFetch from 'src/utils/authedFetch'
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

export const startFetching = createAction(constants.REQUEST_CHILD_EVENTS);

export function receiveChildEvents(json) {
    console.log('Received child events:', json.data);
    return {
        type: constants.RECEIVE_CHILD_EVENTS,
        events: json.data
    }
}

export function receiveChildEventsError(error) {
    return {
        type: constants.RECEIVE_CHILD_EVENTS_ERROR,
        error: error
    }
}

export function fetchChildEvents(user, superEventID) {
    return (dispatch) => {
        dispatch(startFetching());
        makeRequest(user, superEventID, dispatch).then(function (response) {
            if (response.status >= 400) {
                dispatch(receiveChildEventsError({
                    error: 'API Error ' + response.status
                }));
            }
            response.json().then(json => dispatch(receiveChildEvents(json)));
        })
        .catch(e => {
            // Error happened while fetching ajax (connection or javascript)
        });
    }
}
