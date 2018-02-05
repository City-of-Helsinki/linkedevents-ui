import configureStore from 'redux-mock-store'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

import initializeAppSettingsForJest from '../../utils/jestAppSettings'
import testReduxIntWrapper from '../../utils/testReduxIntWrapper'
initializeAppSettingsForJest()
import Search from './index'

// findDOMNode mock is needed because we use React 15 with Material-UI v1. When upgrading to React 16 this mock can be removed.
jest.mock('react-dom', () => ({
  findDOMNode: () => {}
}))

const mockStore = configureStore([thunk])
let store

const initialStore = {
  user: {
    id: '0a423e5a-d34a-11e7-9a41-c2a5d78378ac',
    firstName: '',
    lastName: '',
    username: 'u-bjbd4wwtjii6pgsbyks5pa3yvq',
    emails: [
      {
        value: 'foo@foo.com'
      }
    ],
    provider: 'helsinki',
    _raw: '{"last_login":"2018-01-19T07:33:42.102250Z","username":"u-ajbd4wwtjii6pgsbyks5pa3yvq","email":"foo@foo.com","date_joined":"2017-11-27T08:07:41.123918Z","first_name":"","last_name":"","uuid":"0a423e5a-d34a-11e7-9a41-c2a5d78378ac","department_name":null}',
    _json: {
      last_login: '2018-01-19T07:33:42.102250Z',
      username: 'u-ajbd4wwtjii6pgsbyks5pa3yvq',
      email: 'foo@foo.com',
      date_joined: '2017-11-27T08:07:41.123918Z',
      first_name: '',
      last_name: '',
      uuid: '0a423e5a-d34a-11e7-9a41-c2a5d78378ac',
      department_name: null
    },
    token: 'sometoken',
    organization: 'ahjo:02100'
  },
  events: {
    apiErrorMsg: null,
    isFetching: false,
    fetchComplete: false,
    items: [],
    eventError: null,
    eventsError: null
  }
}

describe('Search Snapshot', () => {
  beforeEach(() => {
    store = mockStore(initialStore)
  })

  it('should render view correctly', () => {
    const componentProps = {
      match: {
        params: {
          action: 'search',
        }
      }
    } // Props which are added to component
    const componentToTest = <Search {...componentProps} />
    const renderedValue = renderer.create(testReduxIntWrapper(store, componentToTest)).toJSON()

    expect(renderedValue).toMatchSnapshot()

  })
})
