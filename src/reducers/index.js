import user from './user'
import editor from './editor'
import images from './images'
import app from './app'
import userLocale from './userLocale'
import {reducer as oidcReducer} from 'redux-oidc'

export default {
    user: user,
    editor: editor,
    images: images,
    app: app,
    userLocale: userLocale,
    auth: oidcReducer,
}
