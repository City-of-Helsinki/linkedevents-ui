import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment'
import {TableCell} from 'material-ui'

const DateTimeCell = props => {
    const {event, start, end, time, lastModified, datePublished} = props
    let startTime, endTime, lastModifiedTime, datePublishedTime

    const getDate = date => moment(date).format('D.M.YYYY')
    const getDateTime = date => moment(date).format('D.M.YYYY HH:mm')

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
    if (lastModified && event.last_modified_time) {
        lastModifiedTime = time
            ? getDateTime(event.last_modified_time)
            : getDate(event.last_modified_time)
    }
    if (datePublished && event.date_published) {
        datePublishedTime = time
            ? getDateTime(event.date_published)
            : getDate(event.date_published)
    }

    return (
        <TableCell>
            {startTime &&
                <span>{startTime}</span>
            }
            {endTime &&
                <span>{`${startTime ? ' - ' : ''}${endTime}`}</span>
            }
            {lastModifiedTime &&
                <span>{lastModifiedTime}</span>
            }
            {datePublishedTime &&
                <span>{datePublishedTime}</span>
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
