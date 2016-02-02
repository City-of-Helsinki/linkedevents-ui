require('!style!css!sass!./index.scss');

import moment from 'moment'

import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import Button from 'react-bootstrap/lib/Button.js'
import Input from 'react-bootstrap/lib/Input.js'

class SearchBar extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            searchQuery: '',
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
        ReactDOM.findDOMNode(this.refs.searchQueryInput).getElementsByClassName("form-control")[0].focus()
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
        //var label = this.formatLabel() + ' ';
        return (
            <form onSubmit={ (e) => this.handleSubmit(e) } className="row search-bar">
                <div className="col-xs-6">
                    <Input
                        type="text"
                        placeholder="Tapahtuman nimi tai paikka"
                        label="Tapahtuman nimi tai paikka"
                        onChange={ (e) => this.handleChange(e) }
                        ref="searchQueryInput"
                        groupClassName="text-field"
                        />
                </div>

                <div className="col-xs-3" style={{background: 'white'}}>
                    <div className='time-input'></div>
                </div>

                <div className="col-xs-3">
                    <Button style={{height: '72px'}}
                        className="mui-raised-button"
                        type="submit"
                        primary={true}
                        onClick={ (e) => this.handleSubmit(e) }>
                        Hae tapahtumia
                    </Button>
                </div>
                <p/>
            </form>
        )
    }
}

export default connect()(SearchBar)
