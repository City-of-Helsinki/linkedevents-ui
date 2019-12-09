/**
 * Returns the sort direction based on given parameters
 * @param oldSortBy         The old column that the table was sorted by
 * @param sortBy            The column that should be sorted
 * @param oldSortDirection  The old sort direction
 * @returns {string}
 */
export const getSortDirection = (oldSortBy, sortBy, oldSortDirection) => {
    let sortDirection = ''

    // Check if sortBy column changed
    if (sortBy !== oldSortBy) {
        sortBy === 'name'
            ? sortDirection = 'asc' // if we clicked "name" column then default sort order is ascending
            : sortDirection = 'desc' // otherwise default sort order for new column is descending
    } else {
        // user clicked the same column by which previously sorted -> change sort order
        oldSortDirection === 'desc'
            ? sortDirection = 'asc'
            : sortDirection = 'desc'
    }

    return sortDirection
}

/**
 * Returns the correct sortBy parameter value.
 * Some of the column types are not event data fields and need to be sorted according to some other value
 * @param columnName
 * @returns {string}
 */
export const getSortColumnName = (columnName) =>
    columnName === 'event_time'
        ? 'start_time'
        : columnName

/**
 * Returns the selected rows based on given parameters
 * @param tableData     Table data
 * @param checked       Whether the row was selected or de-selected
 * @param id            Event ID of the selected row
 * @param table         The table that the row was selected in
 * @param selectAll     Whether all rows should be selected
 * @param invalidRows   Array containing invalid rows that shouldn't be selected
 * @returns {string[]}
 */
export const getSelectedRows = (
    tableData,
    checked,
    id,
    table,
    selectAll = false,
    invalidRows = [],
) => {
    const {events} = tableData
    let {selectedRows} = tableData

    if (selectAll) {
        selectedRows = checked
            ? events.map(event => event.id)
            : []
    } else {
        selectedRows = checked
            ? [...selectedRows, id]
            : selectedRows.filter(existingId => existingId !== id)
    }

    return selectedRows
        .filter(id => !invalidRows.includes(id))
}
