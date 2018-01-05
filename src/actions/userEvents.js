import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch'
import { receiveEvents } from './events'
import constants from '../constants'

import authedFetch from 'src/utils/authedFetch'

import { setFlashMsg } from './app'

function makeRequest(user = {}, page, sortBy, sortOrder, dispatch) {
    const {organization} = user
    let apiSortDirectionPrefix = ''
    if (sortOrder === 'desc') {
        apiSortDirectionPrefix = '-'
    }
    let apiSortParam = apiSortDirectionPrefix + sortBy

    var url = `${appSettings.api_base}/event/?publisher=${organization}&show_all=1&sort=${apiSortParam}&page_size=100`
    if(appSettings.nocache) {
        url += `&nocache=${Date.now()}`
    }

    let options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }

    return authedFetch(url, options, user, dispatch);
}

export const startFetching = createAction(constants.REQUEST_USER_EVENTS);

export function receiveUserEvents(json) {
    return {
        type: constants.RECEIVE_USER_EVENTS,
        items: json.data,
        receivedAt: Date.now()
    }
}

export function receiveUserEventsError(error) {
    return {
        type: constants.RECEIVE_USER_EVENTS_ERROR,
        error: error,
        items: []
    }
}

export function fetchUserEvents(user, page, sortBy, sortOrder) {
    return (dispatch) => {
        dispatch(startFetching());
        makeRequest(user, page, sortBy, sortOrder, dispatch).then(function (response) {
            if (response.status >= 400) {
                dispatch(receiveUserEventsError({
                    error: 'API Error ' + response.status
                }));
            }
            response.json().then(json => dispatch(receiveUserEvents(json)));
        })
        .catch(e => {
            // Error happened while fetching ajax (connection or javascript)
        });
    }
}

export function setUserEventsSortOrder(sortBy, sortOrder) {
    return {
        type: constants.SET_USER_EVENTS_SORTORDER,
        sortBy: sortBy,
        sortOrder: sortOrder
    }
}
