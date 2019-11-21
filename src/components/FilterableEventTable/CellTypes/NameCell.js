import constants from '../../../constants'
import {getFirstMultiLanguageFieldValue} from '../../../utils/helpers'
import {FormattedMessage} from 'react-intl'
import {KeyboardArrowDown, KeyboardArrowRight} from 'material-ui-icons'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import {TableCell} from 'material-ui'

const NameCell = props => {
    const {event, nestLevel, isSuperEvent, superEventType, hasSubEvents, showSubEvents, toggleSubEvent} = props
    const draft = event.publication_status === constants.PUBLICATION_STATUS.DRAFT
    const cancelled = event.event_status === constants.EVENT_STATUS.CANCELLED
    const indentationStyle = {
        paddingLeft: `${nestLevel * 24}px`,
        fontWeight: nestLevel === 1 && isSuperEvent ? 'bold' : 'normal',
    }

    let name = null

    if (event.name ) {
        name = getFirstMultiLanguageFieldValue(event.name)
    }
    else if (event.headline) {
        name = getFirstMultiLanguageFieldValue(event.headline)
    }
    else {
        name = '<event>'
    }

    const getBadge = type => {
        let badgeType = 'primary'

        switch (type) {
            case 'series':
                badgeType = 'success'
                break
            case 'umbrella':
                badgeType = 'info'
                break
            case 'draft':
                badgeType = 'warning'
                break
            case 'cancelled':
                badgeType = 'danger'
                break
        }

        return (
            <span className={`badge badge-${badgeType} text-uppercase tag-space`}>
                <FormattedMessage id={type} />
            </span>
        )
    }

    return (
        <TableCell style={indentationStyle}>
            {isSuperEvent && hasSubEvents &&
                <span
                    className='sub-event-toggle tag-space'
                    onClick={toggleSubEvent}
                >
                    {showSubEvents ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                </span>
            }
            {isSuperEvent && superEventType === constants.SUPER_EVENT_TYPE_UMBRELLA &&
                getBadge('umbrella')
            }
            {isSuperEvent && superEventType === constants.SUPER_EVENT_TYPE_RECURRING &&
                getBadge('series')
            }
            {draft && getBadge('draft')}
            {cancelled && getBadge('cancelled')}
            <Link to={`/event/${event.id}`}>{name}</Link>
        </TableCell>
    )
}

NameCell.propTypes = {
    event: PropTypes.object,
    nestLevel: PropTypes.number,
    isSuperEvent: PropTypes.bool,
    superEventType: PropTypes.oneOf([
        constants.SUPER_EVENT_TYPE_RECURRING,
        constants.SUPER_EVENT_TYPE_UMBRELLA,
    ]),
    hasSubEvents: PropTypes.bool,
    showSubEvents: PropTypes.bool,
    toggleSubEvent: PropTypes.func,
}

export default NameCell
