import React from 'react'

import { connect } from 'react-redux'

import FilterableEventTable from 'src/components/FilterableEventTable'

let SearchPage = (props) => <FilterableEventTable events={props.events} />

export default connect((state) => ({
    events: state.events.items
}))(SearchPage);
