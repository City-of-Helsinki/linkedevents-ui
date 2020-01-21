import React from 'react'
import PropTypes from 'prop-types';
import {FormControlLabel, Checkbox} from '@material-ui/core'
import {setData} from '../../actions/editor'

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
        let {required, label, name, defaultChecked} = this.props

        if(required) {
            if(typeof label === 'string') {
                label += ' *'
            }
            if(typeof label === 'object') {
                label = (<span>{label} *</span>)
            }
        }

        return (
            <FormControlLabel
                control={
                    <Checkbox
                        color="primary"
                        inputRef={ref => this.checkboxRef = ref}
                        name={name}
                        onChange={this.handleCheck}
                        checked={defaultChecked}
                    />
                }
                label={label}
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
    label: PropTypes.object,
    defaultChecked: PropTypes.bool,
}

export default HelCheckbox
