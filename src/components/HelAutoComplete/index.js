import React from 'react'

import { FormattedMessage } from 'react-intl'

import { AutoComplete } from 'material-ui'
import TextField from 'node_modules/material-ui-with-sass/src/js/text-field.jsx'

import Typeahead from 'src/typeahead.js'

class HelAutoComplete extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            dataSource: [],
            selectedKey: ''
        }
    }

    // NOTE: uses a crude hack to include the id with the name
    onInput(input) {
        Typeahead.bloodhoundInstance.search(input,
            (datums) => {
                let items = datums.splice(0,10).map((item) => ({
                    text: item.value,
                    key: item.id,
                    value: (<AutoComplete.Item primaryText={item.value} secondaryText={item.street_address}/>)
                }))

                this.setState({dataSource: items})
            }
        )
    }

    onNewRequest(chosenRequest, index, dataSource) {
        console.log(dataSource[index].key);
        this.setState({selectedKey: dataSource[index].key })
        this.props.onSelection(chosenRequest, index, dataSource)
    }

    render() {
        let anchorOrigin = {
          vertical: 'bottom',
          horizontal: 'left'
        }

        let targetOrigin = {
          vertical: 'top',
          horizontal: 'left'
        }

        return (
            <span>
                <AutoComplete
                    fullWidth={true}
                    required={true}
                    showAllItems={true}
                    anchorOrigin={anchorOrigin}
                    targetOrigin={targetOrigin}
                    dataSource={this.state.dataSource}
                    floatingLabelText={<FormattedMessage id="event-location"/>}
                    onUpdateInput={(t) => { this.onInput(t) }}
                    onNewRequest={(t,i,d) => { this.onNewRequest(t,i,d) }} />
                <TextField value={this.state.selectedKey} disabled={true} required={true} floatingLabelText={<FormattedMessage id="event-location-id"/>} />
            </span>
        )
    }
}



export default HelAutoComplete
