import constants from '../constants';

const initialState = {
    admin: [],
    isFetching: false,
};

const update = (state = initialState, action) => {
    switch (action.type) {
        case constants.ORG_FETCH_ADMIN:
            return Object.assign({}, state, {isFetching: true});
        case constants.ORG_FETCH_ADMIN_FAILED:
            return Object.assign({}, state, {isFetching: false});
        case constants.ORG_FETCH_ADMIN_SUCCESS:
            return Object.assign({}, state, {
                admin: action.data,
                isFetching: false,
            })
        default:
            return state;
    }
}

export default update;
