import React from 'react'
import { connect } from 'react-redux'
import {FormattedMessage} from 'react-intl'

import FilterableEventTable from 'src/components/FilterableEventTable'
import EventGrid from 'src/components/EventGrid'
import SearchBar from 'src/components/SearchBar'

import { fetchUserEvents } from 'src/actions/userEvents'
import {login, logout} from 'src/actions/user.js'

class EventListing extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            nextEventsPage: 1
        }
    }
    componentDidMount() {
        this.fetchEvents()
    }
    componentDidUpdate() {
        const { fetchComplete, isFetching } = this.props.events;
        if (fetchComplete || isFetching) {
            return;
        }
        this.fetchEvents()
    }

    fetchEvents() {
        if (this.props.user) {
            this.props.dispatch(fetchUserEvents(this.props.user, 1))
        }
    }

    // <FilterableEventTable events={this.props.events} apiErrorMsg={''} />

    render() {
        // Use material UI table
        // or similar grid
        const { events, user } = this.props;
        const header = <h1><FormattedMessage id="organization-events"/></h1>
        if (!user) {
            return (
                <div className="container">
                    {header}
                    <p>
                    <a style={{cursor: 'pointer'}} onClick={() => this.props.dispatch(login())}>
                      <FormattedMessage id="login" />
                    </a>
                    {" "}<FormattedMessage id="organization-events-prompt" /></p>
                    </div>);
        }
        if (events.isFetching && user) {
            return <h1>{`Fetching events for user ${user.id}`}</h1>
        }
        if (events.fetchComplete) {
            return (
                    <div className="container">
                    <h1><FormattedMessage id="organization-events"/></h1>
                    <p><FormattedMessage id="organization-events-description"/></p>
                    <FilterableEventTable events={events.items} apiErrorMsg={''} />
                    </div>
            )
        }
        return null;
    }
}

export default connect((state) => ({
    events: state.events,
    user: state.user,
    organization: state.organization,
    apiErrorMsg: state.events.apiErrorMsg
}))(EventListing);
