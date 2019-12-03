import {get} from 'lodash'
import client from '../api/client'
import constants from '../constants'

const {USER_TYPE} = constants

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


/**
 * Returns the ID's of the organizations that the user is part of depending on user type
 * @param user  User data
 */
export const getOrganizationMembershipIds = user => {
    if (!user.userType ) {
        return null
    }
    if (user.userType === USER_TYPE.ADMIN) {
        return user.adminOrganizations
    }
    if (user.userType === USER_TYPE.REGULAR) {
        return user.organizationMemberships
    }
}
