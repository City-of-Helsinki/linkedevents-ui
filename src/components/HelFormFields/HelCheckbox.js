import './HelCheckbox.scss'

import React from 'react'
import Input from 'react-bootstrap/lib/Input.js'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'
import {injectIntl} from 'react-intl'

let HelCheckbox = React.createClass({

    getInitialState: function() {
        let defaultValue = true
        if(this.props.defaultChecked === false || this.props.defaultChecked === true) {
            defaultValue = this.props.defaultValue
        }
        return {
            value: defaultValue
        }
    },

    propTypes: {
        name: React.PropTypes.string
    },

    handleCheck: function (event) {
        let newValue = event.target.checked
        this.setState({ value: newValue })

        if(this.props.name) {
            let obj = {}
            obj[this.props.name] = newValue
            this.props.dispatch(setData(obj))
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

    componentWillReceiveProps(nextProps) {
        if(!_.isEqual(nextProps.defaultChecked, this.props.defaultChecked)) {
            console.log("will receive props")
            this.setState({value: nextProps.defaultChecked ? true : false})
        }
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
                checked={this.state.value}
                />
        )
    }
});

export default HelCheckbox
