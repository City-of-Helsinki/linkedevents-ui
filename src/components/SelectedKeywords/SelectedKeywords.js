import './SelectedKeywords.scss'

import PropTypes from 'prop-types';
import React from 'react'
import {Chip} from 'material-ui'

const SelectedKeywords = (props) => {
    const {selectedKeywords, onDelete} = props

    return (
        <div className="keyword-chip-container">
            {selectedKeywords.map((keyword, index) => (
                <Chip
                    className="keyword-chip-item"
                    key={`keyword-${index}`}
                    label={keyword.label}
                    onDelete={() => onDelete(keyword)}
                />
            ))}
        </div>
    )
}

SelectedKeywords.defaultProps = {
    selectedKeywords: [],
    onDelete: () => {},
}

SelectedKeywords.propTypes = {
    selectedKeywords: PropTypes.array,
    onDelete: PropTypes.func,
}

export default SelectedKeywords
