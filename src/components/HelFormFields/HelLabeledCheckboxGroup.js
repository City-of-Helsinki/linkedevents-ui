import './HelLabeledCheckboxGroup.scss'

import PropTypes from 'prop-types';
import React, {useRef, useState} from 'react'
import {Button, FormControlLabel, Checkbox, withStyles} from '@material-ui/core'
import {ExpandLess, ExpandMore} from '@material-ui/icons'
import {FormattedMessage} from 'react-intl'
import {connect} from 'react-redux'
import {setData as setDataAction} from '../../actions/editor'
import ValidationPopover from '../ValidationPopover'
import helBrandColors from '../../themes/hel/hel-brand-colors'

const handleChange = (refs, {options, name, customOnChangeHandler, setDirtyState, setData}) => {
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

const ToggleButton = withStyles({
    root: {
        color: helBrandColors.coatBlue.main,
    },
})(Button)

const HelLabeledCheckboxGroup = (props) => {
    const {options, name, defaultOptionAmount, selectedValues, itemClassName, groupLabel, validationErrors} = props
    const [showAll, setShowAll] = useState(false);
    const isToggleShowAllButtonVisible = options.length > defaultOptionAmount;
    const refs = useRef({}).current;
    const labelRef = useRef(null);
    const checkedOptions = selectedValues.map(item => {
        return typeof item === 'object' && Object.keys(item).includes('value')
            ? item.value
            : item
    })
    const filteredOptions = [...options].slice(0, showAll ? -1 : defaultOptionAmount );

    const toggleShowAll = () => {
        setShowAll(!showAll);
    }

    return (
        <React.Fragment>
            <fieldset className="col-sm-6 hel-checkbox-group">
                <legend ref={labelRef}>
                    {groupLabel}
                </legend>
                <div className='row'>
                    {filteredOptions.map((item, index) => {
                        const checked = checkedOptions.includes(item.value)

                        return (
                            <span key={`hel-checkbox-${index}`} className={(itemClassName || '')}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="primary"
                                            value={item.value}
                                            name={`${name}.${item.value}`}
                                            inputRef={ref => refs[`checkRef${index}`] = ref}
                                            checked={checked}
                                            onChange={() => handleChange(refs, props)}
                                        />
                                    }
                                    label={item.label}
                                />
                            </span>
                        )
                    })}
                </div>
                {isToggleShowAllButtonVisible &&
                    <div className="row">
                        <div className="col-sm-12">
                            <ToggleButton 
                                startIcon={showAll ? <ExpandLess /> : <ExpandMore />} 
                                onClick={toggleShowAll}
                            >
                                {<FormattedMessage id={showAll ? 'show-less' : 'show-more'}/>}
                            </ToggleButton>
                        </div>
                    </div>
                }
            </fieldset>
            <ValidationPopover
                anchor={labelRef.current}
                validationErrors={validationErrors}
            />
        </React.Fragment>
    )
}

HelLabeledCheckboxGroup.defaultProps = {
    selectedValues: [],
}

HelLabeledCheckboxGroup.propTypes = {
    defaultOptionAmount: PropTypes.number,
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
