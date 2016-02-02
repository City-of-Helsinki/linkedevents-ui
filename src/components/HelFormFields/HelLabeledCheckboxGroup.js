import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Input from 'react-bootstrap/lib/Input'

import _ from 'lodash'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

// NOTE: Not using ES6 classes because of the needed mixins
let HelLabeledCheckboxGroup = React.createClass({
    mixins: [ PureRenderMixin ],

    propTypes: {
        name: React.PropTypes.string.isRequired,
    },

    handleChange: function() {
        let checked = _.filter(this.refs, (ref) => (ref.getChecked()))
        let checkedNames = _.map(checked, (checkbox) => (checkbox.props.value) )

        let obj = {}
        obj[this.props.name] = checkedNames

        console.log(checkedNames)

        this.props.dispatch(setData(obj))

        if(typeof this.props.onChange === 'function') {
            this.props.onChange(checkedNames)
        }
    },

    render: function() {
        let self = this
        let checkboxes = this.props.options.map((item, index) => {
            let checked = this.props.editor.values[this.props.name] && (this.props.editor.values[this.props.name].indexOf(item.value) > -1)

            return (
                <span key={index} className={(this.props.itemClassName || '')}>
                    <Input type="checkbox" groupClassName="hel-checkbox" defaultChecked={checked} ref={index} onChange={self.handleChange} name={this.props.name+'.'+item.value} value={item.value} label={item.label} />
                </span>
            )
        })

        return (
            <fieldset className="checkbox-group">
                <legend className="col-sm-12">{this.props.groupLabel}</legend>
                {checkboxes}
            </fieldset>
        )
    }
});

export default connect((state) => ({
    editor: state.editor
}))(HelLabeledCheckboxGroup);
