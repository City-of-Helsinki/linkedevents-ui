import configureStore from 'redux-mock-store'
import React from 'react'
import thunk from 'redux-thunk'
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'

import testReduxIntWrapper from '__mocks__/testReduxIntWrapper'
import {EditorPage} from './index'
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

describe('Editor Snapshot', () => {
    
    it('should render view correctly when new event', () => {
        const componentProps = {
            match: {
                params: {
                    action: 'create',
                    eventId: 'new?_k=dn954b',
                },
            },
            setEditorAuthFlashMsg: jest.fn(),
            ...initialStoreNewEvent,
        } // Props which are added to component
        const wrapper = shallow(<EditorPage {...componentProps} />)
        expect(wrapper).toMatchSnapshot()
    })

    it('should render view correctly when editing existing event', () => {
        const componentProps = {
            match: {
                params: {
                    action: 'update',
                    eventId: 'helsinki:afqxukccli',
                },
            },
            setEditorAuthFlashMsg: jest.fn(),
            ...initialStoreExistingEvent,
        } // Props which are added to component
        const wrapper = shallow(<EditorPage {...componentProps} />)
        expect(wrapper).toMatchSnapshot()
    })

    it('should render view correctly when creating new event from existing one', () => {
        const componentProps = {
            match: {
                params: {
                    action: 'create',
                    eventId: 'new?_k=dn954b',
                },
            },
            setEditorAuthFlashMsg: jest.fn(),
            ...initialStoreExistingEvent,
        } // Props which are added to component
        const wrapper = shallow(<EditorPage {...componentProps} />)
        expect(wrapper).toMatchSnapshot()
    })
})
