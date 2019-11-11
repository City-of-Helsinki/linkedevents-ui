import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {TableCell, TableRow, CircularProgress, withStyles} from 'material-ui'
import {KeyboardArrowDown, KeyboardArrowRight} from 'material-ui-icons';
import {FormattedMessage, FormattedDate, FormattedRelative} from 'react-intl'
import {Link} from 'react-router-dom'
import {get, isEmpty} from 'lodash'
import constants from '../../constants'
import {fetchSubEventsForSuper} from '../../actions/subEvents'
import {getFirstMultiLanguageFieldValue} from '../../utils/helpers'

export const CustomTableCell = withStyles(() => ({
    typeBody: {
        '&:first-of-type': {
            width: 'auto',
        },
        padding: '0 15px',
        width: '16%',
    },
}))(TableCell);

class EventRow extends React.Component {

    state = {
        showSubEvents: false,
        isSuperEvent: false,
        superEventType: null,
    }

    componentDidMount() {
        const {event} = this.props
        const superEventType = event.super_event_type
        const isSuperEvent = superEventType === constants.SUPER_EVENT_TYPE_RECURRING
            || superEventType === constants.SUPER_EVENT_TYPE_UMBRELLA

        this.setState({isSuperEvent, superEventType})
    }

    toggleSubEvent = () => {
        const {getSubEvents, event, fetchingId, fetchSubEvents} = this.props
        const {showSubEvents, isSuperEvent} = this.state
        const subEvents = getSubEvents(event.id)

        if (!showSubEvents
            && isSuperEvent
            && fetchingId !== event.id
            && isEmpty(subEvents)
            && !isEmpty(event.sub_events)
        ) {
            fetchSubEvents(event.id)
        }
        this.setState({showSubEvents: !this.state.showSubEvents})
    }

    render() {
        const {event, nestLevel, fetchingId} = this.props
        const {showSubEvents, isSuperEvent, superEventType} = this.state
        const hasSubEvents = get(event, 'sub_events', []).length > 0
        let name = null

        if (event.name ) {
            name = getFirstMultiLanguageFieldValue(event.name)
        }
        else if (event.headline) {
            name = getFirstMultiLanguageFieldValue(event.headline)
        }
        else {
            name = '<event>'
        }

        // Add necessary badges
        const draft = event.publication_status === constants.PUBLICATION_STATUS.DRAFT
        const cancelled = event.event_status === constants.EVENT_STATUS.CANCELLED

        const indentationStyle = {
            paddingLeft: `${nestLevel * 24}px`,
            fontWeight: nestLevel === 1 && isSuperEvent ? 'bold' : 'normal',
        }

        const dateFormat = timeStr => timeStr ? <FormattedDate value={timeStr} month="short" day="numeric" year="numeric"/> : ''
        const dateTimeFormat = timeStr => timeStr ? <FormattedRelative value={timeStr} /> : ''
        const getBadge = type => {
            let badgeType = 'primary'

            switch (type) {
                case 'series':
                    badgeType = 'success'
                    break
                case 'umbrella':
                    badgeType = 'info'
                    break
                case 'draft':
                    badgeType = 'warning'
                    break
                case 'cancelled':
                    badgeType = 'danger'
                    break
            }
            return (
                <span className={`badge badge-${badgeType} text-uppercase tag-space`}>
                    <FormattedMessage id={type} />
                </span>
            )
        }

        const shouldShow = showSubEvents && isSuperEvent
        const isFetching = fetchingId === event.id

        return (
            <React.Fragment>
                <TableRow
                    key={event['id']}
                    className={isSuperEvent ? 'super-event-row' : null}
                    onClick={isSuperEvent && hasSubEvents ? this.toggleSubEvent : null}
                >
                    <CustomTableCell style={indentationStyle}>
                        {isSuperEvent && hasSubEvents &&
                            <span className='tag-space'>
                                {showSubEvents ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                            </span>
                        }
                        {isSuperEvent && superEventType === constants.SUPER_EVENT_TYPE_UMBRELLA &&
                            getBadge('umbrella')
                        }
                        {isSuperEvent && superEventType === constants.SUPER_EVENT_TYPE_RECURRING &&
                            getBadge('series')
                        }
                        {draft && getBadge('draft')}
                        {cancelled && getBadge('cancelled')}
                        <Link to={`/event/${event.id}`}>{name}</Link>
                    </CustomTableCell>
                    <CustomTableCell>{dateFormat(event.start_time)}</CustomTableCell>
                    <CustomTableCell>{dateFormat(event.end_time)}</CustomTableCell>
                    <CustomTableCell>{dateTimeFormat(event.last_modified_time)}</CustomTableCell>
                </TableRow>
                {shouldShow && (
                    isFetching
                        ? (
                            <TableRow>
                                <TableCell><CircularProgress className='sub-events-progress'/></TableCell>
                            </TableRow>
                        ) : (
                            <SubEventsTable
                                {...this.props}
                                // nest level is used to calculate the indentation for each level of recursion
                                nestLevel={nestLevel + 1}
                            />
                        )
                )}
            </React.Fragment>
        )
    }
}

// render sub events of sub events ..etc recursively
const SubEventsTable = props => {
    const {event, getSubEvents} = props;
    const events = getSubEvents(event.id)

    return (
        <React.Fragment>
            {events.map(event => (
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
    event: PropTypes.object,
    fetchingId: PropTypes.string,
    nestLevel: PropTypes.number,
    getSubEvents: PropTypes.func,
    fetchSubEvents: PropTypes.func,
}

EventRow.defaultProps = {
    nestLevel: 1,
}

EventRow.propTypes = {
    showSubEvents: PropTypes.bool,
    isSuperEvent: PropTypes.bool,
    superEventType: PropTypes.oneOf([
        constants.SUPER_EVENT_TYPE_RECURRING,
        constants.SUPER_EVENT_TYPE_UMBRELLA,
    ]),
    nestLevel: PropTypes.number,
    event: PropTypes.object,
    fetchingId: PropTypes.string,
    getSubEvents: PropTypes.func,
    fetchSubEvents: PropTypes.func,
}

const mapStateToProps = (state) => ({
    fetchingId: state.subEvents.fetchingFromSuperId,
    getSubEvents: (superEventId) => state.subEvents.bySuperEventId[superEventId] || [],
})

const mapDispatchToProps = (dispatch) => ({
    fetchSubEvents: (superEventId) => dispatch(fetchSubEventsForSuper(superEventId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EventRow)
