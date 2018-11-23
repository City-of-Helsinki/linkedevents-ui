import configureStore from 'redux-mock-store'
import React from 'react'
import thunk from 'redux-thunk'
import {shallow, mount} from 'enzyme'
import renderer from 'react-test-renderer'

import testReduxIntWrapper from '__mocks__/testReduxIntWrapper'
import Editor from './index'
import {mockUser, mockEditorNewEvent, mockEditorExistingEvent} from '../../../__mocks__/mockData';

const mockStore = configureStore([thunk])
const initialStoreNewEvent = {
    subEvents: {
        isFetching: false,
        fetchComplete: false,
        items: [],
        error: null,
    },
    user: mockUser,
    editor: mockEditorNewEvent,
}
const initialStoreExistingEvent = {
    subEvents: {
        isFetching: false,
        fetchComplete: false,
        items: [],
        error: null,
    },
    user: mockUser,
    editor: mockEditorExistingEvent,
}

/*
    jest snapshot has node as null by default,
    so Component that relies on elementRef will fail tests,
    we mock the node here
*/
const mockNodeForRefInEditor = (element) => {
    return {style: {}};
};

describe('Editor Snapshot', () => {
    let store;
    const options = {
        createNodeMock: mockNodeForRefInEditor,
    };

    it('should render view correctly when new event', () => {
        store = mockStore(initialStoreNewEvent)
        const componentProps = {
            match: {
                params: {
                    action: 'create',
                    eventId: 'new?_k=dn954b',
                },
            },
        } // Props which are added to component
        const componentToTest = <Editor {...componentProps} />
        const wrapper = renderer.create(
            testReduxIntWrapper(store, componentToTest),
            options
        )
        expect(wrapper).toMatchSnapshot()
    })

    it('should render view correctly when editing existing event', () => {
        store = mockStore(initialStoreExistingEvent)
        const componentProps = {
            match: {
                params: {
                    action: 'update',
                    eventId: 'helsinki:afqxukccli',
                },
            },
        } // Props which are added to component
        const componentToTest = <Editor {...componentProps} />
        const wrapper = renderer.create(
            testReduxIntWrapper(store, componentToTest),
            options
        )
        expect(wrapper).toMatchSnapshot()
    })
})
