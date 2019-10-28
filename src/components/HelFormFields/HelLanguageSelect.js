// Group of checkboxes that output an array on change

import React from 'react'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'

import {Checkbox} from 'react-bootstrap'

import {connect} from 'react-redux'
import {setLanguages as setLanguageAction} from 'src/actions/editor.js'

class HelLanguageSelect extends React.Component {

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
    }

    onChange() {
        const {options} = this.props
        const checkedOptions = options
            .filter((option, index) => this[`checkRef${index}`].checked)
            .map(checkedOption => checkedOption.value)

        this.props.setLanguages(checkedOptions)

        if (typeof this.props.onChange === 'function') {
            this.props.onChange(checkedOptions)
        }
    }

    render() {
        let checkboxes = this.props.options.map((item, index) => {
            const checkedOptions = this.props.checked;
            let checked = checkedOptions && checkedOptions.includes(item.value)
            let disabled = checked && checkedOptions && checkedOptions.length === 1

            return (<Checkbox
                style={{width: 'auto'}}
                className="hel-checkbox inline"
                inputRef={ref => this[`checkRef${index}`] = ref}
                key={index}
                name={item.value}
                checked={checked}
                disabled={disabled}
                onChange={this.onChange}
            >
                <FormattedMessage id={item.label} />
            </Checkbox>)
        })

        return (
            <div className="language-selection">
                {checkboxes}
            </div>
        )
    }
}

HelLanguageSelect.propTypes = {
    setLanguages: PropTypes.func,
    onChange: PropTypes.func,
    options: PropTypes.array,
    checked: PropTypes.array,
}

const mapDispatchToProps = (dispatch) => ({
    setLanguages: (langs) => dispatch(setLanguageAction(langs)),
})

const mapStateToProps = () => ({})
// TODO: if leave null, react-intl not refresh. Replace this with better React context
export default connect(mapStateToProps, mapDispatchToProps)(HelLanguageSelect)
