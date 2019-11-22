import React from 'react'
import {Checkbox, TableCell, TableSortLabel} from 'material-ui'
import PropTypes from 'prop-types'

const TableHeaderCell = (props) => {
    const {
        isActive,
        sortDirection,
        name,
        events = [],
        tableName,
        selectedRows = [],
        handleRowSelect,
        handleSortChange,
        fetchComplete,
    } = props

    return (
        <React.Fragment>
            {name === 'checkbox' &&
            <TableCell className="checkbox">
                <Checkbox
                    checked={fetchComplete && selectedRows.length === events.length}
                    onChange={(e, checked) => handleRowSelect(checked, undefined, tableName, true)}
                />
            </TableCell>
            }
            {name !== 'checkbox' &&
            <TableCell>
                <TableSortLabel
                    active={isActive(name)}
                    className={!fetchComplete ? 'disabled' : ''}
                    direction={sortDirection}
                    onClick={() => handleSortChange(name, tableName)}
                >
                    {props.children}
                </TableSortLabel>
            </TableCell>
            }

        </React.Fragment>
    )
}

TableHeaderCell.propTypes = {
    children: PropTypes.element,
    isActive: PropTypes.func,
    sortDirection: PropTypes.string,
    name: PropTypes.oneOf([
        'checkbox',
        'name',
        'publisher',
        'start_time',
        'end_time',
        'last_modified_time',
        'date_published',
        'event_time',
    ]),
    tableName: PropTypes.string,
    events: PropTypes.array,
    selectedRows: PropTypes.array,
    handleRowSelect: PropTypes.func,
    handleSortChange: PropTypes.func,
    fetchComplete: PropTypes.bool,
}

export default TableHeaderCell
