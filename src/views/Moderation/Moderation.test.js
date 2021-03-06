import configureStore from 'redux-mock-store'
import React from 'react'
import thunk from 'redux-thunk'
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'

import testReduxIntWrapper from '../../../__mocks__/testReduxIntWrapper'
import {mockCurrentTime, resetMockDate} from '../../../__mocks__/testMocks';
import ConnectedModeration, {Moderation} from './Moderation'

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

describe('Moderation Snapshot', () => {
    let store;

    beforeEach(() => {
        mockCurrentTime('2018-11-10T12:00:00z')
    })

    afterEach(() => {
        resetMockDate()
    })

    it('should render view by default', () => {
        const componentProps = {
            confirm: jest.fn(),
            routerPush: jest.fn(),
            setFlashMsg: jest.fn(),
            user: {},
        };
        const wrapper = shallow(<Moderation {...componentProps} />);
        expect(wrapper).toMatchSnapshot();
    })

    it('should render view correctly', () => {
        store = mockStore(initialStore)
        const componentProps = {
            confirm: jest.fn(),
            routerPush: jest.fn(),
            setFlashMsg: jest.fn(),
            user: {},
        };
        const componentToTest = <ConnectedModeration {...componentProps} />
        const wrapper = renderer.create(testReduxIntWrapper(store, componentToTest))

        expect(wrapper).toMatchSnapshot()
    })
})
