import configureStore from 'redux-mock-store'
import React from 'react'
import thunk from 'redux-thunk'
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'

import testReduxIntWrapper from '../../../__mocks__/testReduxIntWrapper'
import ConnectedEventListing, {EventListing} from './index'
import {mockCurrentTime, resetMockDate} from '../../../__mocks__/testMocks';

const mockStore = configureStore([thunk])
const initialStore = {
    user: {
        id: 'testuser',
        username: 'fooUser',
        provider: 'helsinki',
    },
    app: {
        flashMsg: null,
        confirmAction: null,
    },
}

describe('EventListing Snapshot', () => {
    let store;

    beforeEach(() => {
        mockCurrentTime('2018-11-10T12:00:00z')
    })

    afterEach(() => {
        resetMockDate()
    })

    it('should render view by default', () => {
        const componentProps = {
            login: jest.fn(),
            user: {},
        };
        const wrapper = shallow(<EventListing {...componentProps} />);
        expect(wrapper).toMatchSnapshot();
    })

    it('should render view correctly', () => {
        store = mockStore(initialStore)
        const componentProps = {
            login: jest.fn(),
        } // Props which are added to component
        const wrapper = shallow(testReduxIntWrapper(store, <ConnectedEventListing {...componentProps} />))
        expect(wrapper).toMatchSnapshot()
    })
})
