import '!style!css!sass!./HelSelect.scss'

import React from 'react'

import fetch from 'isomorphic-fetch'
import Select from 'react-select'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

class HelSelect extends React.Component {

    static contextTypes = {
        intl: React.PropTypes.object,
        dispatch: React.PropTypes.func
    };

    onChange(value) {
        let obj = {}
        obj[this.props.name] = value
        this.context.dispatch(setData(obj))
    }

    getOptions(input) {
        return fetch(this.props.dataSource + input)
            .then((response) => {
                return response.json();
            }).then((json) => {
                return _.map(json.data, (item) => ({
                    label: item.name.fi, // TODO: use locale
                    value: `/v0.1/${this.props.resource}/${item.id}/`
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
                    multi
                    value={this.props.selectedValues}
                    loadOptions={ (val) => this.getOptions(val)  }
                    onChange={ (val) => this.onChange(val) }
                    ignoreAccents={false}
                />
            </div>
        )
    }
}

export default HelSelect
