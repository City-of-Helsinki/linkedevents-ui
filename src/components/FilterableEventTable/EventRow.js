import React from 'react'
import PropTypes from 'prop-types'
import {TableCell, TableRow} from 'material-ui'
import {FormattedMessage, FormattedDate, FormattedRelative} from 'react-intl'
import {Link} from 'react-router-dom'

import constants from '../../constants'

const EventRow = (props) => {
    let dateFormat = function(timeStr) {
        return timeStr ? <FormattedDate value={timeStr} month="short" day="numeric" year="numeric"/> : ''
    }
    let dateTimeFormat = function(timeStr) {
        return timeStr ? <FormattedRelative value={timeStr} /> : ''
    }

    let e = props.event

    let name = null
    if (e.name ) {
        name = (
            e.name.fi || e.name.en || e.name.sv)
    }
    else if (e.headline) {
        name = e.headline.fi || e.headline.en || e.headline.sv
    }
    else {
        name = '<event>'
    }

    let url = '/event/' + e.id;

    // Add necessary badges
    let nameColumn = null
    let draft = props.event.publication_status === constants.PUBLICATION_STATUS.DRAFT
    // let draftClass = draft ? 'draft-row' : ''
    let draftClass = null
    let cancelled = props.event.event_status === constants.EVENT_STATUS.CANCELLED
    // let cancelledClass = cancelled ? 'cancelled-row' : ''
    let cancelledClass = null
    if (draft) {
        nameColumn = (<TableCell className={draftClass}><span className="badge badge-warning text-uppercase"><FormattedMessage id="draft"/></span> <Link to={url}>{name}</Link></TableCell>)
    } else if (cancelled) {
        nameColumn = (<TableCell className={cancelledClass}><span className="badge badge-danger text-uppercase"><FormattedMessage id="cancelled"/></span> <Link to={url}>{name}</Link></TableCell>)
    } else {
        nameColumn = (<TableCell><Link to={url}>{name}</Link></TableCell>)
    }

    return (
        <TableRow key={e['id']}>
            {nameColumn}
            <TableCell className={draftClass}>{dateFormat(e.start_time)}</TableCell>
            <TableCell className={draftClass}>{dateFormat(e.end_time)}</TableCell>
            <TableCell className={draftClass}>{dateTimeFormat(e.last_modified_time)}</TableCell>
        </TableRow>
    )
}

EventRow.propTypes = {
    event: PropTypes.object,
}

export default EventRow
