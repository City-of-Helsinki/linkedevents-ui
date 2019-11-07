import PropTypes from 'prop-types';
import React from 'react'
import Tooltip from 'material-ui/Tooltip'
import Select from 'react-select'
import client from '../../../api/client'
import {Checkbox} from 'react-bootstrap'
import {setData} from '../../../actions/editor'
import {FormattedMessage} from 'react-intl'
import {SideField} from '../../FormFields'
import {get} from 'lodash'
import {connect} from 'react-redux'
import UmbrellaCheckbox from './UmbrellaCheckbo'

class UmbrellaSelector extends React.Component {

    state = {
        isUmbrellaEvent: false,
        hasUmbrellaEvent: false,
        selectedUmbrellaEvent: {},
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        // console.log('prevProps', prevProps)
        // console.log('this.context.store', this.context.store)
    }

    // todo: error handling
    getOptions(input) {
        return client.get('event', {super_event_type: 'umbrella', text: input})
            .then(response => ({options: response.data.data.map(item => ({label: item.name.fi, value: item['@id']}))}))
    }

    handleCheck = event => {
        const checked = event.target.checked
        const name = event.target.name

        if (name === 'is_umbrella') {
            this.setState({isUmbrellaEvent: checked})

            if (checked) {
                this.context.dispatch(setData({super_event_type: 'umbrella'}))
            }
        }
        if (name === 'has_umbrella') {
            this.setState({hasUmbrellaEvent: checked})
        }
    }

    handleChange(selectedEvent) {
        console.log('onChange selectedEvent', selectedEvent)
        // todo: ask how umbrella events are defined for events
        // this.context.dispatch(setData({umbrella_event: {'@id': selectedEvent.value}}))
        this.setState({selectedUmbrellaEvent: selectedEvent})

        if (this.props.setDirtyState) {
            this.props.setDirtyState()
        }
    }

    render() {
        const {isUmbrellaEvent, hasUmbrellaEvent} = this.state
        // const inCreate

        return (
            <div className="row">
                <div className="col-sm-6">
                    <UmbrellaCheckbox
                        name="is_umbrella"
                        handleCheck={this.handleCheck}
                        isUmbrellaEvent={isUmbrellaEvent}
                        hasUmbrellaEvent={hasUmbrellaEvent}
                        intl={this.context.intl}
                        event={this.props.event}
                    >
                        <FormattedMessage id="event-is-umbrella" />
                    </UmbrellaCheckbox>

                    <UmbrellaCheckbox
                        name="has_umbrella"
                        handleCheck={this.handleCheck}
                        isUmbrellaEvent={isUmbrellaEvent}
                        hasUmbrellaEvent={hasUmbrellaEvent}
                        formatMessage={this.formatMessage}
                        intl={this.context.intl}
                        event={this.props.event}
                    >
                        <FormattedMessage id="event-has-umbrella" />
                    </UmbrellaCheckbox>

                    {hasUmbrellaEvent &&
                    <Select.Async
                        value={this.state.selectedUmbrellaEvent}
                        labelKey="label"
                        loadOptions={input => this.getOptions(input)}
                        onChange={val => this.handleChange(val)}
                        ignoreAccents={false}
                        autoload={false}
                    />
                    }
                </div>
                <SideField>
                    <div className="tip">
                        {/* todo: get correct message */}
                        <p><FormattedMessage id="editor-tip-location"/></p>
                    </div>
                </SideField>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    event: get(state, ['events', 'event'], {}),
})


UmbrellaSelector.propTypes = {
    intl: PropTypes.object,
    dispatch: PropTypes.func,
    store: PropTypes.object,
    editor: PropTypes.object,
    setDirtyState: PropTypes.func,
    event: PropTypes.object,
    isUmbrellaEvent: PropTypes.bool,
    hasUmbrellaEvent: PropTypes.bool,
    selectedUmbrellaEvent: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
    }),
}

UmbrellaSelector.contextTypes = {
    intl: PropTypes.object,
    dispatch: PropTypes.func,
    store: PropTypes.object,
};

export default connect(mapStateToProps)(UmbrellaSelector)
