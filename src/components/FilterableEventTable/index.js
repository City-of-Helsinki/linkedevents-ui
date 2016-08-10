require('!style!css!sass!./index.scss');

import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import { sortBy, reverse } from 'lodash'
import { Table, TableHeader, TableBody, TableRow, TableHeaderColumn, TableRowColumn } from 'material-ui'

import SearchBar from 'src/components/SearchBar'
import { fetchEvents } from 'src/actions/events.js'

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

    let draft = props.event.publication_status == "draft"
    let draftClass = draft ? 'draft-row' : ''
    let nameColumn = null
    if (draft) {
        nameColumn = (<TableRowColumn className={draftClass}><div className="d-inline bg-danger draft-label">LUONNOS</div> <Link to={url}>{name}</Link></TableRowColumn>)
    }
    else {
        nameColumn = (<TableRowColumn><Link to={url}>{name}</Link></TableRowColumn>)
    }

    return (
        <TableRow key={e['id']}>
            {nameColumn}
            <TableRowColumn className={draftClass}>{dateFormat(e.start_time)}</TableRowColumn>
            <TableRowColumn className={draftClass}>{dateFormat(e.end_time)}</TableRowColumn>
            <TableRowColumn className={draftClass}>{dateTimeFormat(e.last_modified_time)}</TableRowColumn>
        </TableRow>
    )
}

let EventTable = (props) => {

    let rows = props.events.map(function(event) {
        return (<EventRow event={event} key={event.id} />)
    })

    return (
        <Table selectable={false} multiSelectable={false}>
            <TableHeader enableSelectAll={false} adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                    <TableHeaderColumn>Otsikko</TableHeaderColumn>
                    <TableHeaderColumn>Tapahtuma alkaa</TableHeaderColumn>
                    <TableHeaderColumn>Tapahtuma päättyy</TableHeaderColumn>
                    <TableHeaderColumn>Muokattu viimeksi</TableHeaderColumn>
                </TableRow>
            </TableHeader>
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
