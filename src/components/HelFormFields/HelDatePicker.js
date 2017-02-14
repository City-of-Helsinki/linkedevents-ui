import React from 'react'
import HelTextField from './HelTextField.js'
import DatePicker from 'react-datepicker/dist/react-datepicker.js'
import 'react-datepicker/dist/react-datepicker.css'
import './HelDatePicker.scss'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

import moment from 'moment'

let HelDatePicker = React.createClass({
    getInitialState: function() {
        return {
            date: this.props.defaultValue
        }
    },

    propTypes: {
        defaultValue: React.PropTypes.object,
        name: React.PropTypes.string.isRequired,
        onBlur: React.PropTypes.func
    },

    componentDidMount: function () {
        this.props.onChange('date', this.state.date)
    },

    handleChange: function (date) {
        if (date._pf.nullInput) {
            this.setState({
              date: undefined
            })
            this.props.onChange('date', undefined)
        } else if (date.isValid()) {
            this.setState({
              date: date
            })
            this.props.onChange('date', date)
        }
    },

    handleBlur: function () {
        if(typeof this.props.onBlur === 'function') {
            this.props.onBlur()
        }
    },
    componentWillReceiveProps(nextProps) {
        if(! _.isEqual(nextProps.defaultValue, this.props.defaultValue)) {
            if (moment(nextProps.defaultValue).isValid()) {
                this.setState({date: nextProps.defaultValue})
            }
        }
    },
    render: function () {
        return (
          <div className='hel-text-field'>
            <DatePicker
                placeholderText='pp.kk.vvvv'
                selected={this.state.date}
                autoOk={true}
                name={this.props.name}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                locale="fi"
            />
          </div>

        )
    }
});

export default connect((state) => ({
    editor: state.editor
}))(HelDatePicker)
