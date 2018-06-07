// Group of checkboxes that output an array on change

import React from 'react'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'

import {Checkbox} from 'react-bootstrap'

import {connect} from 'react-redux'
import {setLanguages as setLanguageAction} from 'src/actions/editor.js'

import _ from 'lodash'

class HelLanguageSelect extends React.Component {

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
    }

    onChange(e) {
        const {options} = this.props

        let checked = options.reduce((ac, op, index) => {
            if(this[`checkRef${index}`].checked) {
                ac.push(this[`checkRef${index}`]) 
            }
            return ac
        }, [])

        let checkedNames = _.map(checked, (checkbox) => (checkbox.name) )
        this.props.setLanguages(checkedNames)

        if(typeof this.props.onChange === 'function') {
            this.props.onChange(checkedNames)
        }
    }

    render() {
        let checkboxes = this.props.options.map((item, index) => {
            let checked = this.props.checked && (this.props.checked.indexOf(item.value) > -1)
            return (<Checkbox
                style={{width: 'auto'}}
                className="hel-checkbox inline"
                inputRef={ref => this[`checkRef${index}`] = ref}
                key={index}
                name={item.value}
                checked={checked}
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

export default connect(null, mapDispatchToProps)(HelLanguageSelect)
