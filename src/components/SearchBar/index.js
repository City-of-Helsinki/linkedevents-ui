require('!style!css!sass!./index.scss');

import moment from 'moment'

import React from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'node_modules/material-ui-with-sass/src/js/raised-button.jsx'
import TextField from 'node_modules/material-ui-with-sass/src/js/text-field.jsx'

class SearchBar extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            searchQuery: '',
            startDate: moment().startOf('month'),
            endDate: moment()
        }
    }

    handleChange(event) {
        this.setState({
            searchQuery: event.target.value
        })
    }

    handleDateRangePickerEvent(event, picker) {
        if (event.type === 'apply') {
            this.setState({
                startDate: picker.startDate,
                endDate: picker.endDate
            })
        }
    }

    handleSubmit(event) {
        event.preventDefault()
        return this.props.onFormSubmit(this.state.searchQuery, this.state.startDate, this.state.endDate)
    }

    componentDidMount() {
        return this.refs.searchQueryInput.focus()
    }

    formatLabel() {
        var start = this.state.startDate.format('YYYY-MM-DD')
        var end = this.state.endDate.format('YYYY-MM-DD')
        if (start === end) {
            return start
        } else {
            return start + ' - ' + end
        }
    }

    getRanges() {
        return {
            'Today': [
              moment(),
              moment()
            ],
            'Yesterday': [
              moment().subtract(1, 'days'),
              moment().subtract(1, 'days')
            ],
            'Last 7 Days': [
              moment().subtract(6, 'days'),
              moment()
            ],
            'Last 30 Days': [
              moment().subtract(29, 'days'),
              moment()
            ],
            'This Month': [
              moment().startOf('month'),
              moment().endOf('month')
            ],
            'Last Month': [
              moment().subtract(1, 'month').startOf('month'),
              moment().subtract(1, 'month').endOf('month')
            ]
        }
    }

    render() {
        var label = this.formatLabel() + ' ';
        return (
            <form onSubmit={ (e) => this.handleSubmit(e) } className="row">
                <TextField
                  floatingLabelText="Tapahtuman nimi tai paikka"
                  onChange={ (e) => this.handleChange(e) }
                  ref="searchQueryInput"
                  className="text-field col-xs-6"
                  style={{width: 'auto'}}
                />

                <RaisedButton
                    type="submit"
                    label="Hae tapahtumia"
                    primary={true}
                    onClick={ (e) => this.handleSubmit(e) }
                />
                <p/>
            </form>
        )
    }
}

export default connect()(SearchBar)
