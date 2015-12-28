import constants from '../constants'
import fetch from 'isomorphic-fetch'

function makeRequest(query, startDate, endDate) {
    var url = `${appSettings.api_base}/event/?text=${query}`

    if (startDate) {
        url += `&start=${startDate.format('YYYY-MM-DD')}`;
    }
    if (endDate) {
        url += `&end=${endDate.format('YYYY-MM-DD')}`;
    }

    return fetch(url)
}

export function receiveEvents(json) {
    return {
        type: constants.RECEIVE_EVENTS,
        items: json.data,
        receivedAt: Date.now()
    }
}

export function fetchEvents(query, startDate, endDate) {
    return (dispatch) => {
        return makeRequest(query, startDate, endDate)
            .then(response => response.json())
            .then(json => dispatch(receiveEvents(json)))
    }
}
