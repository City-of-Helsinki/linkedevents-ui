import PropTypes from 'prop-types';
import React from 'react'
import {Chip} from '@material-ui/core'
import {HelTheme} from '../../themes/hel/material-ui'

const containerStyles = {
    margin: HelTheme.spacing(1, 0, 2),
}

const chipStyles = {
    margin: HelTheme.spacing(1, 1, 0, 0),
}

const SelectedKeywords = ({selectedKeywords, onDelete}) => (
    <div
        className="keyword-chip-container"
        style={containerStyles}
    >
        {selectedKeywords.map((keyword, index) => (
            <Chip
                className="keyword-chip-item"
                key={`keyword-${index}`}
                color="primary"
                label={keyword.label}
                style={chipStyles}
                onDelete={() => onDelete(keyword)}
            />
        ))}
    </div>
)

SelectedKeywords.defaultProps = {
    selectedKeywords: [],
    onDelete: () => {},
}

SelectedKeywords.propTypes = {
    selectedKeywords: PropTypes.array,
    onDelete: PropTypes.func,
}

export default SelectedKeywords
