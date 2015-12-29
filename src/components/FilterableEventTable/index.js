import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'

import SearchBar from 'src/components/SearchBar'
import { fetchEvents } from 'src/actions/events.js'

let dateFormat = function(timeStr) {
    return timeStr ? moment(timeStr).format('YYYY-MM-DD') : ''
}

let EventRow = (props) => {
    let e = props.event

    let name = (
        e.name.fi || e.name.en || e.name.sv ||
        e.headline.fi || e.headline.en || e.headline.sv
    )

    let url = "/event/update/" + encodeURIComponent(e['@id'])

    return (
        <tr key={e['@id']}>
            <td><Link to={url}>{name}</Link></td>
            <td>{dateFormat(e.start_time)}</td>
            <td>{dateFormat(e.end_time)}</td>
            <td>{e.publisher}</td>
        </tr>
    )
}

let EventTable = (props) => {

    let rows = props.events.map(function(event) {
        return (<EventRow event={event} key={event.id} />)
    })

    return (
        <table className="table-striped" width="100%">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Start date</th>
                    <th>End date</th>
                    <th>Publisher</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
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
        if (this.props.events.length > 0) {
            results = (
                <div>
                    <hr />
                    <EventTable events={this.props.events} filterText={''} />
                </div>
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
