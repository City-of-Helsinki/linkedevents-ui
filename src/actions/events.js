import constants from '../constants'
import fetch from 'isomorphic-fetch'
import authedFetch from '../utils/authedFetch'

import {setFlashMsg} from './app'

function makeRequest(query, startDate, endDate) {
    var url = `${appSettings.api_base}/event/?text=${encodeURI(query)}&page_size=100&sort=start_time`;

    if(appSettings.nocache) {
        url += `&nocache=${Date.now()}`
    }

    if (startDate) {
        url += `&start=${startDate.format('YYYY-MM-DD')}`
    }
    if (endDate) {
        url += `&end=${endDate.format('YYYY-MM-DD')}`
    }

    return fetch(url).then(function(response) {
        if (response.status >= 400) {
            return {
                apiErrorMsg: 'API error from server',
            }
        }
        return response.json()
    })
        .catch(e => {
            // Error happened while fetching ajax (connection or javascript)
        })
}

export function receiveEvents(json) {
    if(json.apiErrorMsg) {
        return {
            type: constants.RECEIVE_EVENTS_ERROR,
            apiErrorMsg: json.apiErrorMsg,
            items: [],
        }
    }
    else {
        return {
            type: constants.RECEIVE_EVENTS,
            items: json.data,
            receivedAt: Date.now(),
        }
    }
}

export function startFetchingEvents() {
    return {
        type: constants.REQUEST_EVENTS,
    }
}

// NOTE: Server should always return either json, or nothing (on failed connection)
export function fetchEvents(query, startDate, endDate) {
    return (dispatch) => {
        dispatch(startFetchingEvents())
        return makeRequest(query, startDate, endDate)
            .then(json => dispatch(receiveEvents(json)))
    }
}

export function receiveEventDetails(json) {
    return {
        type: constants.RECEIVE_EVENT_DETAILS,
        event: json,
    }
}

export function receiveEventDetailsError(error) {
    return {
        type: constants.RECEIVE_EVENT_DETAILS_ERROR,
        error: error,
    }
}

export function startFetchingEventDetails() {
    return {
        type: constants.REQUEST_EVENT,
    }
}

export function fetchEventDetails(eventID, user = {}) {
    let url = `${appSettings.api_base}/event/${eventID}/?include=keywords,location,audience,in_language,external_links,image,publisher`

    if(appSettings.nocache) {
        url += `&nocache=${Date.now()}`
    }

    let options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }

    return (dispatch) => {
        dispatch(startFetchingEventDetails())

        return authedFetch(url, options, user, dispatch)
            .then(response => {
                if (response.status >= 400) {
                    return {
                        apiErrorMsg: 'API error from server',
                    }
                }
                return response.json()
            })
            .then(json => {
                if(!json.apiErrorMsg) {
                    dispatch(receiveEventDetails(json))
                } else {
                    dispatch(receiveEventDetailsError(json.apiErrorMsg))
                }
            })
            .catch(e => {
                dispatch(receiveEventDetailsError(e))
                // Error happened while fetching ajax (connection or javascript)
            })
    }
}
