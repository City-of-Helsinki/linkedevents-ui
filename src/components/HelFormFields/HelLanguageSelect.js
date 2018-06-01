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
    }

    onChange(e) {
        let checked = _.filter(this.refs, (ref) => (ref.getChecked()))
        let checkedNames = _.map(checked, (checkbox) => (checkbox.props.name) )

        this.props.setLanguages(checkedNames)

        if(typeof this.props.onChange === 'function') {
            this.props.onChange(checkedNames)
        }
    }

    render() {
        let checkboxes = this.props.options.map((item, index) => {
            let checked = this.props.checked && (this.props.checked.indexOf(item.value) > -1)
            return (<Checkbox
                type="checkbox"
                style={{width: 'auto'}}
                groupClassName="hel-checkbox inline"
                ref={index}
                key={index}
                label={<FormattedMessage id={item.label} />}
                name={item.value}
                checked={checked}
                onChange={e => this.onChange(e)}
            />)
        })

        return (
            <div className="col-sm-12 language-selection">
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
