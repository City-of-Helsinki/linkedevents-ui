import './HelCheckbox.scss'

import React from 'react'
import Input from 'react-bootstrap/lib/Input.js'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'
import {injectIntl} from 'react-intl'

let HelCheckbox = React.createClass({

    getInitialState: function() {
        let defaultValue = true
        if(this.props.defaultValue === false || this.props.defaultValue === true) {
            defaultValue = this.props.defaultValue
        }
        else if(this.props.name) {
            if(this.props.editor.values[this.props.name] === true || this.props.editor.values[this.props.name] === false) {
                defaultValue = this.props.editor.values[this.props.name]
            }
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

export default connect((state) => ({
    editor: state.editor
}),null,null,{ withRef: true })(injectIntl(HelCheckbox))
