import PropTypes from 'prop-types'
import React from 'react'
import {TableCell} from '@material-ui/core'
import {getDate, getDateTime} from '../../../utils/helpers'

const DateTimeCell = props => {
    const {event, start, end, time, lastModified, datePublished} = props
    let startTime, endTime

    if (start && event.start_time) {
        startTime = time
            ? getDateTime(event.start_time)
            : getDate(event.start_time)
    }
    if (end && event.end_time) {
        endTime = time
            ? getDateTime(event.end_time)
            : getDate(event.end_time)
    }

    return (
        <TableCell>
            {startTime &&
                <span>{startTime}</span>
            }
            {endTime &&
                <span>{`${startTime ? ' - ' : ''}${endTime}`}</span>
            }
            {lastModified && event.last_modified_time &&
                <span>
                    {time
                        ? getDateTime(event.last_modified_time)
                        : getDate(event.last_modified_time)}
                </span>
            }
            {datePublished && event.date_published &&
                <span>
                    {time
                        ? getDateTime(event.date_published)
                        : getDate(event.date_published)}
                </span>
            }
        </TableCell>
    )
}

DateTimeCell.propTypes = {
    event: PropTypes.object,
    start: PropTypes.bool,
    end: PropTypes.bool,
    time: PropTypes.bool,
    lastModified: PropTypes.bool,
    datePublished: PropTypes.bool,
}

export default DateTimeCell
