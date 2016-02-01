import './HelCheckbox.scss'

import React from 'react'
import Input from 'react-bootstrap/lib/Input.js'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

let HelCheckbox = React.createClass({

    getInitialState: function() {
        return {
            value: this.props.editor.values[this.props.name] || false,
            originalValue: this.props.editor.values[this.props.name] || false
        }
    },

    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    handleCheck: function (event) {
        let obj = {}
        let newValue = event.target.checked

        obj[this.props.name] = newValue

        this.props.dispatch(setData(obj))

        this.setState({ value: newValue })

        if(typeof this.props.onCheck === 'function') {
            this.props.onCheck(event, newValue)
        }
    },

    shouldComponentUpdate: function(newState, newProps) {
        return false
    },

    getValidationErrors: function() {
        return null;
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
                groupClassName="hel-checkbox"
                onChange={this.handleCheck}
                defaultChecked={this.state.originalValue}
                {...this.props}
                />
        )
    }
});

export default connect((state) => ({
    editor: state.editor
}))(HelCheckbox)
