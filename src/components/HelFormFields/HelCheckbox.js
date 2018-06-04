import './HelCheckbox.scss'

import PropTypes from 'prop-types';

import React from 'react'
import {Checkbox} from 'react-bootstrap'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

class HelCheckbox extends React.Component {
    constructor(props) {
        super(props)

        this.handleCheck = this.handleCheck.bind(this)
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
        return this.checkboxRef.value
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
            <Checkbox
                inputRef={ref => this.checkboxRef = ref}
                name={this.props.name}
                className="hel-checkbox"
                onChange={this.handleCheck}
                checked={this.props.defaultChecked}
            >
                {label}
            </Checkbox>
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
    label: PropTypes.object,
    defaultChecked: PropTypes.bool,
}

export default HelCheckbox
