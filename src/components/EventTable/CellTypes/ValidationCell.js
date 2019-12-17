import constants from '../../../constants'
import {ErrorOutline} from 'material-ui-icons'
import PropTypes from 'prop-types'
import React from 'react'
import {TableCell, Tooltip} from 'material-ui'
import {injectIntl} from 'react-intl'
import {doValidations} from '../../../validation/validator'
import getContentLanguages from '../../../utils/language'
import {mapAPIDataToUIFormat} from '../../../utils/formDataMapping'
import {connect} from 'react-redux'

const {PUBLICATION_STATUS} = constants

const ValidationCell = props => {
    const {event, intl, editor, handleInvalidRow} = props
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
                <Tooltip title={intl.formatMessage({id: 'event-validation-errors'})}>
                    <ErrorOutline />
                </Tooltip>
            }
        </TableCell>
    )
}

ValidationCell.propTypes = {
    intl: PropTypes.object,
    editor: PropTypes.object,
    event: PropTypes.object,
    handleInvalidRow: PropTypes.func,
}

const mapStateToProps = (state) => ({
    editor: state.editor,
})

export default connect(mapStateToProps, null)(injectIntl(ValidationCell))
