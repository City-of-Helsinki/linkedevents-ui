import constants from '../../../constants'
import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {Tooltip} from 'material-ui'
import {TableCell} from '@material-ui/core'
import {ErrorOutline, Edit} from '@material-ui/icons'
import {injectIntl} from 'react-intl'
import {doValidations} from '../../../validation/validator'
import getContentLanguages from '../../../utils/language'
import {mapAPIDataToUIFormat} from '../../../utils/formDataMapping'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

const {PUBLICATION_STATUS} = constants

const ValidationCell = ({event, intl, editor, handleInvalidRow, routerPush}) => {
    const [hover, setHover] = useState(false);
    const formattedEvent = mapAPIDataToUIFormat(event)
    // don't validate sub_events as they will be validated separately
    formattedEvent.sub_events = []
    const validations = doValidations(formattedEvent, getContentLanguages(formattedEvent), PUBLICATION_STATUS.PUBLIC, editor.keywordSets)
    const hasValidationErrors = Object.keys(validations).length > 0

    if (hasValidationErrors) {
        handleInvalidRow(event.id)
    }

    return (
        <TableCell className="validation-cell">
            {hasValidationErrors &&
                <Tooltip
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    title={intl.formatMessage({id: 'event-validation-errors'})}
                >
                    <span>
                        {!hover && <ErrorOutline />}
                        {hover && <Edit onClick={() => routerPush(`/event/update/${event.id}`)} />}
                    </span>
                </Tooltip>
            }
        </TableCell>
    )
}

ValidationCell.propTypes = {
    routerPush: PropTypes.func,
    intl: PropTypes.object,
    editor: PropTypes.object,
    event: PropTypes.object,
    handleInvalidRow: PropTypes.func,
}

const mapStateToProps = (state) => ({
    editor: state.editor,
})

const mapDispatchToProps = (dispatch) => ({
    routerPush: (url) => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ValidationCell))
