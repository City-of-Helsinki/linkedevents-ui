import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {TableCell, TableRow, CircularProgress, Checkbox} from 'material-ui'
import {get, isEmpty, isUndefined} from 'lodash'
import constants from '../../constants'
import NameCell from './CellTypes/NameCell'
import DateTimeCell from './CellTypes/DateTimeCell'
import PublisherCell from './CellTypes/PublisherCell'
import {getFirstMultiLanguageFieldValue} from '../../utils/helpers'
import {fetchEvents} from '../../utils/events'

class EventRow extends React.Component {

    state = {
        subEvents: [],
        showSubEvents: false,
        isSubEvent: false,
        isSuperEvent: false,
        superEventType: null,
        isFetching: false,
    }

    componentDidMount() {
        const {event} = this.props
        const superEventType = event.super_event_type
        // whether the event is a super event
        const isSuperEvent = superEventType === constants.SUPER_EVENT_TYPE_RECURRING
            || superEventType === constants.SUPER_EVENT_TYPE_UMBRELLA
        // whether the event is a sub event
        const isSubEvent = !isUndefined(get(event, ['super_event', '@id']))

        this.setState({isSubEvent, isSuperEvent, superEventType})
    }

    toggleSubEvent = () => {
        const {event} = this.props
        const {subEvents, showSubEvents, isSuperEvent} = this.state

        if (
            !showSubEvents
            && isSuperEvent
            && isEmpty(subEvents)
        ) {
            this.setState({isFetching: true, showSubEvents: !showSubEvents})
            fetchEvents(event.id)
                .then(events => this.setState({subEvents: events.data.data}))
                .finally(() => this.setState({isFetching: false}))
        } else {
            this.setState({showSubEvents: !showSubEvents})
        }
    }

    getPublisherData = () => {
        const {event, user} = this.props
        const publisherId = get(event, ['publisher'], '')
        const publisher = get(user, ['adminOrganizationData', publisherId, 'name'], '')
        const createdBy = get(event, 'created_by', '')
        const eventName = getFirstMultiLanguageFieldValue(event.name)

        return {publisher, createdBy, eventName}
    }

