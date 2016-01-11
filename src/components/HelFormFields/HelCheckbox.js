import React from 'react'
import Formsy from 'formsy-react'
import Checkbox from 'material-ui/lib/checkbox'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

let HelCheckbox = React.createClass({
    mixins: [ Formsy.Mixin ],

    propTypes: {
        name: React.PropTypes.string.isRequired
    },

    handleCheck: function (event, checked) {
        let obj = {}
        obj[this.props.name] = checked

        this.props.dispatch(setData(obj))

        if(typeof this.props.onCheck === 'function') {
            this.props.onCheck(event, checked)
        }
    },

    shouldComponentUpdate: function(newState, newProps) {
        return false
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

        // Check if this checkbox should be prefilled from local storage
        let defaultChecked = this.props.editor.values[this.props.name]

        return (
          <Checkbox
            defaultChecked={defaultChecked}
            onCheck={this.handleCheck}
            errorText={this.getErrorMessage()}
            label={label}
            {...this.props}
            />
        )
    }
});

export default connect((state) => ({
    editor: state.editor
}))(HelCheckbox)
