import React from 'react'
import {TableCell, TableSortLabel} from 'material-ui'
import {Checkbox} from '@material-ui/core'
import PropTypes from 'prop-types'
import constants from '../../../constants'

const {TABLE_COLUMNS} = constants

const TableHeaderCell = ({
    children,
    isActive,
    sortDirection,
    name,
    events,
    tableName,
    invalidRows,
    selectedRows,
    handleRowSelect,
    handleSortChange,
    fetchComplete,
}) => {
    const checked = fetchComplete && invalidRows.length + selectedRows.length === events.length

    return (
        <React.Fragment>
            {name === 'checkbox' &&
            <TableCell className="checkbox">
                <Checkbox
                    color="primary"
                    size="small"
                    checked={checked}
                    onChange={(e, checked) => handleRowSelect(checked, undefined, tableName, true)}
                />
            </TableCell>
            }
            {name === 'validation' &&
                <TableCell className="validation-cell" />
            }
            {name !== 'checkbox' && name !== 'validation' &&
            <TableCell>
                <TableSortLabel
                    active={isActive(name)}
                    className={!fetchComplete ? 'disabled' : ''}
                    direction={sortDirection}
                    onClick={() => handleSortChange(name, tableName)}
                >
                    {children}
                </TableSortLabel>
            </TableCell>
            }

        </React.Fragment>
    )
}

TableHeaderCell.defaultProps = {
    events: [],
    invalidRows: [],
    selectedRows: [],
}

TableHeaderCell.propTypes = {
    children: PropTypes.element,
    isActive: PropTypes.func,
    sortDirection: PropTypes.string,
    name: PropTypes.oneOf(TABLE_COLUMNS),
    tableName: PropTypes.string,
    events: PropTypes.array,
    invalidRows: PropTypes.array,
    selectedRows: PropTypes.array,
    handleRowSelect: PropTypes.func,
    handleSortChange: PropTypes.func,
    fetchComplete: PropTypes.bool,
}

export default TableHeaderCell
