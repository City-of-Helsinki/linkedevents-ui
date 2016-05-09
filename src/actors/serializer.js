
/*
Saves store state to global module for another app
 */

let arg = null;

window.ARG = arg;

export default (store) => {
    const state = _.cloneDeep(_.omit(store.getState(), ['userEvents']));
    state.user.token = null; // JWT token is of not to be saved into Sentry
    window.ARG = state;
}
