import React from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'

import FilterableEventTable from 'src/components/FilterableEventTable'
import EventGrid from '../../components/EventGrid'
import SearchBar from '../../components/SearchBar'

import {fetchUserEvents as fetchUserEventsAction} from 'src/actions/userEvents'
import {login as loginAction} from 'src/actions/user.js'

export class EventListing extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        this.fetchEvents()
    }
    componentDidUpdate() {
        const {fetchComplete, isFetching} = this.props.events;
        if (fetchComplete || isFetching) {
            return;
        }
        this.fetchEvents()
    }

    fetchEvents() {
        const {user, events: {sortBy, sortOrder, paginationPage}, fetchUserEvents} = this.props
        if (user) {
            fetchUserEvents(user, sortBy, sortOrder, paginationPage)
        }
    }

    // <FilterableEventTable events={this.props.events} apiErrorMsg={''} />

    render() {
    // Use material UI table
    // or similar grid
        const {events, user} = this.props;
        const header = <h1><FormattedMessage id={`${appSettings.ui_mode}-management`}/></h1>
        if (!user) {
            return (
                <div className="container">
                    {header}
                    <p>
                        <a style={{cursor: 'pointer'}} onClick={() => this.props.login()}>
                            <FormattedMessage id="login" />
                        </a>
                        {' '}<FormattedMessage id="events-management-prompt" /></p>
                </div>);
        }

        return (
            <div className="container">
                {header}
                <p><FormattedMessage id="events-management-description"/></p>
                <FilterableEventTable events={events.items} apiErrorMsg={''} sortBy={events.sortBy} sortOrder={events.sortOrder} user={this.props.user} fetchComplete={events.fetchComplete} count={events.count} paginationPage={events.paginationPage}/>
            </div>
        )
    }
}

EventListing.propTypes = {
    events: PropTypes.object,
    fetchUserEvents: PropTypes.func,
    user: PropTypes.object,
    login: PropTypes.func,
}

const mapStateToProps = (state) => ({
    events: state.userEvents,
    user: state.user,
    organization: state.organization,
    apiErrorMsg: state.events.apiErrorMsg,
})

const mapDispatchToProps = (dispatch) => ({
    login: () => dispatch(loginAction()),
    fetchUserEvents: (user, sortBy, sortOrder, paginationPage) => dispatch(fetchUserEventsAction(user, sortBy, sortOrder, paginationPage)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EventListing);
