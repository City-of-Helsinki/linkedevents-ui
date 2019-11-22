import constants from '../constants.js'
import fetch from 'isomorphic-fetch'
import {set, get} from 'lodash'
import {setEditorAuthFlashMsg} from './editor'
import client from '../api/client'
import axios from 'axios'
import {getAdminOrganizations} from '../utils/user'

// Handled by the user reducer
export function receiveUserData(data) {
    return {
        type: constants.RECEIVE_USERDATA,
        payload: data,
    }
}

// Handled by the user reducer
export function clearUserData() {
    return {
        type: constants.CLEAR_USERDATA,
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

export const retrieveUserFromSession = () => {
    return async (dispatch) => {
        try {
            const meResponse = await axios.get(`auth/me?${+new Date()}`)
            const user = meResponse.data

            if (user.token) {
                const userResponse = await client.get(`user/${user.username}`, {}, {
                    headers: {Authorization: `JWT ${user.token}`},
                })
                const userData = userResponse.data
                const permissions = []

                if (get(userData, 'admin_organizations', []).length > 0) {
                    permissions.push('admin')
                }
                if (get(userData, 'organization_memberships', []).length > 0) {
                    permissions.push('regular')
                }

                const mergedUser = {
                    ...user,
                    organization: get(userData, 'organization', null),
                    adminOrganizations: get(userData, 'admin_organizations', null),
                    organizationMemberships: get(userData, 'organization_memberships', null),
                    permissions,
                }

                Promise.all(getAdminOrganizations(mergedUser))
                    .then(adminOrganizations => {
                        // store data of all the organizations that the user is admin in
                        mergedUser.adminOrganizationData = adminOrganizations
                            .reduce((acc, organization) => set(acc, `${organization.data.id}`, organization.data), {})
                        // get the affiliated organizations
                        mergedUser.affiliatedOrganizations = adminOrganizations
                            .filter(organization => get(organization, ['data', 'is_affiliated'], false))
                            .map(organization => organization.data.id)
                    })
                    .finally(() => {
                        saveUserToLocalStorage(mergedUser)
                        dispatch(receiveUserData(mergedUser))
                        dispatch(setEditorAuthFlashMsg())
                    })
            }
        } catch (e) {
            throw Error(e)
        }
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
        dispatch(setEditorAuthFlashMsg())
    };
}
