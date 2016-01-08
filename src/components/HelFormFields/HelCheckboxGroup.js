import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Formsy from 'formsy-react'
import Checkbox from 'material-ui/lib/checkbox'
import { FormattedMessage } from 'react-intl'

import _ from 'lodash'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

// NOTE: Not using ES6 classes because of the needed mixins
let HelCheckboxGroup = React.createClass({
    mixins: [ Formsy.Mixin, PureRenderMixin ],

    propTypes: {
        name: React.PropTypes.string.isRequired,
    },

    handleChange: function() {
        let checked = _.filter(this.refs, (ref) => (ref.isChecked()))
        let checkedNames = _.map(checked, (checkbox) => (checkbox.props.value) )

        let obj = {}
        obj[this.props.name] = checkedNames

        this.props.dispatch(setData(obj))
        console.log('handle change')
        if(typeof this.props.onChange === 'function') {
            this.props.onChange(checkedNames)
        }
    },

    render: function() {
        let self = this
        let checkboxes = this.props.options.map((item, index) => (
            <span key={index} className={(this.props.itemClassName || '')}>
                <Checkbox ref={index} onCheck={self.handleChange} name={this.props.name+'.'+item.value} value={item.value} label={<FormattedMessage id={item.value}/>} />
            </span>
        ))

        return (
            <fieldset className="checkbox-group">
                <legend className="col-xs-12">{this.props.groupLabel}</legend>
                {checkboxes}
            </fieldset>
        )
    }
});

export default connect()(HelCheckboxGroup);
