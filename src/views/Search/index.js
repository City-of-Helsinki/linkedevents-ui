import '!style!css!sass!./index.scss'

import React from 'react'
import { connect } from 'react-redux'
import {FormattedMessage} from 'react-intl'

import FilterableEventTable from 'src/components/FilterableEventTable'
import EventGrid from 'src/components/EventGrid'
import SearchBar from 'src/components/SearchBar'
import Loader from 'react-loader'

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
                <h1><FormattedMessage id="search-events"/></h1>
                <p><FormattedMessage id="search-events-description"/></p>
                <SearchBar onFormSubmit={ (query, start, end) => this.searchEvents(query, start, end) }/>
                <Loader loaded={!this.props.isFetching} scale={3}>
                    <EventGrid events={this.props.events} apiErrorMsg={''} />
                </Loader>
            </div>
        )
    }
}

export default connect((state) => ({
    events: state.events.items,
    isFetching: state.events.isFetching,
    apiErrorMsg: state.events.apiErrorMsg
}))(SearchPage);
