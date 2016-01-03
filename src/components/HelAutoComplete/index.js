import React from 'react'

import { FormattedMessage } from 'react-intl'
import { AutoComplete } from 'material-ui'
import Typeahead from 'src/typeahead.js'

class HelAutoComplete extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            dataSource: []
        }
    }

    onInput(input) {
        Typeahead.bloodhoundInstance.search(input,
            (datums) => {
                let items = datums.splice(0,10).map((item) => ({
                    text: item.value,
                    value: (<AutoComplete.Item primaryText={item.value} secondaryText={item.street_address} />)
                }))

                this.setState({dataSource: items})
            }
        )
    }

    onNewRequest(input) {
        console.log(input)
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
            <AutoComplete
                fullWidth={true}
                required={true}
                showAllItems={true}
                anchorOrigin={anchorOrigin}
                targetOrigin={targetOrigin}
                dataSource={this.state.dataSource}
                floatingLabelText={<FormattedMessage id="event-location"/>}
                onUpdateInput={(t) => { this.onInput(t) }}
                onNewRequest={(t) => { this.onNewRequest(t) }} />
        )
    }
}



export default HelAutoComplete
