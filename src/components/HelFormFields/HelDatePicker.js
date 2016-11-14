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
        let defaultValue = this.props.editor.values[this.props.name] || null

        if(defaultValue) {
            defaultValue = moment(defaultValue).tz('Europe/Helsinki').format('D.M.YYYY');
        }

        return {
            value: defaultValue || null,
            startDate: moment()
        }
    },

    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    handleChange: function (date) {
        this.setState({
          startDate: date
        });

    },

    handleBlur: function (event, value) {
        if(typeof this.props.onBlur === 'function') {
            this.props.onBlur(event, value)
        }
    },

    render: function () {
        return (
          <div className='hel-text-field'>

            <DatePicker placeholderText='pp.kk.vvvv' validations={['isDate']} selected={this.state.startDate} name={this.props.name} onChange={this.handleChange} />
          </div>

        )
    }
});

export default connect((state) => ({
    editor: state.editor
}))(HelDatePicker)
