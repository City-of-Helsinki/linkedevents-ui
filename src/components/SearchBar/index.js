require('!style-loader!css-loader!sass-loader!./index.scss');

import moment from 'moment'
import PropTypes from 'prop-types'

import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'

import HelDatePicker from '../HelFormFields/HelDatePicker'
import {Button, FormControl, ControlLabel} from 'react-bootstrap'

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
        return (
            <form onSubmit={ (e) => this.handleSubmit(e) } className="row search-bar">
                <div className="col-sm-2 time-label">
                    <label>Etsi vain ajalta</label>
                </div>
                <div className="col-xs-8 col-sm-5 col-md-3 start-date">
                    <HelDatePicker
                        ref="date"
                        name="startDate"
                        validations={['isDate']}
                        placeholder="pp.kk.vvvv"
                        onChange={(date, value) => this.handleDateChange('startDate', date, value)}
                        onBlur={() => null}
                    />
                </div>
                <div className="col-xs-8 col-sm-5 col-md-3">
                    <HelDatePicker
                        ref="date"
                        name="endDate"
                        validations={['isDate']}
                        placeholder="pp.kk.vvvv"
                        onChange={(date, value) => this.handleDateChange('endDate', date, value)}
                        onBlur={() => null}
                    />
                </div>
                <div className="col-sm-8 col-xs-12">
                    <div className="text-field">
                        <ControlLabel>
                            Tapahtuman nimi tai paikka
                        </ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="Tapahtuman nimi tai paikka"
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
                        Hae tapahtumia
                    </Button>
                </div>
                <p/>
            </form>
        )
    }
}
SearchBar.propTypes = {
    onFormSubmit: PropTypes.func,
}

export default connect()(SearchBar)