    render() {
        const {
            event,
            nestLevel,
            tableName,
            tableColumns,
            selectedRows = [],
            handleRowSelect,
            superEventIsChecked,
        } = this.props
        const {
            subEvents,
            showSubEvents,
            isSubEvent,
            isSuperEvent,
            superEventType,
            isFetching,
        } = this.state
        const hasSubEvents = get(event, 'sub_events', []).length > 0
        const shouldShow = showSubEvents && isSuperEvent

        let checked

        if (isSubEvent) {
            checked = superEventIsChecked
        } else {
            checked = selectedRows.includes(event.id)
        }

        return (
            <React.Fragment>
                <TableRow className={isSubEvent ? 'sub-event-row' : ''}>
                    {tableColumns.map((type, index) => {
                        if (type === 'checkbox') {
                            return <TableCell
                                key={`${event.id}-cell-${index}`}
                                className="checkbox"
                            >
                                <Checkbox
                                    checked={checked}
                                    disabled={isSubEvent}
                                    onChange={(e, checked) => handleRowSelect(checked, event.id, tableName)}
                                />
                            </TableCell>
                        }
                        if (type === 'name') {
                            return <NameCell
                                key={`${event.id}-cell-${index}`}
                                event={event}
                                nestLevel={nestLevel}
                                isSuperEvent={isSuperEvent}
                                superEventType={superEventType}
                                hasSubEvents={hasSubEvents}
                                showSubEvents={showSubEvents}
                                toggleSubEvent={this.toggleSubEvent}
                            />
                        }
                        if (type === 'publisher') {
                            return <PublisherCell
                                key={`${event.id}-cell-${index}`}
                                {...this.getPublisherData()}
                            />
                        }
                        if (type === 'start_time') {
                            return <DateTimeCell
                                key={`${event.id}-cell-${index}`}
                                event={event}
                                start
                            />
                        }
                        if (type === 'end_time') {
                            return <DateTimeCell
                                key={`${event.id}-cell-${index}`}
                                event={event}
                                end
                            />
                        }
                        if (type === 'last_modified_time') {
                            return <DateTimeCell
                                key={`${event.id}-cell-${index}`}
                                event={event}
                                lastModified
                                time
                            />
                        }
                        if (type === 'date_published') {
                            return <DateTimeCell
                                key={`${event.id}-cell-${index}`}
                                event={event}
                                datePublished
                                time
                            />
                        }
                        if (type === 'event_time') {
                            return <DateTimeCell
                                key={`${event.id}-cell-${index}`}
                                event={event}
                                start
                                end
                            />
                        }
                    })}
                </TableRow>
                {shouldShow && (
                    isFetching
                        ? (
                            <TableRow>
                                {tableColumns.reduce((acc, column, index) => {
                                    const tableHasCheckboxColumn = tableColumns.includes('checkbox')
                                    const columnCount = tableColumns.length

                                    // add a placeholder cell with "checkbox" class for tables with a checkbox column
                                    if (column === 'checkbox') {
                                        return [...acc, <TableCell key={`cell-placeholder-${index}`} className="checkbox" />]
                                    }
                                    // add loading spinner
                                    if (tableHasCheckboxColumn && acc.length === 1 || !tableHasCheckboxColumn && acc.length === 0) {
                                        return [...acc, <TableCell key={`cell-placeholder-${index}`}><CircularProgress /></TableCell>]
                                    }
                                    // add empty cells to fill the row
                                    if (tableHasCheckboxColumn &&  index + 1 <= columnCount || !tableHasCheckboxColumn &&  index <= columnCount) {
                                        return [...acc, <TableCell key={`cell-placeholder-${index}`} />]
                                    }
                                    return acc
                                }, [])}
                            </TableRow>
                        ) : (
                            <SubEventsTable
                                {...this.props}
                                subEvents={subEvents}
                                superEventIsChecked={checked}
                                // nest level is used to calculate the indentation for each level of recursion
                                nestLevel={nestLevel + 1}
                            />
                        )
                )}
            </React.Fragment>
        )
    }
}

// recursively render sub events of events
const SubEventsTable = props => {
    const {subEvents} = props;

    return (
        <React.Fragment>
            {subEvents.map(event => (
                <EventRow
                    {...props}
                    event={event}
                    key={event.id}
                />
            ))}
        </React.Fragment>
    )
}

SubEventsTable.propTypes = {
    subEvents: PropTypes.array,
    superEventIsChecked: PropTypes.bool,
    event: PropTypes.object,
    nestLevel: PropTypes.number,
}

EventRow.defaultProps = {
    nestLevel: 1,
}

EventRow.propTypes = {
    showSubEvents: PropTypes.bool,
    isSubEvent: PropTypes.bool,
    isSuperEvent: PropTypes.bool,
    superEventType: PropTypes.oneOf([
        constants.SUPER_EVENT_TYPE_RECURRING,
        constants.SUPER_EVENT_TYPE_UMBRELLA,
    ]),
    nestLevel: PropTypes.number,
    event: PropTypes.object,
    tableName: PropTypes.string,
    tableColumns: PropTypes.arrayOf(
        PropTypes.oneOf([
            'checkbox',
            'name',
            'publisher',
            'start_time',
            'end_time',
            'last_modified_time',
            'date_published',
            'event_time',
        ]),
    ),
    selectedRows: PropTypes.array,
    handleRowSelect: PropTypes.func,
    user: PropTypes.object,
    superEventIsChecked: PropTypes.bool,
}

const mapStateToProps = (state) => ({
    user: state.user,
})

export default connect(mapStateToProps)(EventRow)
