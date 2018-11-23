import configureStore from 'redux-mock-store'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

import testReduxIntWrapper from '../../../__mocks__/testReduxIntWrapper'
import Search from './index'
import {mockUser} from '__mocks__/mockData';

const mockStore = configureStore([thunk]);
const initialStore = {
    user: mockUser,
    events: {
        apiErrorMsg: null,
        isFetching: false,
        fetchComplete: false,
        items: [],
        eventError: null,
        eventsError: null,
    },
};

describe('Search Snapshot', () => {
    let store;

    it('should render view correctly', () => {
        const componentProps = {
            match: {
                params: {
                    action: 'search',
                },
            },
        } // Props which are added to component
        store = mockStore(initialStore);
        const componentToTest = <Search {...componentProps} />
        const wrapper = renderer.create(testReduxIntWrapper(store, componentToTest));

        expect(wrapper).toMatchSnapshot()

    })
})
