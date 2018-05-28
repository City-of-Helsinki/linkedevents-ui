// Group of checkboxes that output an array on change

import React from 'react'
import {FormattedMessage} from 'react-intl'

import Input from 'react-bootstrap/lib/Input'

import {connect} from 'react-redux'
import {setLanguages} from 'src/actions/editor.js'

import _ from 'lodash'

class HelLanguageSelect extends React.Component {

  constructor(props) {
    super(props)
  }

  onChange(e) {
    let checked = _.filter(this.refs, (ref) => (ref.getChecked()))
    let checkedNames = _.map(checked, (checkbox) => (checkbox.props.name) )

    this.props.dispatch(setLanguages(checkedNames))

    if(typeof this.props.onChange === 'function') {
      this.props.onChange(checkedNames)
    }
  }

  render() {
    let checkboxes = this.props.options.map((item, index) => {
      let checked = this.props.checked && (this.props.checked.indexOf(item.value) > -1)
      return (<Input
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

export default connect()(HelLanguageSelect)
