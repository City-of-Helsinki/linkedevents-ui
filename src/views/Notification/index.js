import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import Snackbar from 'material-ui/Snackbar'

import {FormattedMessage} from 'react-intl'
import Button from 'react-bootstrap/lib/Button';

import {clearFlashMsg as clearFlashMsgAction} from 'src/actions/app.js'

class Notifications extends React.Component {

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(nextProps, this.props)
    }

    render() {
        const {flashMsg, clearFlashMsg} = this.props
        let flashMsgSpan = (<span/>)
        let isSticky =  flashMsg && flashMsg.sticky

        if(flashMsg && flashMsg.data.response && flashMsg.data.response.status == 400) {
            flashMsgSpan = _.values(_.omit(flashMsg.data, ['apiErrorMsg', 'response'])).join(' ')
            isSticky = true
        }
        else if(flashMsg && flashMsg.msg && flashMsg.msg.length) {
            flashMsgSpan = (<FormattedMessage id={flashMsg.msg} />)
        }

        let duration = isSticky ? null : 7000
        let closeFn = isSticky ? function() {} : () => clearFlashMsg()

        let actionLabel = flashMsg && flashMsg.action && flashMsg.action.label
        let actionFn = flashMsg && flashMsg.action && flashMsg.action.fn

        let actionButton = null
        if (actionLabel && actionFn) {
            actionButton = <Button key="snackActionButton" onClick={actionFn}>{actionLabel}</Button>
        }

        return (
            <Snackbar
                className="notification-bar"
                open={(!!flashMsg)}
                message={flashMsgSpan}
                autoHideDuration={duration}
                onRequestClose={closeFn}
                action={[actionButton]}
            />
        )
    }
}

Notifications.propTypes = {
    flashMsg: PropTypes.object,
    clearFlashMsg: PropTypes.func,
}

const mapDisPatchToProps = (dispatch) => ({
    clearFlashMsg: () => dispatch(clearFlashMsgAction()),
}) 

export default connect(null, mapDisPatchToProps)(Notifications)
