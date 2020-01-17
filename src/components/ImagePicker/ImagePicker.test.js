import configureStore from 'redux-mock-store'
import React from 'react'
import {shallow} from 'enzyme'
import thunk from 'redux-thunk'

import testReduxIntWrapper from '../../../__mocks__/testReduxIntWrapper'
import ConnectedImagePicker, {ImagePicker} from './index'
import {mockUser, mockEditorExistingEvent, mockImages} from '__mocks__/mockData';

const mockStore = configureStore([thunk]);
const initialStore = {
    user: mockUser,
    editor: mockEditorExistingEvent,
    images: {
        isFetching: false,
        fetchComplete: false,
        items: mockImages,
        selected: {},
    },
};

describe('Image add form', () => {
    let store;

    it('ImagePicker component should render view by default', () => {
        const wrapper = shallow(<ImagePicker />);
        expect(wrapper).toMatchSnapshot()
    })

    it('ImagePicker component should render correctly with data', () => {
        store = mockStore(initialStore);
        const componentProps = {
            dispatch: jest.fn(),
        };
        const wrapper = shallow(testReduxIntWrapper(store, <ConnectedImagePicker {...componentProps} />))
        expect(wrapper).toMatchSnapshot();
    })
})
