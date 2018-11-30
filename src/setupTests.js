import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import initializeAppSettingsForJest from './utils/jestAppSettings'

Enzyme.configure({adapter: new Adapter()});

initializeAppSettingsForJest()
