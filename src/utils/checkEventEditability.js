import constants from '../constants'
import moment from 'moment'

export function userMayEdit(user, event) {
    let userMayEdit = false
    // For simplicity, support both old and new user api.
    // Check admin_organizations and organization_membership, but fall back to user.organization if needed
    if (user && user.adminOrganizations) {
    // TODO: in the future, we will need information (currently not present) on whether event.organization is
    // a suborganization of the user admin_organization. This should be done in the API by e.g.
    // including all superorganizations of a suborganization in the suborganization API JSON,
    // and fetching that json for the event organization.
        userMayEdit = (event && user && event.organization &&
        user.adminOrganizations.includes(event.organization))
    } else {
        userMayEdit = (event && user && event.organization &&
        user.organization === event.organization)
    }

    // exceptions to the above:
    if (user && user.organizationMemberships && !userMayEdit) {
    // non-admins may still edit drafts if they are organization members
        userMayEdit = (event && user && event.organization &&
        user.organizationMemberships.includes(event.organization) &&
        event.publication_status == constants.PUBLICATION_STATUS.DRAFT )
    }
    if (user && (user.organization || user.adminOrganizations) && !event.organization) {
    // if event has no organization, we are creating a new event. it is allowed for users with organizations,
    // disallowed for everybody else. event organization is set by the API when POSTing.
        userMayEdit = true
    }

    return userMayEdit
}

export function eventIsCancelled(event) {
    let eventIsCancelled = (event && event.event_status == constants.EVENT_STATUS.CANCELLED)
    return eventIsCancelled
}

export function eventIsInThePast(event) {
    //Check if event (end time) is in the past. If event is in the past then editing is not allowed
    let eventIsInThePast = false
    if (event && event.end_time) {
    //Convert to moment object
        let endTime = moment(event.end_time, moment.defaultFormatUtc)
        let currentDate = moment()
        if (currentDate.diff(endTime) > 0) {
            //Event is in the past
            eventIsInThePast = true
        }
    }
    return eventIsInThePast
}

export function checkEventEditability(user, event) {
    let eventEditabilityExplanation = ''
    let eventIsInThePast = module.exports.eventIsInThePast(event)
    if (eventIsInThePast) {
        eventEditabilityExplanation = 'Menneisyydessä olevia tapahtumia ei voi muokata.'
    }
    let eventIsCancelled = module.exports.eventIsCancelled(event)
    if (eventIsCancelled) {
        eventEditabilityExplanation = 'Peruttuja tapahtumia ei voi muokata.'
    }
    let userMayEdit = module.exports.userMayEdit(user, event)
    if (!userMayEdit) {
        eventEditabilityExplanation = 'Sinulla ei ole oikeuksia muokata tätä tapahtumaa.'
    }
    return {eventIsEditable: !eventIsInThePast && !eventIsCancelled && userMayEdit, eventEditabilityExplanation}
}
