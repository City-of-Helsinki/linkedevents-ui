import constants from '../../../constants'
import {getBadge} from '../../../utils/helpers'
import {KeyboardArrowDown, KeyboardArrowRight} from 'material-ui-icons'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import {TableCell} from 'material-ui'
import {getEventName} from '../../../utils/events'

const NameCell = props => {
    const {event, nestLevel, isSuperEvent, superEventType, hasSubEvents, showSubEvents, toggleSubEvent} = props
    const draft = event.publication_status === constants.PUBLICATION_STATUS.DRAFT
    const cancelled = event.event_status === constants.EVENT_STATUS.CANCELLED
    const name = getEventName(event)
    const indentationStyle = {
        paddingLeft: `${nestLevel * 24}px`,
        fontWeight: nestLevel === 1 && isSuperEvent ? 'bold' : 'normal',
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
            {cancelled && getBadge('cancelled')}
            {draft && getBadge('draft')}
            {isSuperEvent && superEventType === constants.SUPER_EVENT_TYPE_UMBRELLA &&
                getBadge('umbrella')
            }
            {isSuperEvent && superEventType === constants.SUPER_EVENT_TYPE_RECURRING &&
                getBadge('series')
            }
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
