import React from 'react'
import { connect } from 'react-redux'

import moment from 'moment'

import SearchBar from 'src/components/SearchBar'

import { fetchEvents } from 'src/actions/events.js'

import { Link } from 'react-router';

let dateFormat = function(timeStr) {
    if (!timeStr) {
        return '';
    }
    return moment(timeStr).format('YYYY-MM-DD');
};

let EventRow = React.createClass({
    render() {
        let e = this.props.event;
        let name = (
            e.name.fi || e.name.en || e.name.sv ||
            e.headline.fi || e.headline.en || e.headline.sv
        );

        let url = "/event/update/" + encodeURIComponent(e['@id']);

        return (
            <tr key={e['@id']}>
                <td><Link to={url}>{name}</Link></td>
                <td>{dateFormat(e.start_time)}</td>
                <td>{dateFormat(e.end_time)}</td>
                <td>{e.publisher}</td>
            </tr>
        )
    }
});

var EventTable = React.createClass({
    render() {
        var rows = [];
        this.props.events.forEach((function(event) {
            return rows.push(<EventRow event={event} key={event.id} />);
        }
        ).bind(this));

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
});

class FilterableEventTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            startDate: moment().startOf('month'),
            endDate: moment().endOf('month'),
            apiErrorMsg: ''
        }
    }

    handleUserInput(filterText) {
        return this.setState({
            filterText: filterText
        });
    }

    handleDateRangePickerEvent(event, picker) {
        if (event.type === 'apply') {
            this.setState({
                startDate: picker.startDate,
                endDate: picker.endDate
            });
            return this.updateTable();
        }
    }

    updateTable() {
        if (!this.state.filterText) {
            return;
        }
        else {
            this.props.dispatch(fetchEvents(this.state.filterText, this.state.startDate, this.state.endDate));
            return;
        }
    }

    render() {
        let results = null;
        if (this.props.events.length > 0) {
            results = (
                <div>
                    <hr />
                    <EventTable
                        events={this.props.events}
                        filterText={this.state.filterText}
                    />
                </div>
            );
        }

        let err = '';
        let errorStyle = {
            color: 'red !important'
        }
        if (this.props.apiErrorMsg.length > 0) {
            err = (
                <span style={errorStyle}>
                    Error connecting to server.
                </span>
            );
        }

        let paddingStyle = {
            padding: '0em 2em 0.5em 0em'
        }

        return (
            <div style={paddingStyle} >
                <SearchBar
                    filterText={this.state.filterText}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onUserInput={ (text) => this.handleUserInput(text) }
                    onDateRangePickerEvent={ this.handleDateRangePickerEvent }
                    onFormSubmit={ () => this.updateTable() }
                />
                {err}
                {results}
            </div>
        );
    }
}

export default connect()(FilterableEventTable);
