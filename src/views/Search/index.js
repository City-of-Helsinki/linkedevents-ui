import './index.scss'

import React from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types';
import ReactPiwik from 'react-piwik';

import FilterableEventTable from '../../components/FilterableEventTable'
import EventGrid from '../../components/EventGrid'
import SearchBar from '../../components/SearchBar'
import Loader from 'react-loader'

import {fetchEvents as fetchEventsAction} from '../../actions/events'


class SearchPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {searchExecuted: false}
    }

    searchEvents(searchQuery, startDate, endDate) {
        if (!searchQuery) {
            return
        }
        else {
            this.props.fetchEvents(searchQuery, startDate, endDate)
            this.setState({searchExecuted: true, searchQuery: searchQuery})
        }
    }

    // <FilterableEventTable events={this.props.events} apiErrorMsg={''} />

    getResults() {

        if (this.state.searchExecuted && !this.props.events.length > 0) {
            // Umm. Why?
            ReactPiwik.push(['trackSiteSearch', this.state.searchQuery, false, this.props.events.length])
            return <div className="search-no-results"><FormattedMessage id="search-no-results"/></div>
        }
        ReactPiwik.push(['trackSiteSearch', this.state.searchQuery, false, this.props.events.length])
        return <EventGrid events={this.props.events} apiErrorMsg={''}/>
    }

    render() {
        return (
            <div className="container">
                <h1><FormattedMessage id={`search-${appSettings.ui_mode}`}/></h1>
                <p><FormattedMessage id="search-events-description"/></p>
                <SearchBar onFormSubmit={ (query, start, end) => this.searchEvents(query, start, end) }/>
                <Loader loaded={!this.props.isFetching} scale={3}>
                    {this.getResults()}
                </Loader>
            </div>
        )
    }
}

SearchPage.propTypes = {
    isFetching: PropTypes.bool,
    fetchEvents: PropTypes.func,
    events: PropTypes.array,
}

const mapStateToProps = (state) => {
    return {
        events: state.events.items,
        isFetching: state.events.isFetching,
        apiErrorMsg: state.events.apiErrorMsg,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchEvents: (searchQuery, startDate, endDate) => dispatch(fetchEventsAction(searchQuery, startDate, endDate)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
