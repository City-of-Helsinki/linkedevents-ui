import './index.scss'

import React, {useState} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {FormattedMessage, injectIntl} from 'react-intl'
import {Button, TextField} from '@material-ui/core'
import {Remove} from '@material-ui/icons'
import HelDatePicker from '../HelFormFields/HelDatePicker'
import {HelTheme} from '../../themes/hel/material-ui'

const handleKeyPress = (
    event,
    startDate,
    endDate,
    onFormSubmit,
    setSearchQuery
) => {
    if (event.key === 'Enter') {
        const searchQuery = event.target.value

        onFormSubmit(searchQuery, startDate, endDate)
        setSearchQuery(searchQuery)
    }
}

const SearchBar = ({intl, onFormSubmit}) => {
    const [startDate, setStartDate] = useState(moment())
    const [endDate, setEndDate] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    
    return (
        <div className="search-bar">
            <div className="search-bar--dates">
                <label className="search-bar--label">
                    <FormattedMessage id="pick-time-range" />
                </label>
                <HelDatePicker
                    name="startDate"
                    placeholder={intl.formatMessage({id: 'search-date-placeholder'})}
                    defaultValue={startDate}
                    onClose={(value) => setStartDate(value)}
                    maxDate={endDate ? endDate : undefined}
                />
                <Remove className="search-bar--icon" />
                <HelDatePicker
                    name="endDate"
                    placeholder={intl.formatMessage({id: 'search-date-placeholder'})}
                    defaultValue={endDate}
                    onClose={(value) => setEndDate(value)}
                    minDate={startDate ? startDate : undefined}
                />
            </div>
            <div className="search-bar--input">
                <TextField
                    autoFocus
                    fullWidth
                    variant="outlined"
                    label={intl.formatMessage({id: 'event-name-or-place'})}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, startDate, endDate, onFormSubmit, setSearchQuery)}
                    style={{margin: 0}}
                />
                <Button
                    disabled={searchQuery.length === 0}
                    style={{marginLeft: HelTheme.spacing(2)}}
                    variant="contained"
                    color="primary"
                    onClick={() => onFormSubmit(searchQuery, startDate, endDate)}
                >
                    <FormattedMessage id="search-event-button"/>
                </Button>
            </div>
        </div>
    )
}

SearchBar.propTypes = {
    onFormSubmit: PropTypes.func,
    intl: PropTypes.object,
}

export default injectIntl(SearchBar)
