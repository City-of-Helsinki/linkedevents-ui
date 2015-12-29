import React from 'react'

import { connect } from 'react-redux'

import FilterableEventTable from 'src/components/FilterableEventTable'
import EventGrid from 'src/components/EventGrid'
import SearchBar from 'src/components/SearchBar'

import { fetchEvents } from 'src/actions/events'

class SearchPage extends React.Component {
    constructor(props) {
        super(props)
    }

    searchEvents(searchQuery, startDate, endDate) {
        if (!searchQuery) {
            return
        }
        else {
            this.props.dispatch(fetchEvents(searchQuery, startDate, endDate))
        }
    }

    // <FilterableEventTable events={this.props.events} apiErrorMsg={''} />

    render() {
        return (
            <div className="container">

                <h2>Search for an event</h2>
                <SearchBar onFormSubmit={ (query, start, end) => this.searchEvents(query, start, end) }/>

                <h2>Recently added events</h2>
                <EventGrid events={this.props.events} apiErrorMsg={''} />

            </div>
        )
    }
}

export default connect((state) => ({
    events: state.events.items,
    apiErrorMsg: state.events.apiErrorMsg
}))(SearchPage);
