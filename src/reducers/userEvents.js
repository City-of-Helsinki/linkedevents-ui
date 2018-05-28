import constants from '../constants'

// Is fetching checks?
const initialState = {
  isFetching: false,
  fetchComplete: false,
  items: [],
  error: null,
  sortBy: 'last_modified_time',
  sortOrder: 'desc',
  count: null,
  paginationPage: 0,
}

function update(state = initialState, action) {
  if(action.type === constants.REQUEST_USER_EVENTS) {
    return Object.assign({}, state, {
      isFetching: true,
      fetchComplete: false,
      items: [],
      error: null,
    })
  }

  if(action.type === constants.RECEIVE_USER_EVENTS) {
    return Object.assign({}, state, {
      isFetching: false,
      fetchComplete: true,
      items: action.items,
      error: null,
      count: action.count,
    });
  }

  if(action.type === constants.RESET_USER_EVENTS_FETCHING) {
    return Object.assign({}, state, {
      isFetching: false,
      fetchComplete: false,
      items: [],
      error: null,
      count: null,
    });
  }

  if(action.type === constants.RECEIVE_USER_EVENTS_ERROR) {
    return Object.assign({}, state, {
      isFetching: false,
      fetchComplete: false,
      items: [],
      error: action.error,
    });
  }

  if(action.type === constants.SET_USER_EVENTS_SORTORDER) {
    return Object.assign({}, state, {
      sortBy: action.sortBy,
      sortOrder: action.sortOrder,
      paginationPage: action.paginationPage,
    });
  }

  return state
}

export default update
