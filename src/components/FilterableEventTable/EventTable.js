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
    const rows = props.events.map(event => (
        <EventRow event={event} key={event['@id']} />
    ))
    const rowsPerPage = 100
    const rowsCount = props.count
    const paginationPage = props.paginationPage
    
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

    const isActive = name => {
        return props.sortBy === name
    }
    const changeSortOrder = name => {
        props.changeSortOrder(name, props.sortBy, props.sortOrder, props.paginationPage, props.user)
    }

    return (
        <Table className="event-table">
            <TableHead>
                <TableRow>
                    <TableCell key="otsikko">
                        <TableSortLabel
                            active={isActive('name')}
                            direction={props.sortOrder}
                            onClick={() => changeSortOrder('name')}
                        >
                            <FormattedMessage id="event-sort-title"/>
                        </TableSortLabel>
                    </TableCell>
                    <TableCell key="alkaa">
                        <TableSortLabel
                            active={isActive('start_time')}
                            direction={props.sortOrder}
                            onClick={() => changeSortOrder('start_time')}
                        >
                            <FormattedMessage id="event-sort-starttime"/>
                        </TableSortLabel>
                    </TableCell>
                    <TableCell key="päättyy">
                        <TableSortLabel
                            active={isActive('end_time')}
                            direction={props.sortOrder}
                            onClick={() => changeSortOrder('end_time')}
                        >
                            <FormattedMessage id="event-sort-endtime"/>
                        </TableSortLabel>
                    </TableCell>
                    <TableCell key="muokattu">
                        <TableSortLabel
                            active={isActive('last_modified_time')}
                            direction={props.sortOrder}
                            onClick={() => changeSortOrder('last_modified_time')}
                        >
                            <FormattedMessage id="event-sort-last-modified"/></TableSortLabel>
                    </TableCell>
                </TableRow>
            </TableHead>
            
            {/*
                since event will contain sub events, using multiple body helps break down
                the whole table into smaller sub sections with consistent styles
            */}
            {rows.map((row, index) => (
                <TableBody key={props.events[index].id}>{row}</TableBody>
            ))}

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
