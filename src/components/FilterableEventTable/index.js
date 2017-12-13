require('!style-loader!css-loader!sass-loader!./index.scss');

import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import { sortBy, reverse } from 'lodash'
import { Table, TableHead, TableBody, TableRow, TableCell } from 'material-ui'

import SearchBar from 'src/components/SearchBar'
import { fetchEvents } from 'src/actions/events.js'
import constants from 'src/constants'

let dateFormat = function(timeStr) {
    return timeStr ? moment(timeStr).format('ll') : ''
}
let dateTimeFormat = function(timeStr) {
    return timeStr ? moment(timeStr).calendar() : ''
}

let EventRow = (props) => {
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

    let url = "/event/" + e.id;

    // Add necessary badges
    let nameColumn = null
    let draft = props.event.publication_status === constants.PUBLICATION_STATUS.DRAFT
    // let draftClass = draft ? 'draft-row' : ''
    let draftClass = null
    let cancelled = props.event.event_status === constants.EVENT_STATUS.CANCELLED
    // let cancelledClass = cancelled ? 'cancelled-row' : ''
    let cancelledClass = null
    if (draft) {
        nameColumn = (<TableCell className={draftClass}><span className="label label-warning">LUONNOS</span> <Link to={url}>{name}</Link></TableCell>)
    } else if (cancelled) {
        nameColumn = (<TableCell className={cancelledClass}><span className="label label-danger">PERUUTETTU</span> <Link to={url}>{name}</Link></TableCell>)
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

let EventTable = (props) => {

    let rows = props.events.map(function(event) {
        return (<EventRow event={event} key={event.id} />)
    })

    return (
        <Table className="event-table">
            <TableHead>
                <TableRow>
                    <TableCell>Otsikko</TableCell>
                    <TableCell>Tapahtuma alkaa</TableCell>
                    <TableCell>Tapahtuma päättyy</TableCell>
                    <TableCell>Muokattu viimeksi</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
        </Table>
    )
}

class FilterableEventTable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            apiErrorMsg: ''
        }
    }

    render() {
        let results = null
        const { getNextPage } = this.props;
        if (this.props.events.length > 0) {
            results = (
                <div>
                    <EventTable events={this.props.events} getNextPage={getNextPage} filterText={''} />
                </div>
            )
        } else {
            results = (
                <span>
                Yhtäkään muokattavaa tapahtumaa ei löytynyt.
            </span>
            )
        }

        let err = ''
        let errorStyle = {
            color: 'red !important'
        }

        if (this.props.apiErrorMsg.length > 0) {
            err = (
                <span style={errorStyle}>
                    Error connecting to server.
                </span>
            )
        }

        return (
            <div style={{ padding: '0em 2em 0.5em 0em'}} >
                {err}
                {results}
            </div>
        )
    }
}

export default connect()(FilterableEventTable)
