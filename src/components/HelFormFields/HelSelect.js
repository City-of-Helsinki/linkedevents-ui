import '!style!css!sass!./HelSelect.scss'

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

    render() {

        let options = [
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
            { value: 'three', label: 'Three' }
        ]

        return (
            <div className="hel-select col-lg-6">
                <legend>{this.props.legend}</legend>
                <Select
                    {...this.props}
                    ref="select"
                    multi
                    value={this.state.value}
                    options={options}
                    onChange={(val) => this.onChange(val)}
                />
            </div>
        )
    }
}

export default HelSelect
