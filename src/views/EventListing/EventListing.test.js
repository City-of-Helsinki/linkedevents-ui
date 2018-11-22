import configureStore from 'redux-mock-store'
import React from 'react'
import thunk from 'redux-thunk'
import {shallow} from 'enzyme'

import testReduxIntWrapper from '../../../__mocks__/testReduxIntWrapper'
import EventListing from './index'
import {mockUserEvents} from '__mocks__/mockData';

const mockStore = configureStore([thunk])
const initialStore = {
    userEvents: {
        isFetching: false,
        fetchComplete: true,
        items: mockUserEvents,
        error: null,
        sortBy: 'last_modified_time',
        sortOrder: 'desc',
        count: 738,
        paginationPage: 0,
    },
    user: {
        id: 'testuser',
        username: 'fooUser',
        provider: 'helsinki',
    },
    events: {
        apiErrorMsg: null,
        isFetching: false,
        fetchComplete: false,
        items: [],
        eventError: null,
        eventsError: null,
    },
    app: {
        flashMsg: null,
        confirmAction: null,
    },
}

describe('EventListing Snapshot', () => {
    let store;

    beforeEach(() => {
        store = mockStore(initialStore)
    })

    it('should render view correctly', () => {
        const componentProps = {} // Props which are added to component
        const componentToTest = <EventListing {...componentProps} />
        const wrapper = shallow(testReduxIntWrapper(store, componentToTest))

        expect(wrapper).toMatchSnapshot()
    })
})
