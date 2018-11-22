require('!style-loader!css-loader!sass-loader!./index.scss');

import PropTypes from 'prop-types';
import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import moment from 'moment'
import {sortBy, reverse} from 'lodash'
import {Table, TableHead, TableBody, TableFooter, TableRow, TableCell, TableSortLabel, TablePagination, CircularProgress} from 'material-ui'
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles'
import {FormattedMessage, FormattedTime, FormattedDate, FormattedRelative} from 'react-intl';

import SearchBar from '../SearchBar'
import {fetchEvents} from '../../actions/events'
import {setUserEventsSortOrder, fetchUserEvents} from '../../actions/userEvents'
import constants from '../../constants'

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
        let dateFormat = function(timeStr) {
            return timeStr ? <FormattedDate value={timeStr} month="short" day="numeric" year="numeric"/> : ''
        }
        let dateTimeFormat = function(timeStr) {
            return timeStr ? <FormattedRelative value={timeStr} /> : ''
        }

        let EventRow = (props) => {
            let e = props.event

            let name = null
            if (e.name ) {
                name = (
                    e.name.fi || e.name.en || e.name.sv)
            }
            else if (e.headline) {
                name = e.headline.fi || e.headline.en || e.headline.sv
            }
            else {
                name = '<event>'
            }

            let url = '/event/' + e.id;

            // Add necessary badges
            let nameColumn = null
            let draft = props.event.publication_status === constants.PUBLICATION_STATUS.DRAFT
            // let draftClass = draft ? 'draft-row' : ''
            let draftClass = null
            let cancelled = props.event.event_status === constants.EVENT_STATUS.CANCELLED
            // let cancelledClass = cancelled ? 'cancelled-row' : ''
            let cancelledClass = null
            if (draft) {
                nameColumn = (<TableCell className={draftClass}><span className="label label-warning text-uppercase"><FormattedMessage id="draft"/></span> <Link to={url}>{name}</Link></TableCell>)
            } else if (cancelled) {
                nameColumn = (<TableCell className={cancelledClass}><span className="label label-danger text-uppercase"><FormattedMessage id="cancelled"/></span> <Link to={url}>{name}</Link></TableCell>)
            } else {
                nameColumn = (<TableCell><Link to={url}>{name}</Link></TableCell>)
            }

            return (
                <TableRow key={e['id']}>
                    {nameColumn}
                    <TableCell className={draftClass}>{dateFormat(e.start_time)}</TableCell>
                    <TableCell className={draftClass}>{dateFormat(e.end_time)}</TableCell>
                    <TableCell className={draftClass}>{dateTimeFormat(e.last_modified_time)}</TableCell>
                </TableRow>
            )
        }

        const paginationTheme = createMuiTheme({
            overrides: {
                MuiTypography: {
                    caption: {
                        color: 'black', //color of footer 1-100 / 400 text
                    },
                },
                MuiIconButton: {
                    disabled: {
                        color: 'gray', //color of "< >"" disabled icon buttons
                    },
                    root: {
                        color: 'black', //color of "< >"" icon buttons
                    },
                },
            },
        })

        let EventTable = (props) => {

            let rows = props.events.map(function(event) {
                return (<EventRow event={event} key={event['@id']} />)
            })
            let rowsPerPage = 100
            let rowsCount = props.count
            let paginationPage = props.paginationPage
            console.log(props.sortBy)
            return (
                <Table className="event-table">
                    <TableHead>
                        <TableRow>
                            <TableCell key="otsikko">
                                <TableSortLabel active={props.sortBy === 'name'} direction={props.sortBy === 'name' && props.sortOrder} onClick={() => this.props.changeSortOrder('name', props.sortBy, props.sortOrder, props.paginationPage, props.user)}><FormattedMessage id="event-sort-title"/></TableSortLabel>
                            </TableCell>
                            <TableCell key="alkaa">
                                <TableSortLabel active={props.sortBy === 'start_time'} direction={props.sortBy === 'start_time' && props.sortOrder} onClick={() => this.props.changeSortOrder('start_time', props.sortBy, props.sortOrder, props.paginationPage, props.user)}><FormattedMessage id="event-sort-starttime"/></TableSortLabel>
                            </TableCell>
                            <TableCell key="päättyy">
                                <TableSortLabel active={props.sortBy === 'end_time'} direction={props.sortBy === 'end_time' && props.sortOrder} onClick={() => this.props.changeSortOrder('end_time', props.sortBy, props.sortOrder, props.paginationPage, props.user)}><FormattedMessage id="event-sort-endtime"/></TableSortLabel>
                            </TableCell>
                            <TableCell key="muokattu">
                                <TableSortLabel active={props.sortBy === 'last_modified_time'} direction={props.sortBy === 'last_modified_time' && props.sortOrder} onClick={() => this.props.changeSortOrder('last_modified_time', props.sortBy, props.sortOrder, props.paginationPage, props.user)}><FormattedMessage id="event-sort-last-modified"/></TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{rows}</TableBody>
                    <MuiThemeProvider theme={paginationTheme}>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    count={rowsCount !== null ? rowsCount : 0}
                                    rowsPerPage={rowsPerPage}
                                    rowsPerPageOptions = {[]}
                                    page={paginationPage}
                                    onChangePage={(event, newPage) => this.props.changePaginationPage(props.sortBy, props.sortOrder, newPage, props.user)}
                                    labelDisplayedRows={ ({from, to, count}) => {  return `${from}-${to} / ${count}` }  }
                                />
                            </TableRow>
                        </TableFooter>
                    </MuiThemeProvider>
                </Table>
            )
        }

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
            <div style={{padding: '0em 2em 0.5em 0em'}} >
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
