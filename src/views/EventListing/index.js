import React from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'
import {login as loginAction} from 'src/actions/user.js'
import {fetchEvents} from '../../utils/events'
import {isNull} from 'lodash'
import constants from '../../constants'
import {getSortDirection} from '../../utils/table'
import EventTable from '../../components/EventTable/EventTable'

const {TABLE_DATA_SHAPE, PUBLICATION_STATUS} = constants

export class EventListing extends React.Component {

    state = {
        tableData: {
            events: [],
            count: null,
            paginationPage: 0,
            pageSize: 10,
            fetchComplete: true,
            sortBy: 'last_modified_time',
            sortDirection: 'desc',
        },
    }

    componentDidMount() {
        const {user} = this.props

        if (!isNull(user)) {
            this.fetchTableData()
        }
    }

    // todo: update when user logs in?
    componentDidUpdate(prevProps) {
        const {user} = this.props
        const oldUser = prevProps.user

        // fetch data if user logged in
        if (isNull(oldUser) && user) {
            this.fetchTableData()
        }
    }

    /**
     * Fetches the table data
     */
    fetchTableData = () => {
        const {pageSize, sortBy, sortDirection} = this.state.tableData

        this.setLoading(false)

        fetchEvents(
            'none',
            PUBLICATION_STATUS.PUBLIC,
            undefined,
            undefined,
            pageSize,
            sortBy,
            sortDirection,
        )
            .then(response => {
                this.setState({tableData: {
                    ...this.state.tableData,
                    events: response.data.data,
                    count: response.data.meta.count,
                }})
            })
            .finally(() => this.setLoading(true))
    }

    /**
     * Handles table column sort changes
     * @param columnName    The column that should be sorted
     */
    handleSortChange = (columnName) => {
        const {pageSize, sortBy, sortDirection} = this.state.tableData
        const updatedSortDirection = getSortDirection(sortBy, columnName, sortDirection)

        this.setLoading(false)

        fetchEvents(
            'none',
            PUBLICATION_STATUS.PUBLIC,
            undefined,
            undefined,
            pageSize,
            columnName,
            updatedSortDirection
        )
            .then(response => {
                this.setState({tableData: {
                    ...this.state.tableData,
                    events: response.data.data,
                    count: response.data.meta.count,
                    sortBy: columnName,
                    sortDirection: updatedSortDirection,
                }})
            })
            .finally(() => this.setLoading(true))
    }

    /**
     * Handles table pagination page changes
     * @param event
     * @param newPage   The new page number
     */
    handlePageChange = (event, newPage) => {
        const {pageSize, sortBy, sortDirection} = this.state.tableData

        this.setLoading(false)

        fetchEvents(
            'none',
            PUBLICATION_STATUS.PUBLIC,
            undefined,
            newPage + 1,
            pageSize,
            sortBy,
            sortDirection
        )
            .then(response => {
                this.setState({tableData: {
                    ...this.state.tableData,
                    events: response.data.data,
                    count: response.data.meta.count,
                    paginationPage: newPage,
                }})
            })
            .finally(() => this.setLoading(true))
    }

    /**
     * Handles table page size changes
     * @param   event   Page size selection event data
     */
    handlePageSizeChange = (event) => {
        const {sortBy, sortDirection} = this.state.tableData
        const pageSize = event.target.value

        this.setLoading(false)

        fetchEvents(
            'none',
            PUBLICATION_STATUS.PUBLIC,
            undefined,
            undefined,
            pageSize,
            sortBy,
            sortDirection
        )
            .then(response => {
                this.setState({tableData: {
                    ...this.state.tableData,
                    events: response.data.data,
                    count: response.data.meta.count,
                    paginationPage: 0,
                    pageSize: pageSize,
                }})
            })
            .finally(() => this.setLoading(true))
    }

    /**
     * Sets the loading state
     * @param fetchComplete Whether the fetch has completed
     */
    setLoading = (fetchComplete) => {
        const updatedState = {...this.state}
        updatedState.tableData.fetchComplete = fetchComplete
        this.setState(updatedState)
    }

    render() {
        const {user} = this.props;
        const {events, fetchComplete, count, pageSize, paginationPage, sortBy, sortDirection} = this.state.tableData;
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
                <EventTable
                    events={events}
                    user={user}
                    fetchComplete={fetchComplete}
                    count={count}
                    pageSize={pageSize}
                    paginationPage={paginationPage}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    handlePageChange={this.handlePageChange}
                    handlePageSizeChange={this.handlePageSizeChange}
                    handleSortChange={this.handleSortChange}
                />
            </div>
        )
    }
}

EventListing.propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    tableData: TABLE_DATA_SHAPE,
}

const mapStateToProps = (state) => ({
    user: state.user,
})

const mapDispatchToProps = (dispatch) => ({
    login: () => dispatch(loginAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EventListing);
