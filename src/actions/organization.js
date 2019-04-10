import fetch from 'isomorphic-fetch';
import constants from '../constants';

export const fetchAdminOrganization = () => ({
    type: constants.ORG_FETCH_ADMIN,
});

export const fetchAdminOrganizationFailed = () => ({
    type: constants.ORG_FETCH_ADMIN_FAILED,
});

export const fetchAdminOrganizationSuccess = (data) => ({
    type: constants.ORG_FETCH_ADMIN_SUCCESS,
    data,
});

export const fetchUserAdminOrganization = () => {
    return (dispatch, getState) => {
        const user = getState().user;
        if (user) {
            const orgIds = user.adminOrganizations || [];
            const organizations = [];
            dispatch(fetchAdminOrganization());
            Promise.all(orgIds.map(id => fetch(`${appSettings.api_base}/organization/${id}`)))
                .then(responses => Promise.all(responses.map(res => res.json())))
                .then(results => {
                    results.forEach(org => organizations.push(org));
                    dispatch(fetchAdminOrganizationSuccess(organizations));
                })
                .catch(() => {
                    dispatch(fetchAdminOrganizationFailed());
                })
        }
    };
};
