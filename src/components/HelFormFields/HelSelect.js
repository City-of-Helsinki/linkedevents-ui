import '!style-loader!css-loader!sass-loader!./HelSelect.scss'

import PropTypes from 'prop-types';

import React from 'react'

import fetch from 'isomorphic-fetch'
import Select from 'react-select'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

class HelSelect extends React.Component {

    static contextTypes = {
        intl: PropTypes.object,
        dispatch: PropTypes.func,
    };

    onChange(value) {
        let obj = {}
        obj[this.props.name] = value
        this.context.dispatch(setData(obj))

        if (this.props.setDirtyState) {
            this.props.setDirtyState()
        }
    }

    getOptions(input) {
        return fetch(this.props.dataSource + encodeURI(input))
            .then((response) => {
                return response.json();
            }).then((json) => {
                return _.map(json.data, (item) => ({
                    label: item.name.fi, // TODO: use locale
                    value: `/v1/${this.props.resource}/${item.id}/`,
                    n_events: item.n_events,
                }));
            }).then((json) => {
                return {options: json};
            })
    }

    optionRenderer(item) {
        return `${item.label} (${item.n_events} tapahtumaa)`
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
                    autoload={false}
                    optionRenderer={this.optionRenderer}
                />
            </div>
        )
    }
}

export default HelSelect
