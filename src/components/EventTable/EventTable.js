import './EventTable.scss'
import React from 'react'
import PropTypes from 'prop-types'
import {
    TableCell, TableRow, Table, TableHead,
    TableBody, TablePagination, CircularProgress, TableFooter,
} from 'material-ui'
import {FormattedMessage, injectIntl} from 'react-intl'
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles'
import EventRow from './EventRow'
import TableHeaderCell from './CellTypes/TableHeaderCell'

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

const EventTable = (props) => {
    const {
        intl,
        events = [],
        tableName = '',
        // default columns
        tableColumns = ['name', 'start_time', 'end_time', 'last_modified_time'],
        count,
        selectedRows = [],
        handleRowSelect,
        handleSortChange,
        handlePageChange,
        handlePageSizeChange,
        paginationPage = 0,
        sortBy = 'name',
        sortDirection = 'asc',
        pageSize = 100,
        // default page size options
        pageSizeOptions = [10, 25, 50, 100],
        fetchComplete,
    } = props

    const rows = events.map(event => (
        <EventRow
            key={event['@id']}
            event={event}
            tableName={tableName}
            tableColumns={tableColumns}
            selectedRows={selectedRows}
            handleRowSelect={handleRowSelect}
        />
    ))

    const isActive = name => {
        return sortBy === name
    }

    // only show page size options dropdown if there are more events than the smallest option available
    const showPageSizeOptions = pageSizeOptions.length && pageSizeOptions[0] <= events.length

    const hasResults = events.length > 0 || fetchComplete === false

    if (!hasResults) {
        return (<strong><FormattedMessage id="no-events"/></strong>)
    }

    return (
        <Table className="event-table">
            <TableHead>
                <TableRow>
                    {tableColumns.map(item => (
                        <TableHeaderCell
                            key={item}
                            name={item}
                            tableName={tableName}
                            events={events}
                            isActive={isActive}
                            sortDirection={sortDirection}
                            selectedRows={selectedRows}
                            handleRowSelect={handleRowSelect}
                            handleSortChange={handleSortChange}
                            fetchComplete={fetchComplete}
                        >
                            {item !== 'checkbox'
                                ? <FormattedMessage id={`event-sort-${item}`}/>
                                : <React.Fragment />
                            }
                        </TableHeaderCell>
                    ))}
                </TableRow>
            </TableHead>
            {/*
                since event will contain sub events, using multiple body helps break down
                the whole table into smaller sub sections with consistent styles
            */}
            {fetchComplete === true && rows.map((row, index) => (
                <TableBody key={events[index].id}>{row}</TableBody>
            ))}
            {fetchComplete === false &&
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <CircularProgress style={{margin: '10px 0'}}/>
                        </TableCell>
                    </TableRow>
                </TableBody>
            }
            <MuiThemeProvider theme={paginationTheme}>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            count={count !== null ? count : 0}
                            rowsPerPage={pageSize}
                            rowsPerPageOptions = {showPageSizeOptions ? pageSizeOptions : []}
                            page={paginationPage}
                            onChangePage={(event, newPage) => handlePageChange(event, newPage, tableName)}
                            onChangeRowsPerPage={(event) => handlePageSizeChange(event, tableName)}
                            labelDisplayedRows={({from, to, count}) => `${from}-${to} / ${count}`}
                            labelRowsPerPage={intl.formatMessage({id: 'table-events-per-page'})}
                        />
                    </TableRow>
                </TableFooter>
            </MuiThemeProvider>
        </Table>
    )
}

EventTable.propTypes = {
    intl: PropTypes.object,
    events: PropTypes.array,
    tableName: PropTypes.string,
    tableColumns: PropTypes.arrayOf(
        PropTypes.oneOf([
            'checkbox',
            'name',
            'publisher',
            'start_time',
            'end_time',
            'last_modified_time',
            'date_published',
            'event_time',
        ]),
    ),
    count: PropTypes.number,
    selectedRows: PropTypes.array,
    handleRowSelect: PropTypes.func,
    handleSortChange: PropTypes.func,
    handlePageChange: PropTypes.func,
    handlePageSizeChange: PropTypes.func,
    paginationPage: PropTypes.number,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.string,
    pageSize: PropTypes.number,
    pageSizeOptions: PropTypes.array,
    fetchComplete: PropTypes.bool,
}

export default injectIntl(EventTable)
