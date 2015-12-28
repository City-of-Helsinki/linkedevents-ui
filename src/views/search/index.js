import moment from 'moment'
import React from 'react'

import { connect } from 'react-redux'

import { fetchEvents } from 'src/actions/events.js'

import FilterableEventTable from 'src/components/FilterableEventTable'

var SearchPage = React.createClass({

    render() {
        return (
            <div>
                <FilterableEventTable events={this.props.events} />
            </div>
        );
    }
});

export default connect((state) => ({
    events: state.events.items
}))(SearchPage);
