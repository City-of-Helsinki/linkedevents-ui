import configureStore from 'redux-mock-store'
import React from 'react'
import thunk from 'redux-thunk'
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'

import testReduxIntWrapper from '../../../__mocks__/testReduxIntWrapper'
import ConnectedEventListing, {EventListing} from './index'
import {mockUserEvents} from '__mocks__/mockData';

const mockStore = configureStore([thunk])
const initialStore = {
    subEvents: {
        bySuperEventId: {},
        fetchingFromSuperId: '',
    },
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

    it('should render view by default', () => {
        const componentProps = {
            fetchUserEvents: jest.fn(),
            login: jest.fn(),
            events: {},
            user: {},
        };
        const wrapper = shallow(<EventListing {...componentProps} />);
        expect(wrapper).toMatchSnapshot();
    })

    it('should render view correctly', () => {
        store = mockStore(initialStore)
        const componentProps = {
            fetchUserEvents: jest.fn(),
            login: jest.fn(),
        } // Props which are added to component
        const componentToTest = <ConnectedEventListing {...componentProps} />
        const wrapper = renderer.create(testReduxIntWrapper(store, componentToTest))

        expect(wrapper).toMatchSnapshot()
    })
})
