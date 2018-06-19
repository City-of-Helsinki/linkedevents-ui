import PropTypes from 'prop-types';
import React from 'react'

import {FormControl, ControlLabel} from 'react-bootstrap'
import Select from 'react-select'

import Typeahead from 'src/typeahead.js'

import {connect} from 'react-redux'
import {setData} from 'src/actions/editor.js'

import ValidationPopover from 'src/components/ValidationPopover'

class HelAutoComplete extends React.Component {

    static contextTypes = {
        intl: PropTypes.object,
        dispatch: PropTypes.func,
    };

    constructor(props) {
        super(props)

        this.state = {isLoading: false}
    }

    getOptions(input) {
        let self = this
        this.setState({isLoading: true});
        return fetch(this.props.dataSource + encodeURI(input))
            .then((response) => {
                return response.json();
            }).then((json) => {
                return _.map(json.data, (item) => {
                    return {
                        value: item.id,
                        label: item.name.fi, // TODO: use locale
                        '@id': `/v1/${this.props.resource}/${item.id}/`,
                        id: item.id,
                        n_events: item.n_events,
                    }
                })
            }).then((json) => {
                self.setState({isLoading: false})
                return {options: json}
            })
    }

    onChange(val) {

        if(!val) {
            let obj = {}
            obj[this.props.name] = {}
            this.context.dispatch(setData(obj))
            return
        }

        // Do action to save form state to storage
        let obj = {}
        obj[this.props.name] = {
            name: {fi: val.label},
            id: val.value,
            '@id': val['@id'],
        }

        this.context.dispatch(setData(obj))

        if (this.props.setDirtyState) {
            this.props.setDirtyState()
        }

        if(typeof this.props.onSelection === 'function') {
            this.props.onSelection(val)
        }
    }

    optionRenderer(item) {
        return `${item.label} (${item.n_events} tapahtumaa)`
    }

    render() {

        let values = {
            id: null,
            name: {},
        }

        if(typeof this.props.defaultValue === 'object' && this.props.defaultValue !== null) {
            values = Object.assign({}, values, this.props.defaultValue)
        }

        return (
            <span>
                <div className="hel-select">
                    <span className="legend" style={{position: 'relative', width: 'auto'}}>{this.props.legend} <ValidationPopover small={true} validationErrors={this.props.validationErrors} /></span>
                    <Select.Async
                        placeholder={this.props.placeholder}
                        value={ {label: values.name.fi, value: values.id} }
                        loadOptions={ val => this.getOptions(val)  }
                        onChange={ (val,list) => this.onChange(val,list) }
                        isLoading={this.state.isLoading}
                        ignoreAccents={false}
                        autoload={false}
                        optionRenderer={this.optionRenderer}
                    />
                </div>
                <div className="hel-text-field">
                    <ControlLabel className="hel-label">
                        {this.context.intl.formatMessage({id: 'event-location-id'})}
                    </ControlLabel>

                    <FormControl
                        value={values.id ? values.id : ''}
                        ref="text"
                        disabled
                    />
                </div>
            </span>
        )
    }
}

HelAutoComplete.propTypes = {
    dataSource: PropTypes.string,
    resource: PropTypes.string,
    name: PropTypes.string,
    setDirtyState: PropTypes.func,
    onSelection: PropTypes.func,
    defaultValue: PropTypes.object,
    validationErrors: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    placeholder: PropTypes.string,
    legend: PropTypes.string,
}

export default HelAutoComplete
