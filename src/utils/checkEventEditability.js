import constants from '../constants'
import moment from 'moment'
import {get, isNull, isUndefined} from 'lodash'
import {doValidations} from '../validation/validator'
import getContentLanguages from './language'
import {mapAPIDataToUIFormat} from './formDataMapping'
import {getOrganizationMembershipIds} from './user'

const {PUBLICATION_STATUS, EVENT_STATUS, USER_TYPE, SUPER_EVENT_TYPE_UMBRELLA} = constants

export const userMayEdit = (user, event) => {
    const adminOrganizations = get(user, 'adminOrganizations')
    const userOrganization = get(user, 'organization')
    const eventOrganization = get(event, 'organization')
    const organizationMemberships = get(user, 'organizationMemberships')
    const publicationStatus = get(event, 'publication_status')
    const userHasOrganizations = !isNull(getOrganizationMembershipIds(user))

    let userMayEdit = false

    // users that don't belong to any organization are not allowed to edit
    if (!userHasOrganizations) {
        return false
    }
    // For simplicity, support both old and new user api.
    // Check admin_organizations and organization_membership, but fall back to user.organization if needed
    if (adminOrganizations) {
    // TODO: in the future, we will need information (currently not present) on whether event.organization is
    // a sub-organization of the user admin_organization. This should be done in the API by e.g.
    // including all super-organizations of a sub-organization in the sub-organization API JSON,
    // and fetching that json for the event organization.
        userMayEdit = adminOrganizations.includes(eventOrganization)
    } else {
        userMayEdit = eventOrganization === userOrganization
    }

    // exceptions to the above:
    if (organizationMemberships && !userMayEdit) {
    // non-admins may still edit drafts if they are organization members
        userMayEdit = organizationMemberships.includes(eventOrganization)
            && publicationStatus === PUBLICATION_STATUS.DRAFT
    }
    if ((userOrganization || adminOrganizations) && !eventOrganization) {
    // if event has no organization, we are creating a new event. it is allowed for users with organizations,
    // disallowed for everybody else. event organization is set by the API when POSTing.
        userMayEdit = true
    }

    return userMayEdit
}

export const userCanDoAction = (user, event, action) => {
    const isUmbrellaEvent = get(event, 'super_event_type') === SUPER_EVENT_TYPE_UMBRELLA
    const isDraft = get(event, 'publication_status') === PUBLICATION_STATUS.DRAFT
    const isPublic = get(event, 'publication_status') === PUBLICATION_STATUS.PUBLIC
    const isRegularUser = get(user, 'userType') === USER_TYPE.REGULAR
    const isSubEvent = !isUndefined(get(event, ['super_event', '@id']))

    if (action === 'publish') {
        if (!event.id || (isDraft && isSubEvent)) {
            return false
        }
        // format event, so that we can validate it
        const formattedEvent = mapAPIDataToUIFormat(event)
        // validate
        const validations = doValidations(formattedEvent, getContentLanguages(formattedEvent), PUBLICATION_STATUS.PUBLIC)
        // check if there as errors
        const hasValidationErrors = Object.keys(validations).length > 0

        return !hasValidationErrors
    }
    if (action === 'update' && isDraft && isSubEvent) {
        return false
    }
    if (action === 'cancel') {
        return !(isDraft || (isRegularUser && isPublic))
    }
    if (action === 'edit' || action === 'update' || action === 'delete') {
        return !(isRegularUser && (isUmbrellaEvent || isPublic))
    }

    return true
}

export const checkEventEditability = (user, event, action) => {
    const userMayEdit = module.exports.userMayEdit(user, event)
    const userCanDoAction = module.exports.userCanDoAction(user, event, action)
    const isDraft = get(event, 'publication_status') === PUBLICATION_STATUS.DRAFT
    const endTime = get(event, 'end_time', '')
    const eventIsInThePast = moment(endTime, moment.defaultFormatUtc).isBefore(moment());
    const eventIsCancelled = get(event, 'event_status') === EVENT_STATUS.CANCELLED
    const isSubEvent = !isUndefined(get(event, ['super_event', '@id']))

    const getExplanationId = () => {
        if (isDraft && action === 'cancel') {
            return 'draft-cancel'
        }
        if (!userCanDoAction && (action === 'publish' || action === 'update') && isSubEvent) {
            return 'draft-publish-subevent'
        }
        if (!userCanDoAction && action === 'publish') {
            return 'event-validation-errors'
        }
        if (eventIsInThePast) {
            return 'event-in-the-past'
        }
        if (eventIsCancelled) {
            return 'event-canceled'
        }
        if (!userMayEdit || !userCanDoAction) {
            return 'user-no-rights-edit'
        }
    }

    const explanationId = getExplanationId()
    const editable = !eventIsInThePast
        && !eventIsCancelled
        && userMayEdit
        && userCanDoAction

    return {editable, explanationId}
}
