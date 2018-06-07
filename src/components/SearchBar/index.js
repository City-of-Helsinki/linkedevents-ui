require('!style-loader!css-loader!sass-loader!./index.scss');

import moment from 'moment'
import PropTypes from 'prop-types'

import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {FormattedMessage, injectIntl} from 'react-intl'

import HelDatePicker from '../HelFormFields/HelDatePicker'
import {Button, FormControl, ControlLabel} from 'react-bootstrap'

import CONSTANTS from '../../constants'

class SearchBar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            searchQuery: '',
            startDate: moment(),
            endDate: null,
        }
    }

    handleStringChange(event) {
        this.setState({
            searchQuery: event.target.value,
        })
    }

    handleDateChange(type, date, value) {
        this.setState({[type]: value})
    }

    handleSubmit(event) {
        event.preventDefault()
        return this.props.onFormSubmit(this.state.searchQuery, this.state.startDate, this.state.endDate)
    }

    render() {
        const {VALIDATION_RULES} = CONSTANTS
        return (
            <form onSubmit={ (e) => this.handleSubmit(e) } className="row search-bar">
                <div className="col-sm-2 time-label">
                    <label><FormattedMessage id="pick-time-range" /></label>
                </div>
                <div className="col-xs-8 col-sm-5 col-md-3 start-date">
                    <HelDatePicker
                        ref="date"
                        name="startDate"
                        validations={[VALIDATION_RULES.IS_DATE]}
                        placeholder="pp.kk.vvvv"
                        onChange={(date, value) => this.handleDateChange('startDate', date, value)}
                        onBlur={() => null}
                    />
                </div>
                <div className="col-xs-8 col-sm-5 col-md-3">
                    <HelDatePicker
                        ref="date"
                        name="endDate"
                        validations={[VALIDATION_RULES.IS_DATE]}
                        placeholder="pp.kk.vvvv"
                        onChange={(date, value) => this.handleDateChange('endDate', date, value)}
                        onBlur={() => null}
                    />
                </div>
                <div className="col-sm-8 col-xs-12">
                    <div className="text-field">
                        <ControlLabel>
                            <FormattedMessage id="event-name-or-place"/>
                        </ControlLabel>
                        <FormControl
                            type="text"
                            placeholder={this.props.intl.formatMessage({id: 'event-name-or-place'})}
                            onChange={ (e) => this.handleStringChange(e) }
                            ref="searchQueryInput"
                            autoFocus
                        />
                    </div>
                </div>
                <div className="col-sm-4 col-xs-12">
                    <Button style={{height: '72px'}}
                        className="mui-raised-button"
                        type="submit"
                        color="primary"
                        onClick={ (e) => this.handleSubmit(e) }>
                        <FormattedMessage id="search-event-button"/>
                    </Button>
                </div>
                <p/>
            </form>
        )
    }
}
SearchBar.propTypes = {
    onFormSubmit: PropTypes.func,
    intl: PropTypes.object,
}

export default connect()(injectIntl(SearchBar))
