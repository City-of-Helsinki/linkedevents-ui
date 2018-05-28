import fetch from 'isomorphic-fetch'
import {login, logout} from 'src/actions/user.js'

export default function(url, settings, user, dispatch) {

    return new Promise((resolve, reject) => {

        let options = settings

        if(user && user.token) {
            options = Object.assign({}, settings, {
                headers: {
                    'Authorization': 'JWT ' + user.token,
                },
            })
        }

        fetch(url, options).then(response => {
            if(response.status === 401 || response.status === 403) {
                // User not valid anymore
                dispatch(logout())
                reject(new Error('User not authenticated'))
            }
            else {
                resolve(response)
            }
        }).catch(error => {
            reject(new Error('Server error'))
        })
    })
}
