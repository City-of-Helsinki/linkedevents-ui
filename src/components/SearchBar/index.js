import './index.scss'

import React, {useState} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {FormattedMessage, injectIntl} from 'react-intl'
import {Button, TextField} from '@material-ui/core'
import HelDatePicker from '../HelFormFields/HelDatePicker'

import constants from '../../constants'
import {HelTheme} from '../../themes/hel/material-ui'

const {VALIDATION_RULES} = constants

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
    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    return (
        <form className="row search-bar">
            <div className="col-sm-2 time-label">
                <label>
                    <FormattedMessage id="pick-time-range" />
                </label>
            </div>
            <div className="col-xs-8 col-sm-5 col-md-3 start-date">
                <HelDatePicker
                    name="startDate"
                    defaultValue={startDate}
                    validations={[VALIDATION_RULES.IS_DATE]}
                    placeholder={intl.formatMessage({id: 'search-date-placeholder'})}
                    onChange={(date, value) => setStartDate(value)}
                    onBlur={() => null}
                />
            </div>
            <div className="col-xs-8 col-sm-5 col-md-3">
                <HelDatePicker
                    name="endDate"
                    validations={[VALIDATION_RULES.IS_DATE]}
                    placeholder={intl.formatMessage({id: 'search-date-placeholder'})}
                    onChange={(date, value) => setEndDate(value)}
                    onBlur={() => null}
                />
            </div>
            <div className="col-sm-10 col-xs-12 input-row">
                <TextField
                    autoFocus
                    fullWidth
                    variant="outlined"
                    label={intl.formatMessage({id: 'event-name-or-place'})}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, startDate, endDate, onFormSubmit, setSearchQuery)}
                />
                <Button
                    style={{marginLeft: HelTheme.spacing(2)}}
                    variant="contained"
                    color="primary"
                    onClick={() => onFormSubmit(searchQuery, startDate, endDate)}
                >
                    <FormattedMessage id="search-event-button"/>
                </Button>
            </div>
        </form>
    )
}

SearchBar.propTypes = {
    onFormSubmit: PropTypes.func,
    intl: PropTypes.object,
}

export default injectIntl(SearchBar)
