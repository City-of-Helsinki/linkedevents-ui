import '!style!css!sass!./HelSelect.scss'

import fetch from 'isomorphic-fetch'
import React from 'react'
import Select from 'react-select'

class HelSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    onChange(value) {
        // TODO: hook up to editor store
        this.setState({ value });
    }

    getOptions(input) {
        console.log('Fetching')
        return fetch(`${appSettings.api_base}/keyword/?data_source=yso&filter=${input}`)
            .then((response) => {
                return response.json();
            }).then((json) => {
                return _.map(json.data, (item) => ({
                    label: item.name.fi, // TODO: use locale
                    value: item.id
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

export default HelSelect
