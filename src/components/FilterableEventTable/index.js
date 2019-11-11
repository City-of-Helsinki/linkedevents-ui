import './index.scss'

import PropTypes from 'prop-types';
import React from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl';
import {setUserEventsSortOrder, fetchUserEvents} from '../../actions/userEvents'
import EventTable from './EventTable'

const FilterableEventTable = props => {
    const {events, fetchComplete, apiErrorMsg} = props;
    const hasResults = events.length > 0 || fetchComplete === false

    return (
        <React.Fragment>
            {apiErrorMsg.length > 0 &&
                <span style={{color: '#dc3545'}}>
                    <FormattedMessage id="server-error"/>
                </span>
            }
            {hasResults &&
                <EventTable {...props} />
            }
            {!hasResults &&
                <FormattedMessage id="no-events"/>
            }
        </React.Fragment>
    )
}

FilterableEventTable.propTypes = {
    changeSortOrder: PropTypes.func,
    changePaginationPage: PropTypes.func,
    getNextPage: PropTypes.func,
    events: PropTypes.array,
    fetchComplete: PropTypes.bool,
    sortBy: PropTypes.string,
    sortOrder: PropTypes.string,
    user: PropTypes.object,
    count: PropTypes.number,
    paginationPage: PropTypes.number,
    apiErrorMsg: PropTypes.string,
}

const mapDispatchToProps = (dispatch) => ({
    changeSortOrder: (sortBy, sortByBeforeChange, orderBeforeChange, paginationPage, user) => {
        // sortBy = API field name
        let newOrder = ''

        // Check if sortBy column changed
        if (sortBy !== sortByBeforeChange) {
            // .. yes, sortBy changed
            sortBy === 'name'
                ? newOrder = 'asc' // if we clicked "name" column then default sort order is ascending
                : newOrder = 'desc' //otherwise default sort order for new column is descending
        } else {
            // user clicked the same column by which previously sorted -> change sort order
            orderBeforeChange === 'desc'
                ? newOrder = 'asc'
                : newOrder = 'desc'
        }
        // when sort order is changed, we're going back to first page
        paginationPage = 0

        dispatch(setUserEventsSortOrder(sortBy, newOrder, paginationPage))
        dispatch(fetchUserEvents(user, sortBy, newOrder, paginationPage))
    },
    changePaginationPage: (sortBy, order, paginationPage, user) => {
        dispatch(setUserEventsSortOrder(sortBy, order, paginationPage))
        dispatch(fetchUserEvents(user, sortBy, order, paginationPage))
    },
})

const mapStateToProps = () => ({})
// TODO: if leave null, react-intl not refresh. Replace this with better React context
export default connect(mapStateToProps, mapDispatchToProps)(FilterableEventTable)
