import React from 'react'
import HelTextField from './HelTextField.js'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

import { FormattedMessage, injectIntl } from 'react-intl'

import moment from 'moment'

let HelDateTimeField = React.createClass({

    getInitialState: function() {
        let defaultValue = this.props.editor.values[this.props.name] || null

        if(moment(defaultValue).isValid()) {
            defaultValue = moment(defaultValue).tz('Europe/Helsinki');

            return {
                date: defaultValue.format('M.D.YYYY'),
                time: defaultValue.format('H.mm')
            }
        }

        return {
            date: null,
            time: null
        }
    },

    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    handleChange: function (event) {
        // Returns empty list if there are no validation errors
        let errors = [
            this.refs.time.getWrappedInstance().refs.wrappedElement.getValidationErrors(),
            this.refs.date.getWrappedInstance().refs.wrappedElement.getValidationErrors()
        ]

        // Filter out empty lists
        let actualErrors = errors.filter(list => (list.length > 0))

        // If no validation errors, format time
        if(actualErrors.length === 0) {

            let datetime = this.getDateTimeFromFields()

            let obj = {}
            obj[this.props.name] = datetime

            this.props.dispatch(setData(obj))

            if(typeof this.props.onChange === 'function') {
                this.props.onChange(event, value)
            }
        }
        else {
          console.log("errors!");
        }
    },

    getDateTimeFromFields: function() {
        let rawDate = this.refs.date.getWrappedInstance().refs.wrappedElement.getValue();
        let rawTime = this.refs.time.getWrappedInstance().refs.wrappedElement.getValue();

        if(!rawDate && !rawTime) {
            return undefined
        }

        let date = moment.tz(rawDate, 'D.M.YYYY', 'Europe/Helsinki')

        let time = '00:00'

        if(rawTime) {
            time = moment.tz(rawTime, 'H.mm', 'Europe/Helsinki').format('HH:mm')
        }

        let datetime = moment.tz(`${rawDate} ${time}`, 'D.M.YYYY HH:mm', 'Europe/Helsinki').utc().toISOString()

        return datetime;
    },

    handleBlur: function (event, value) {
        if(typeof this.props.onBlur === 'function') {
            this.props.onBlur(event, value)
        }
    },

    render: function () {
        return (
            <div className="multi-field">
                <div className="indented">
                    <label><FormattedMessage id={`${this.props.label}`} /></label>
                    <HelTextField ref="date" defaultValue={this.state.date} validations={['isDate']} placeholder="pp.kk.vvvv" onChange={this.handleChange} label={<FormattedMessage id="date" />} />
                    <HelTextField ref="time" defaultValue={this.state.time} validations={['isTime']} placeholder="hh.mm" onChange={this.handleChange} label={<FormattedMessage id="time" />} />
                </div>
            </div>
        )
    }
});

export default connect((state) => ({
    editor: state.editor
}))(HelDateTimeField)
