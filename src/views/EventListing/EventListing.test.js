import configureStore from 'redux-mock-store'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

import initializeAppSettingsForJest from '../../utils/jestAppSettings'
import testReduxIntWrapper from '../../utils/testReduxIntWrapper'
import EventListing from './index'

// findDOMNode mock is needed because we use React 15 with Material-UI v1. When upgrading to React 16 this mock can be removed.
jest.mock('react-dom', () => ({
  findDOMNode: () => {}
}))

initializeAppSettingsForJest()
const mockStore = configureStore([thunk])
let store

const initialStore = {
  userEvents: {
    isFetching: false,
    fetchComplete: true,
    items: [
      {
        publication_status: 'public',
        created_time: '2018-01-16T12:07:21.701359Z',
        last_modified_time: '2018-01-16T12:07:21.701386Z',
        start_time: '2018-01-31T11:13:00Z',
        end_time: '2018-01-31T12:14:00Z',
        name: {
          fi: 'TestEvent1'
        },
        short_description: {
          fi: 'TestEvent1'
        },
        description: {
          fi: '<p>TestEvent1</p>'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/event/helsinki:afqp5xo7ly/',
      },
      {
        publication_status: 'public',
        created_time: '2018-01-11T13:27:23.840820Z',
        last_modified_time: '2018-01-11T13:27:23.840843Z',
        start_time: '2018-02-02T13:00:00Z',
        end_time: '2018-02-02T14:00:00Z',
        name: {
          fi: 'Pomppu'
        },
        short_description: {
          fi: 'Hypähdys'
        },
        '@id': 'https://api.hel.fi/linkedevents-test/v1/event/helsinki:afqokz2zxm/',
      }
    ],
    error: null,
    sortBy: 'last_modified_time',
    sortOrder: 'desc',
    count: 738,
    paginationPage: 0
  },
  user: {
    id: 'testuser',
    username: 'fooUser',
    provider: 'helsinki'
  },
  events: {
    apiErrorMsg: null,
    isFetching: false,
    fetchComplete: false,
    items: [],
    eventError: null,
    eventsError: null
  },
  app: {
    flashMsg: null,
    confirmAction: null
  }
}

describe('EventListing Snapshot', () => {
  beforeEach(() => {
    store = mockStore(initialStore)
  })

  it('should render view correctly', () => {
    const componentProps = {} // Props which are added to component
    const componentToTest = <EventListing {...componentProps} />
    const renderedValue = renderer.create(testReduxIntWrapper(store, componentToTest)).toJSON()

    expect(renderedValue).toMatchSnapshot()
  })
})
