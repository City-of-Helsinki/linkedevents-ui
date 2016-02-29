import constants from '../constants.js'
import fetch from 'isomorphic-fetch'
import _ from 'lodash'

// Handled by the user reducer
export function receiveUserData(data) {
    return {
        type: constants.RECEIVE_USERDATA,
        payload: data
    }
}

// Handled by the user reducer
export function clearUserData() {
    return {
        type: constants.CLEAR_USERDATA
    }
}

// Adds an expiration time for user and saves it to localStorage.
function saveUserToLocalStorage(user) {
    let modifiedUser = Object.assign({}, user)

    let expiryDate = new Date()
    let expiryTime = appSettings.local_storage_user_expiry_time || 12
    expiryDate.setHours(expiryDate.getHours() + expiryTime)
    modifiedUser.localStorageExpires = expiryDate.toISOString()
    localStorage.setItem('user', JSON.stringify(modifiedUser))
}

export function retrieveUserFromSession() {
    return (dispatch) => {
        return fetch('/auth/me?' + (+new Date()), {method: 'GET', credentials: 'same-origin'}).then((response) => {
            return response.json()
        }).then((user) => {
            if(user.token) {
                const settings = {
                    headers: {
                        'Authorization': 'JWT ' + user.token
                    }
                }
                return fetch(`${appSettings.api_base}/user/${user.username}/`, settings).then((response) => {
                    return response.json()
                }).then((organizationJSON) => {
                    let mergedUser = Object.assign({}, user, { organization: _.get(organizationJSON, 'organization', null) })

                    saveUserToLocalStorage(mergedUser)
                    return dispatch(receiveUserData(mergedUser))
                })
            } else {
                // dispatch(login())
            }
        })
    }
}

export function login() {
  return (dispatch) => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {  // Not in DOM? Just try to get an user then and see how that goes.
        return resolve(true);
      }
      const loginPopup = window.open(
        '/auth/login/helsinki',
        'kkLoginWindow',
        'location,scrollbars=on,width=720,height=600'
      );
      const wait = function wait() {
        if (loginPopup.closed) { // Is our login popup gone?
          return resolve(true);
        }
        setTimeout(wait, 500); // Try again in a bit...
      };
      wait();
    }).then(() => {
      return dispatch(retrieveUserFromSession());
    });
  };
}

export function logout() {
  return (dispatch) => {
      fetch('/auth/logout', {method: 'POST', credentials: 'same-origin'}) // Fire-and-forget
      localStorage.removeItem('user')
      dispatch(clearUserData())
  };
}
