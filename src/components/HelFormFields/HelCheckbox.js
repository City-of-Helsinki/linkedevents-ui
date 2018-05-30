import './HelCheckbox.scss'

import PropTypes from 'prop-types';

import React from 'react'
import Input from 'react-bootstrap/lib/Input.js'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

class HelCheckbox extends React.Component {
    constructor(props) {
        super(props)

        this.handleCheck = this.handleCheck.bind(this)
        this.getValue = this.getValue.bind(this)
    }
    
    handleCheck (event) {
        let newValue = event.target.checked

        if(this.props.name) {
            let obj = {}
            obj[this.props.name] = newValue
            this.context.dispatch(setData(obj))
        }

        if(typeof this.props.onChange === 'function') {
            this.props.onChange(event, newValue)
        }
    }

    getValidationErrors() {
        return []
    }

    noValidationErrors() {
        return true
    }

    getValue() {
        return this.refs.checkbox.getChecked()
    }

    render() {
        let {required, label} = this.props

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
}

HelCheckbox.contextTypes = {
    intl: PropTypes.object,
    dispatch: PropTypes.func,
}

HelCheckbox.propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    label: PropTypes.string,
    defaultChecked: PropTypes.bool,
}

export default HelCheckbox
