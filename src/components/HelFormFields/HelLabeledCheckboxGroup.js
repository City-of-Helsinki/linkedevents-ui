import './HelLabeledCheckboxGroup.scss'

import PropTypes from 'prop-types';
import React, {useRef} from 'react'
import {Checkbox} from 'react-bootstrap'
import {connect} from 'react-redux'
import {setData as setDataAction} from '../../actions/editor'
import ValidationPopover from '../ValidationPopover'

const HelLabeledCheckboxGroup = (props) => {
    const {options, name, selectedValues, itemClassName, groupLabel, validationErrors} = props
    const refs = useRef({}).current;
    const checkedOptions = selectedValues.map(item => {
        return typeof item === 'object' && Object.keys(item).includes('value')
            ? item.value
            : item
    })

    const handleChange = () => {
        const {options, name, customOnChangeHandler, setDirtyState, setData} = props

        const checkedOptions = options
            .filter((option, index) => refs[`checkRef${index}`].checked)
            .map(checkedOption => checkedOption.value)

        // let the custom handler handle the change if given
        if (typeof customOnChangeHandler === 'function') {
            customOnChangeHandler(checkedOptions)
        // otherwise set data
        } else {
            if (name) {
                setData({[name]: checkedOptions})
            }
        }

        if (setDirtyState) {
            setDirtyState()
        }
    }

    return (
        <fieldset className="checkbox-group col-sm-6">
            <div>
                <span className="legend">
                    {groupLabel}
                    <ValidationPopover validationErrors={validationErrors} />
                </span>
            </div>
            <div className='row'>
                {options.map((item, index) => {
                    const checked = checkedOptions.includes(item.value)

                    return (
                        <span key={`hel-checkbox-${index}`} className={(itemClassName || '')}>
                            <Checkbox
                                className="hel-checkbox"
                                value={item.value}
                                name={`${name}.${item.value}`}
                                inputRef={ref => refs[`checkRef${index}`] = ref}
                                checked={checked}
                                onChange={handleChange}
                            >
                                {item.label}
                            </Checkbox>
                        </span>
                    )
                })}
            </div>
        </fieldset>
    )
}

HelLabeledCheckboxGroup.defaultProps = {
    selectedValues: [],
}

HelLabeledCheckboxGroup.propTypes = {
    name: PropTypes.string,
    customOnChangeHandler: PropTypes.func,
    setData: PropTypes.func,
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

const mapDispatchToProps = (dispatch) => ({
    setData: (value) => dispatch(setDataAction(value)),
})

export default connect(null, mapDispatchToProps)(HelLabeledCheckboxGroup)
