import PropTypes from 'prop-types';
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Input from 'react-bootstrap/lib/Input'

import _ from 'lodash'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

import ValidationPopover from 'src/components/ValidationPopover'

// NOTE: Not using ES6 classes because of the needed mixins
class HelLabeledCheckboxGroup extends React.Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
    }
    
    handleChange() {
        let checked = _.filter(this.refs, (ref) => (ref.getChecked()))
        let checkedNames = _.map(checked, (checkbox) => (checkbox.props.value) )

        if(this.props.name) {
            let obj = {}
            obj[this.props.name] = checkedNames
            this.context.dispatch(setData(obj))
        }

        if(typeof this.props.onChange === 'function') {
            this.props.onChange(checkedNames)
        }

        if (this.props.setDirtyState) {
            this.props.setDirtyState()
        }
    }

    shouldComponentUpdate(nextProps) {
        if(_.isEqual(nextProps.selectedValues, this.props.selectedValues)) {
            //return false;
        }

        return true;
    }

    render() {
        let self = this
        let checkboxes = this.props.options.map((item, index) => {
            let selectedValues = this.props.selectedValues || []
            let checked = (selectedValues.indexOf(item.value) > -1)

            return (
                <span key={index} className={(this.props.itemClassName || '')}>
                    <Input
                        type="checkbox"
                        groupClassName="hel-checkbox"
                        label={item.label}
                        value={item.value}
                        name={this.props.name + '.' + item.value}
                        ref={index}
                        checked={checked}
                        defaultChecked={checked}
                        onChange={self.handleChange}
                    />
                </span>
            )
        },this)

        // view half-width checkboxes in two columns
        let left_column = checkboxes
        let right_column = []
        if(this.props.itemClassName == 'col-lg-6') {
            left_column = checkboxes.slice(0, Math.floor(checkboxes.length / 2) + 1)
            right_column = checkboxes.slice(Math.floor(checkboxes.length / 2) + 1, checkboxes.length)
        }
        checkboxes = [<div className="left_column" key="1">{left_column}</div>, <div className="right_column" key="2">{right_column}</div>]

        return (
            <fieldset className="checkbox-group col-lg-6">
                <div><span className="legend" style={{position:'relative', width:'auto'}}>{this.props.groupLabel} <ValidationPopover validationErrors={this.props.validationErrors} /></span></div>
                {checkboxes}
            </fieldset>
        )
    }
}

HelLabeledCheckboxGroup.contextTypes = {
    intl: PropTypes.object,
    dispatch: PropTypes.func,
}

HelLabeledCheckboxGroup.propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    setDirtyState: PropTypes.func,
    selectedValues: PropTypes.array,
    options: PropTypes.array,
    itemClassName: PropTypes.string,
    groupLabel: PropTypes.object,
    validationErrors: PropTypes.array,
}

export default HelLabeledCheckboxGroup
