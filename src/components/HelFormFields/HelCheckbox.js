import './HelCheckbox.scss'

import PropTypes from 'prop-types';

import React from 'react'
import Input from 'react-bootstrap/lib/Input.js'

import {connect} from 'react-redux'
import { setData } from '../../actions/editor'

let HelCheckbox = React.createClass({

    contextTypes: {
        intl: PropTypes.object,
        dispatch: PropTypes.func
    },

    propTypes: {
        name: PropTypes.string
    },

    handleCheck: function (event) {
        let newValue = event.target.checked

        if(this.props.name) {
            let obj = {}
            obj[this.props.name] = newValue
            this.context.dispatch(setData(obj))
        }

        if(typeof this.props.onChange === 'function') {
            this.props.onChange(event, newValue)
        }
    },

    getValidationErrors: function() {
        return []
    },

    noValidationErrors: function() {
        return true
    },

    getValue: function() {
        return this.refs.checkbox.getChecked()
    },

    render: function () {
        let { required, label } = this.props

        if(required) {
            if(typeof label === 'string') {
                label += ' *'
            }
            if(typeof label === 'object') {
                label = (<span>{label} *</span>)
            }
        }

        return (
            <Input
                ref="checkbox"
                type="checkbox"
                label={label}
                name={this.props.name}
                groupClassName="hel-checkbox"
                onChange={this.handleCheck}
                checked={this.props.defaultChecked}
                />
        )
    }
});

export default HelCheckbox