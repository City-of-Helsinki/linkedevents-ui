// Group of checkboxes that output an array on change

import React from 'react'
import { FormattedMessage } from 'react-intl'

//import {Checkbox} from 'material-ui'
import Checkbox from 'node_modules/material-ui-with-sass/src/js/checkbox.jsx'

import _ from 'lodash'

class CheckboxGroup extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            checked: []
        }
    }

    onChange() {
        let checked = _.filter(this.refs, (ref) => (ref.isChecked()))
        let checkedNames = _.map(checked, (checkbox) => (checkbox.props.name) )

        this.setState({
            checked: checkedNames
        })

        if(typeof this.props.onChange === 'function') {
            this.props.onChange(checkedNames)
        }
    }

    render() {
        let checkboxes = this.props.options.map((item, index) => {
            let checked = (this.props.defaultSelected.indexOf(item.value) > -1)

            return (<Checkbox labelPosition="left" ref={index} key={index} name={item.value} defaultSwitched={checked} label={<FormattedMessage id={item.label} />} onCheck={(e) => this.onChange(e)} />)
        })

        return (
            <span className="spread-right">
                {checkboxes}
            </span>
        )
    }
}

export default CheckboxGroup
