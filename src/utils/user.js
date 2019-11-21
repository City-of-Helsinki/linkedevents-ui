import {get} from 'lodash'
import client from '../api/client'
import store from '../store'

/**
 * Return the current user data
 */
export const getUser = () => {
    const state = store.getState()
    return get(state, 'user')
}

/**
 * Returns a boolean for whether the given user and type match any of the permissions
 * @param user  User data
 * @param type  User type to check for (admin, regular)
 * @returns {boolean}
 */
export const getIsUserOfType = (user, type) => {
    const permissions = get(user, 'permissions')
    if (!permissions) {
        return false
    }
    return permissions.includes(type)
}

/**
 * Returns a promise containing data for the given organization
 * @param organizationId  Organization ID
 */
export const getOrganization = (organizationId) => {
    try {
        return client.get(`organization/${organizationId}`)
    } catch (e) {
        throw Error(e)
    }
}

/**
 * Returns a promise containing data for the admin organizations that the given user belongs to
 * @param user  User data
 */
export const getAdminOrganizations = user =>
    get(user, 'adminOrganizations', [])
        .map(getOrganization)

/**
 * Returns whether the given user has any affiliated organizations
 * @param user  User data
 */
export const hasAffiliatedOrganizations = user =>
    get(user, 'affiliatedOrganizations', []).length > 0
