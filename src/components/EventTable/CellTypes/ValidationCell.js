import constants from '../../../constants'
import {Warning, ErrorOutline} from 'material-ui-icons'
import PropTypes from 'prop-types'
import React from 'react'
import {TableCell, Tooltip} from 'material-ui'
import {injectIntl} from 'react-intl'
import {doValidations} from '../../../validation/validator'
import getContentLanguages from '../../../utils/language'
import {mapAPIDataToUIFormat} from '../../../utils/formDataMapping'

const {PUBLICATION_STATUS} = constants

const ValidationCell = props => {
    const {event, intl, handleInvalidRow} = props
    const formattedEvent = mapAPIDataToUIFormat(event)
    const validations = doValidations(formattedEvent, getContentLanguages(formattedEvent), PUBLICATION_STATUS.PUBLIC)
    const hasValidationErrors = Object.keys(validations).length > 0

    if (hasValidationErrors) {
        handleInvalidRow(event.id)
    }

    return (
        <TableCell className="validation-cell">
            {hasValidationErrors &&
                <Tooltip title={intl.formatMessage({id: 'event-validation-errors'})}>
                    <ErrorOutline />
                    {/*<Warning />*/}
                </Tooltip>
            }
        </TableCell>
    )
}

ValidationCell.propTypes = {
    intl: PropTypes.object,
    event: PropTypes.object,
    handleInvalidRow: PropTypes.func,
}

export default injectIntl(ValidationCell)
