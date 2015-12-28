import constants from '../constants'
import fetch from 'isomorphic-fetch'

function makeRequest(query) {
    var url = `${appSettings.api_base}/event/?text=${query}`
    return fetch(url)
}

export function receiveEvents(json) {
    return {
        type: constants.RECEIVE_EVENTS,
        items: json.data,
        receivedAt: Date.now()
    }
}

export function fetchEvents(query) {
    return (dispatch) => {
        return makeRequest(query)
            .then(response => response.json())
            .then(json => dispatch(receiveEvents(json)))
    }
}
