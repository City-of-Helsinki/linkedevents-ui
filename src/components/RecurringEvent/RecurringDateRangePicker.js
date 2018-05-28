import PropTypes from 'prop-types';
import React from 'react'
import HelDatePicker from 'src/components/HelFormFields/HelDatePicker.js'
import {FormattedMessage} from 'react-intl'

import validationRules from 'src/validation/validationRules.js';
import ValidationPopover from 'src/components/ValidationPopover'

import moment from 'moment'

class RecurringDateRangePicker extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this)
    this.state = {
      date: this.props.defaultValue,
      name: this.props.name,
    }
  }

  onChange(type, value) {
    this.props.onChange(this.props.name, value)
  }
  onBlur() {
    return
  }
  getValidationErrors(type, value) {
    if(value && type) {
      let validations;
      if(typeof validationRules[type] === 'function') {
        validations =  [{
          rule: type,
          passed: validationRules[type](null, value),
        }]
      }
      validations = validations.filter(i => (i.passed === false))
      if(validations.length) {
        return validations;
      }
    }

    return []
  }

  componentWillReceiveProps(nextProps) {
    if(! _.isEqual(nextProps.defaultValue, this.props.defaultValue)) {
      if (moment(nextProps.defaultValue).isValid()) {
        this.setState({date: moment(nextProps.defaultValue).tz('Europe/Helsinki')})
      }
    }
  }

  render () {
    return (
      <div className="col-sm-6 indented">
        <label style={{position: 'relative'}}><FormattedMessage id={`${this.props.label}`} /> <ValidationPopover validationErrors={this.props.validationErrors} /></label>
        <HelDatePicker ref="date" name={this.props.name} defaultValue={this.state.date} validations={['isDate']} placeholder="pp.kk.vvvv" onChange={this.onChange} onBlur={this.onBlur} label={<FormattedMessage id="date" />} />
      </div>
    )
  }
}
RecurringDateRangePicker.contextTypes = {
  dispatch: PropTypes.func,
};
export default RecurringDateRangePicker
