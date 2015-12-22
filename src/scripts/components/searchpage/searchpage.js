import moment from 'moment';

// react-specific
import React from 'react';
import RB from 'react-bootstrap';

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

        let url = "/#/event/update/" + encodeURIComponent(e['@id']);

        return (
            <tr key={e['@id']}>
                <td><a href={url}>{name}</a></td>
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


var SearchBar = React.createClass({

    handleChange() {
        return this.props.onUserInput(this.refs.filterTextInput.value);
    },

    handleSubmit(event) {
        event.preventDefault();
        return this.props.onFormSubmit();
    },

    componentDidMount() {
        return this.refs.filterTextInput.focus();
    },

    formatLabel() {
        var start = this.props.startDate.format('YYYY-MM-DD');
        var end = this.props.endDate.format('YYYY-MM-DD');
        if (start === end) {
            return start;
        } else {
            return start + ' - ' + end;
        }
    },

    getRanges() {
        return {
            'Today': [
              moment(),
              moment()
            ],
            'Yesterday': [
              moment().subtract(1, 'days'),
              moment().subtract(1, 'days')
            ],
            'Last 7 Days': [
              moment().subtract(6, 'days'),
              moment()
            ],
            'Last 30 Days': [
              moment().subtract(29, 'days'),
              moment()
            ],
            'This Month': [
              moment().startOf('month'),
              moment().endOf('month')
            ],
            'Last Month': [
              moment().subtract(1, 'month').startOf('month'),
              moment().subtract(1, 'month').endOf('month')
            ]
        };
    },

    render() {
        var label = this.formatLabel() + ' ';
        return (
            <form onSubmit={this.handleSubmit} className="MyForm">
                <input
                    type="text"
                    placeholder="Search..."
                    value={this.props.filterText}
                    ref="filterTextInput"
                    onChange={this.handleChange}
                    className="form-control"
                />
                <input
                    type="submit"
                    value="Hae tapahtumia"
                    onClick={this.handleSubmit}
                    className="applyBtn btn btn-sm btn-primary"
                />
                <p/>
            </form>
        )
    }
});


var FilterableEventTable = React.createClass({

    getInitialState() {
        return {
            filterText: '',
            startDate: moment().startOf('month'),
            endDate: moment().endOf('month'),
            events: [],
            apiErrorMsg: ''
        };
    },

    handleUserInput(filterText) {
        return this.setState({
            filterText: filterText
        });
    },

    handleDateRangePickerEvent(event, picker) {
        if (event.type === 'apply') {
            this.setState({
                startDate: picker.startDate,
                endDate: picker.endDate
            });
            return this.updateTable();
        }
    },

    updateTable() {
        if (!this.state.filterText) {
            return;
        }
        var url = `${appSettings.api_base}/event/?text=${this.state.filterText}`;
        if (this.state.startDate) {
            url += `&start=${this.state.startDate.format('YYYY-MM-DD')}`;
        }
        if (this.state.endDate) {
            url += `&end=${this.state.endDate.format('YYYY-MM-DD')}`;
        }
        return $.getJSON(url, (function(result) {
            return this.setState({
                events: result.data,
                apiErrorMsg: ''
            });
        }
        ).bind(this))
        .error( (function() {
            return this.setState({
                apiErrorMsg: 'Error connecting to server.',
                events: []
            });
        }
        ).bind(this)
        );
    },

    render() {
        let results = null;
        if (this.state.events.length > 0) {
            results = (
                <div>
                    <hr />
                    <EventTable
                        events={this.state.events}
                        filterText={this.state.filterText}
                    />
                </div>
            );
        }

        let err = '';
        let errorStyle = {
            color: 'red !important'
        }
        if (this.state.apiErrorMsg.length > 0) {
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
                    onUserInput={this.handleUserInput}
                    onDateRangePickerEvent={this.handleDateRangePickerEvent}
                    onFormSubmit={this.updateTable}
                />
                {err}
                {results}
            </div>
        );
    }
});


var SearchPage = React.createClass({
    render() {
        return (
            <div>
                <FilterableEventTable events={[]} />
            </div>
        );
    }
});

export default SearchPage;
