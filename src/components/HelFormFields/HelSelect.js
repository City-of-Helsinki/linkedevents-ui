import '!style!css!sass!./HelSelect.scss'

import React from 'react'

import fetch from 'isomorphic-fetch'
import Select from 'react-select'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

class HelSelect extends React.Component {

    constructor(props) {
        super(props)
        let defaultValue = props.editor.values[this.props.name] || null
        this.state = {
            value: defaultValue
        }
    }

    onChange(value, list) {
        // TODO: hook up to editor store
        let obj = {}
        obj[this.props.name] = value
        this.props.dispatch(setData(obj))

        this.setState({ value });
    }

    getOptions(input) {
        return fetch(`${appSettings.api_base}/keyword/?data_source=yso&filter=${input}`)
            .then((response) => {
                return response.json();
            }).then((json) => {
                return _.map(json.data, (item) => ({
                    label: item.name.fi, // TODO: use locale
                    value: `/v0.1/keyword/${item.id}`
                }));
            }).then((json) => {
                return { options: json };
            })
    }

    render() {
        return (
            <div className="hel-select col-lg-6">
                <legend>{this.props.legend}</legend>
                <Select.Async
                    {...this.props}
                    multi
                    value={this.state.value}
                    loadOptions={ (val) => this.getOptions(val)  }
                    onChange={ (val) => this.onChange(val) }
                />
            </div>
        )
    }
}

export default connect((state) => ({
    editor: state.editor
}))(HelSelect)
