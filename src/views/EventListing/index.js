import './index.scss'
import React from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types'
import {login as loginAction} from 'src/actions/user.js'
import {EventQueryParams, fetchEvents} from '../../utils/events'
import {isNull, get, filter} from 'lodash'
import constants from '../../constants'
import {getSortDirection} from '../../utils/table'
import EventTable from '../../components/EventTable/EventTable'
import {getOrganizationMembershipIds} from '../../utils/user'

import {Label, Input} from 'reactstrap';

const {USER_TYPE, TABLE_DATA_SHAPE, PUBLICATION_STATUS} = constants


export class EventListing extends React.Component {

    state = {
        showCreatedByUser: false,
        showContentLanguage: '',
        tableData: {
            events: [],
            count: null,
            paginationPage: 0,
            pageSize: 25,
            fetchComplete: true,
            sortBy: 'last_modified_time',
            sortDirection: 'desc',
        },
    }

    componentDidMount() {
        const {user} = this.props

        if (!isNull(user) && !isNull(getOrganizationMembershipIds(user))) {
            this.fetchTableData()
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {user} = this.props
        const oldUser = prevProps.user

        // fetch data if user logged in
        if (isNull(oldUser) && user && !isNull(getOrganizationMembershipIds(user))) {
            this.fetchTableData()
        }
        if (prevState.showContentLanguage !== this.state.showContentLanguage) {
            this.fetchTableData()
        }
    }

    /**
     * Fetches the table data
     */
    fetchTableData = async () => {
        const queryParams = this.getDefaultEventQueryParams()

        this.setLoading(false)

        try {
            const response = await fetchEvents(queryParams)

            this.setState(state => ({
                tableData: {
                    ...state.tableData,
                    events: response.data.data,
                    count: response.data.meta.count,
                },
            }))
        } finally {
            this.setLoading(true)
        }
    }

    /**
     * Handles table column sort changes
     * @param columnName    The column that should be sorted
     */
    handleSortChange = async (columnName) => {
        const {sortBy, sortDirection} = this.state.tableData
        const updatedSortDirection = getSortDirection(sortBy, columnName, sortDirection)
        const queryParams = this.getDefaultEventQueryParams()
        queryParams.setSort(columnName, updatedSortDirection)

        this.setLoading(false)

        try {
            const response = await fetchEvents(queryParams)

            this.setState(state => ({
                tableData: {
                    ...state.tableData,
                    events: response.data.data,
                    count: response.data.meta.count,
                    paginationPage: 0,
                    sortBy: columnName,
                    sortDirection: updatedSortDirection,
                },
            }))
        } finally {
            this.setLoading(true)
        }
    }

    /**
     * Handles table pagination page changes
     * @param event
     * @param newPage   The new page number
     */
    handlePageChange = async (event, newPage) => {
        const queryParams = this.getDefaultEventQueryParams()
        queryParams.page = newPage + 1

        this.setLoading(false)

        try {
            const response = await fetchEvents(queryParams)

            this.setState(state => ({
                tableData: {
                    ...state.tableData,
                    events: response.data.data,
                    count: response.data.meta.count,
                    paginationPage: newPage,
                },
            }))
        } finally {
            this.setLoading(true)
        }
    }

    /**
     * Handles table page size changes
     * @param   event   Page size selection event data
     */
    handlePageSizeChange = async (event) => {
        const pageSize = event.target.value
        const queryParams = this.getDefaultEventQueryParams()
        queryParams.page_size = pageSize

        this.setLoading(false)

        try {
            const response = await fetchEvents(queryParams)

            this.setState(state => ({
                tableData: {
                    ...state.tableData,
                    events: response.data.data,
                    count: response.data.meta.count,
                    paginationPage: 0,
                    pageSize: pageSize,
                },
            }))
        } finally {
            this.setLoading(true)
        }
    }


    /**
     * Toggles whether only events created by the user should be show
     * @param   event   onChange event
     */
    toggleUserEvents = (event) => {
        const showCreatedByUser = event.target.checked
        this.setState({showCreatedByUser}, this.fetchTableData)
    }

    /**
     * Toggles whether events based on language should be shown
     * @param event 
     */
    toggleEventLanguages = (event) => {
        const contentLanguage = event.target.value === 'all' ? '' : event.target.value;
        this.setState(state => ({
            showContentLanguage: contentLanguage,
            tableData: {
                ...state.tableData,
                paginationPage: 0,
            },
        }));
    }

    /**
     * Sets the loading state
     * @param fetchComplete Whether the fetch has completed
     */
    setLoading = (fetchComplete) => {
        this.setState(state => ({
            tableData: {
                ...state.tableData,
                fetchComplete,
            },
        }))
    }

    getPublicationStatus = () => {
        const {user} = this.props

        if (!user.userType) {
            return null
        }
        if (user.userType === USER_TYPE.ADMIN) {
            return PUBLICATION_STATUS.PUBLIC
        }
        if (user.userType === USER_TYPE.REGULAR) {
            return null
        }
    }

    /**
     * Return the default query params to use when fetching event data
     * @returns {EventQueryParams}
     */
    getDefaultEventQueryParams = () => {
        const {user} = this.props
        const {showCreatedByUser, tableData: {sortBy, sortDirection, pageSize}} = this.state
        const userType = get(user, 'userType')
        const publisher = userType === USER_TYPE.ADMIN && !showCreatedByUser
            ? getOrganizationMembershipIds(user)
            : null
        const useCreatedBy = userType === USER_TYPE.REGULAR || showCreatedByUser

        const queryParams = new EventQueryParams()
        queryParams.super_event = 'none'
        queryParams.publication_status = this.getPublicationStatus()
        queryParams.setPublisher(publisher)
        queryParams.page_size = pageSize
        queryParams.setSort(sortBy, sortDirection)
        queryParams.show_all = userType === USER_TYPE.REGULAR ? true : null
        queryParams.admin_user = userType === USER_TYPE.ADMIN ? true : null
        queryParams.created_by = useCreatedBy ? 'me' : null
        if (this.state.showContentLanguage) {
            queryParams.language = this.state.showContentLanguage
        }
        return queryParams
    }
    
    render() {
        const {user} = this.props;
        const {
            showCreatedByUser,
            tableData: {
                events,
                fetchComplete,
                count,
                pageSize,
                paginationPage,
                sortBy,
                sortDirection,
            },
        } = this.state;
        const header = <h1><FormattedMessage id={`${appSettings.ui_mode}-management`}/></h1>
        const isRegularUser = get(user, 'userType') === USER_TYPE.REGULAR

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
                <p>
                    {isRegularUser
                        ? <FormattedMessage id="events-management-description-regular-user"/>
                        : <FormattedMessage id="events-management-description"/>
                    }
                </p>
                {!isRegularUser &&
                <div className='row event-settings'>
                    <div className='col-sm-6'>
                        <div className='user-events-toggle'>
                            <Input
                                id='user-events-toggle'
                                type='checkbox'
                                color="primary"
                                onChange={this.toggleUserEvents}
                                checked={showCreatedByUser}
                            />
                            <Label htmlFor='user-events-toggle'>
                                {<FormattedMessage id={'user-events-toggle'} />}</Label>
                        </div>
                    </div>
                    <div className='col-sm-6 radios'>
                        <div className='row'>
                            <Label><FormattedMessage id='filter-event-languages'/></Label>
                        </div>
                        <div className='row'>
                            <div className='col-sm-12'>
                                <Label>
                                    <FormattedMessage id='filter-event-all'/>
                                    <Input
                                        name='radiogroup'
                                        type='radio'
                                        value='all'
                                        onChange={this.toggleEventLanguages}
                                        defaultChecked
                                    />
                                </Label>
                                <Label>
                                    <div className='filter-desktop'><FormattedMessage id='filter-event-fi'/></div>
                                    <div className='filter-mobile'><FormattedMessage id='filter-event-fi-mobile'/></div>
                                    <Input
                                        name='radiogroup'
                                        type='radio'
                                        value='fi'
                                        onChange={this.toggleEventLanguages}
                                    />
                                </Label>
                                <Label>
                                    <div className='filter-desktop'><FormattedMessage id='filter-event-sv'/></div>
                                    <div className='filter-mobile'><FormattedMessage id='filter-event-sv-mobile'/></div>
                                    <Input
                                        name='radiogroup'
                                        type='radio'
                                        value='sv'
                                        onChange={this.toggleEventLanguages}
                                    />
                                </Label>
                                <Label>
                                    <div className='filter-desktop'><FormattedMessage id='filter-event-en'/></div>
                                    <div className='filter-mobile'><FormattedMessage id='filter-event-en-mobile'/></div>
                                    <Input
                                        name='radiogroup'
                                        type='radio'
                                        value='en'
                                        onChange={this.toggleEventLanguages}
                                    />
                                </Label>
                            </div>
                        </div>
                    </div>
                </div>
                }
                <EventTable
                    events={events}
                    user={user}
                    fetchComplete={fetchComplete}
                    count={count}
                    pageSize={parseInt(pageSize)}
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
    showCreatedByUser: PropTypes.bool,
    tableData: TABLE_DATA_SHAPE,
}

const mapStateToProps = (state) => ({
    user: state.user,
})

const mapDispatchToProps = (dispatch) => ({
    login: () => dispatch(loginAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EventListing);
