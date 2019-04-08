import './index.scss'

import PropTypes from 'prop-types';
import React from 'react'
import {connect} from 'react-redux'
import {CircularProgress} from 'material-ui'
import {FormattedMessage} from 'react-intl';

import SearchBar from '../SearchBar'
import {fetchEvents} from '../../actions/events'
import {setUserEventsSortOrder, fetchUserEvents} from '../../actions/userEvents'
import EventTable from './EventTable'

class FilterableEventTable extends React.Component {
    static contextTypes = {
        intl: PropTypes.object,
        dispatch: PropTypes.func,
    };

    constructor(props) {
        super(props)
        this.state = {
            apiErrorMsg: '',
        }
    }

    render() {
        let results = null
        const {getNextPage} = this.props;
        if (this.props.events.length > 0 || this.props.fetchComplete === false) {
            const progressStyle = {
                marginTop: '20px',
                marginLeft: '60px',
            }

            results = (
                <div>
                    <EventTable 
                        events={this.props.events} 
                        getNextPage={getNextPage} 
                        filterText={''} 
                        sortBy={this.props.sortBy} 
                        sortOrder={this.props.sortOrder} 
                        user={this.props.user} 
                        count={this.props.count} 
                        changeSortOrder={this.props.changeSortOrder}
                        changePaginationPage={this.props.changePaginationPage}
                        paginationPage={this.props.paginationPage}
                    />
                    {this.props.fetchComplete === false &&
                        <span><CircularProgress style={progressStyle}/></span>
                    }
                </div>
            )
        } else {
            results = <FormattedMessage id="organization-events-no-results"/>
        }

        let err = ''
        let errorStyle = {
            color: 'red !important',
        }

        if (this.props.apiErrorMsg.length > 0) {
            err = (
                <span style={errorStyle}>
                    <FormattedMessage id="server-error"/>
                </span>
            )
        }

        return (
            <div style={{padding: '0em 0em 0.5em 0em'}} >
                {err}
                {results}
            </div>
        )
    }

}

FilterableEventTable.propTypes = {
    changeSortOrder: PropTypes.func,
    getNextPage: PropTypes.func,
    changePaginationPage: PropTypes.func,
    events: PropTypes.array,
    fetchComplete: PropTypes.bool,
    sortBy: PropTypes.string,
    sortOrder: PropTypes.string,
    user: PropTypes.object,
    count: PropTypes.number,
    paginationPage: PropTypes.number,
    apiErrorMsg: PropTypes.string,
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeSortOrder: (sortBy, sortByBeforeChange, orderBeforeChange, paginationPage, user) => {
            // sortBy = API field name
            let newOrder = ''

            // Check if sortBy column changed
            if (sortBy !== sortByBeforeChange) {
                // .. yes, sortBy changed
                if (sortBy === 'name') { // If we clicked "name" column then default sort order is ascending
                    newOrder = 'asc'
                } else { //otherwise default sort order for new column is descending
                    newOrder = 'desc'
                }
            } else {
                // User clicked the same column by which previously sorted
                // -> change sort order
                if (orderBeforeChange === 'desc') {
                    newOrder = 'asc'
                } else {
                    newOrder = 'desc'
                }
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
    }
}
const mapStateToProps = () => ({})
// TODO: if leave null, react-intl not refresh. Replace this with better React context
export default connect(mapStateToProps, mapDispatchToProps)(FilterableEventTable)
