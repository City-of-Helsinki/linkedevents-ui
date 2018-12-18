import React from 'react'
import PropTypes from 'prop-types'
import {
    TableCell, TableRow, Table, TableHead, TableSortLabel,
    TableBody, TablePagination, TableFooter,
} from 'material-ui'
import {FormattedMessage} from 'react-intl'
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles'

import EventRow from './EventRow'

const EventTable = (props) => {
    let rows = props.events.map(event => (
        <EventRow event={event} key={event['@id']} />
    ))
    let rowsPerPage = 100
    let rowsCount = props.count
    let paginationPage = props.paginationPage
    
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

    return (
        <Table className="event-table">
            <TableHead>
                <TableRow>
                    <TableCell key="otsikko">
                        <TableSortLabel active={props.sortBy === 'name'} direction={props.sortBy === 'name' && props.sortOrder} onClick={() => props.changeSortOrder('name', props.sortBy, props.sortOrder, props.paginationPage, props.user)}><FormattedMessage id="event-sort-title"/></TableSortLabel>
                    </TableCell>
                    <TableCell key="alkaa">
                        <TableSortLabel active={props.sortBy === 'start_time'} direction={props.sortBy === 'start_time' && props.sortOrder} onClick={() => props.changeSortOrder('start_time', props.sortBy, props.sortOrder, props.paginationPage, props.user)}><FormattedMessage id="event-sort-starttime"/></TableSortLabel>
                    </TableCell>
                    <TableCell key="päättyy">
                        <TableSortLabel active={props.sortBy === 'end_time'} direction={props.sortBy === 'end_time' && props.sortOrder} onClick={() => props.changeSortOrder('end_time', props.sortBy, props.sortOrder, props.paginationPage, props.user)}><FormattedMessage id="event-sort-endtime"/></TableSortLabel>
                    </TableCell>
                    <TableCell key="muokattu">
                        <TableSortLabel active={props.sortBy === 'last_modified_time'} direction={props.sortBy === 'last_modified_time' && props.sortOrder} onClick={() => props.changeSortOrder('last_modified_time', props.sortBy, props.sortOrder, props.paginationPage, props.user)}><FormattedMessage id="event-sort-last-modified"/></TableSortLabel>
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
                            onChangePage={(event, newPage) => props.changePaginationPage(props.sortBy, props.sortOrder, newPage, props.user)}
                            labelDisplayedRows={ ({from, to, count}) => {  return `${from}-${to} / ${count}` }  }
                        />
                    </TableRow>
                </TableFooter>
            </MuiThemeProvider>
        </Table>
    )
}

EventTable.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.number,
    changePaginationPage: PropTypes.func,
    sortBy: PropTypes.string,
    paginationPage: PropTypes.number,
    sortOrder: PropTypes.string,
    user: PropTypes.object,
    changeSortOrder: PropTypes.func,
}

export default EventTable
