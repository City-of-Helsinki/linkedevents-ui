import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Formsy from 'formsy-react'
import TextField from 'material-ui/lib/text-field'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

let HelTextField = React.createClass({
    mixins: [ Formsy.Mixin, PureRenderMixin ],

    propTypes: {
        name: React.PropTypes.string.isRequired,
    },

    handleChange: function handleChange(event) { /*
        if(this.getErrorMessage() != null ){
            this.setValue(event.currentTarget.value)
        }
        else {
            if (this.isValidValue(event.target.value)) {
                this.setValue(event.target.value)
            }

            else {
                this.setState({
                    _value: event.currentTarget.value,
                    _isPristine: false
                })
            }
        }*/

        if(typeof this.props.onChange === 'function') {
            this.props.onChange()
        }
    },

    handleBlur: function handleBlur(event) {
        //this.setValue(event.currentTarget.value)

        let obj = {}
        obj[this.props.name] = event.currentTarget.value

        this.props.dispatch(setData(obj))

        if(typeof this.props.onBlur === 'function') {
            this.props.onBlur()
        }
    },

    handleEnterKeyDown: function handleEnterKeyDown(event) {
        //this.setValue(event.currentTarget.value)
    },

    render: function () {
        let { required, floatingLabelText } = this.props

        if(required) {
            if(typeof floatingLabelText === 'string') {
                floatingLabelText += ' *'
            }
            if(typeof floatingLabelText === 'object') {
                floatingLabelText = (<span>{floatingLabelText} *</span>)
            }
        }

        return (
          <TextField
            {...this.props}
            floatingLabelText={floatingLabelText}
            defaultValue={this.props.value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onEnterKeyDown={this.handleEnterKeyDown}
            errorText={this.getErrorMessage()}
            value={this.getValue()} />
        )
    }
});

export default connect()(HelTextField);
