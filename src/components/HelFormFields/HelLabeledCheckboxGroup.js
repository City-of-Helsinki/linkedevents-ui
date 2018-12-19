import PropTypes from 'prop-types';
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Checkbox} from 'react-bootstrap'

import {map, isEqual} from 'lodash'

import {connect} from 'react-redux'
import {setData} from '../../actions/editor'

import ValidationPopover from '../ValidationPopover'

// NOTE: Not using ES6 classes because of the needed mixins
class HelLabeledCheckboxGroup extends React.Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
    }
    
    handleChange() {
        const {options} = this.props

        let checked = options.reduce((ac, op, index) => {
            if(this[`checkRef${index}`].checked) {
                ac.push(this[`checkRef${index}`]) 
            }
            return ac
        }, [])

        let checkedNames = map(checked, (checkbox) => (checkbox.value) )

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
        if(isEqual(nextProps.selectedValues, this.props.selectedValues)) {
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
                    <Checkbox
                        className="hel-checkbox"
                        value={item.value}
                        name={this.props.name + '.' + item.value}
                        inputRef={ref => this[`checkRef${index}`] = ref}
                        checked={checked}
                        onChange={self.handleChange}
                    >{item.label}</Checkbox>
                </span>
            )
        },this)

        // view half-width checkboxes in two columns
        let left_column = checkboxes
        let right_column = []
        if(/col-lg-6/g.test(this.props.itemClassName)) {
            left_column = checkboxes.slice(0, Math.floor((checkboxes.length + 1) / 2))
            right_column = checkboxes.slice(Math.floor((checkboxes.length + 1) / 2), checkboxes.length)
        }
        checkboxes = [
            <div className="left_column col-sm-6" key="1">{left_column}</div>,
            <div className="right_column col-sm-6" key="2">{right_column}</div>,
        ]

        return (
            <fieldset className="checkbox-group col-lg-6">
                <div><span className="legend" style={{position:'relative', width:'auto'}}>{this.props.groupLabel} <ValidationPopover validationErrors={this.props.validationErrors} /></span></div>
                <div className='row'>
                    {checkboxes}
                </div>
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
    validationErrors: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
}

export default HelLabeledCheckboxGroup
