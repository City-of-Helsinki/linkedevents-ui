import React from 'react'
import { connect } from 'react-redux'

class SearchBar extends React.Component {

    constructor(props) {
        super(props)
    }

    handleChange(event) {
        return this.props.onUserInput(event.target.value);
    }

    handleSubmit(event) {
        event.preventDefault();
        return this.props.onFormSubmit();
    }

    componentDidMount() {
        return this.refs.filterTextInput.focus();
    }

    formatLabel() {
        var start = this.props.startDate.format('YYYY-MM-DD');
        var end = this.props.endDate.format('YYYY-MM-DD');
        if (start === end) {
            return start;
        } else {
            return start + ' - ' + end;
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
        };
    }

    render() {
        var label = this.formatLabel() + ' ';
        return (
            <form onSubmit={ (e) => this.handleSubmit(e) } className="MyForm">
                <input
                    type="text"
                    placeholder="Search..."
                    ref="filterTextInput"
                    onChange={ (e) => this.handleChange(e) }
                    className="form-control"
                />
                <input
                    type="submit"
                    value="Hae tapahtumia"
                    onClick={ (e) => this.handleSubmit(e) }
                    className="applyBtn btn btn-sm btn-primary"
                />
                <p/>
            </form>
        )
    }
}

export default connect()(SearchBar);
