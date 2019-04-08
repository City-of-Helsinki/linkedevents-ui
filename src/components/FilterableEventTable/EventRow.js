import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {TableCell, TableRow, CircularProgress, Table} from 'material-ui'
import {KeyboardArrowDown, KeyboardArrowUp} from 'material-ui-icons';
import {FormattedMessage, FormattedDate, FormattedRelative} from 'react-intl'
import {Link} from 'react-router-dom'
import {isEmpty} from 'lodash'

import constants from '../../constants'
import {fetchSubEventsForSuper} from '../../actions/subEvents'

class EventRow extends React.Component {
    state = {
        showSubEvents: false,
    }

    toggleSubEvent = () => {
        const {getSubEvents, event, fetchingId, fetchSubEvents} = this.props
        const {showSubEvents} = this.state
        const subEvents = getSubEvents(event.id)
        if (!showSubEvents
            && event.super_event_type === 'recurring'
            && fetchingId !== event.id
            && isEmpty(subEvents)
            && !isEmpty(event.sub_events)
        ) {
            fetchSubEvents(event.id)
        }
        this.setState({showSubEvents: !this.state.showSubEvents})
    }

    render() {
        let dateFormat = function(timeStr) {
            return timeStr ? <FormattedDate value={timeStr} month="short" day="numeric" year="numeric"/> : ''
        }
        let dateTimeFormat = function(timeStr) {
            return timeStr ? <FormattedRelative value={timeStr} /> : ''
        }

        let e = this.props.event

        let name = null
        if (e.name ) {
            name = (
                e.name.fi || e.name.en || e.name.sv)
        }
        else if (e.headline) {
            name = e.headline.fi || e.headline.en || e.headline.sv
        }
        else {
            name = '<event>'
        }

        let url = '/event/' + e.id;

        // Add necessary badges
        let nameColumn = null
        let draft = e.publication_status === constants.PUBLICATION_STATUS.DRAFT
        // let draftClass = draft ? 'draft-row' : ''
        let draftClass = null
        let cancelled = e.event_status === constants.EVENT_STATUS.CANCELLED
        let isSuper = e.super_event_type === 'recurring'
        // let cancelledClass = cancelled ? 'cancelled-row' : ''
        let cancelledClass = null

        const indentationStyle = {
            paddingLeft: `${this.props.nestLevel * 24}px`,
            fontWeight: this.props.nestLevel === 1 && isSuper ? 'bold' : 'normal', 
        }

        const draftLabels = draft && (
            <span className='badge badge-warning text-uppercase tag-space'>
                <FormattedMessage id='draft' />
            </span>
        )
        const cancelledLabel = cancelled && (
            <span className='badge badge-danger text-uppercase tag-space'>
                <FormattedMessage id='cancelled' />
            </span>
        )

        // if (draft) {
        // nameColumn = (<TableCell style={indentationStyle} className={draftClass}><span className="badge badge-warning text-uppercase tag-space"><FormattedMessage id="draft"/></span> <Link to={url}>{name}</Link></TableCell>)
        // } else if (cancelled) {
        //     nameColumn = (<TableCell style={indentationStyle} className={cancelledClass}><span className="badge badge-danger text-uppercase tag-space"><FormattedMessage id="cancelled"/></span> <Link to={url}>{name}</Link></TableCell>)
        if (isSuper) {
            nameColumn = (
                <TableCell
                    style={indentationStyle}
                    className={cancelledClass}
                >
                    <span className='tag-space'>
                        {this.state.showSubEvents ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </span>
                    <span className="badge badge-success text-uppercase tag-space">
                        <FormattedMessage id="series"/>
                    </span>
                    {draftLabels}
                    {cancelledLabel}
                    <Link to={url}>{name}</Link>
                </TableCell>
            )
        } else {
            nameColumn = (
                <TableCell style={indentationStyle}>
                    {draftLabels}
                    {cancelledLabel}
                    <Link to={url}>{name}</Link>
                </TableCell>
            )
        }

        const shouldShow = isSuper && this.state.showSubEvents
        const isFetching = this.props.fetchingId === e.id

        return (
            <React.Fragment>
                <TableRow
                    className={isSuper ? 'super-event-row' : null}
                    key={e['id']}
                    onClick={isSuper ? this.toggleSubEvent : null}
                >
                    {nameColumn}
                    <TableCell className={draftClass}>{dateFormat(e.start_time)}</TableCell>
                    <TableCell className={draftClass}>{dateFormat(e.end_time)}</TableCell>
                    <TableCell className={draftClass}>{dateTimeFormat(e.last_modified_time)}</TableCell>
                </TableRow>
                {shouldShow && (
                    isFetching
                        ? (
                            <TableRow>
                                <TableCell><CircularProgress className='sub-events-progress'/></TableCell>
                            </TableRow>
                        ) : (
                            <SubEventsTable
                                nestLevel={this.props.nestLevel + 1}
                                events={this.props.getSubEvents(e.id)}
                            />
                        )
                )}
            </React.Fragment>
        )
    }
}

// render sub events of sub events ..etc recursively
// nest levl is used to calculate the indentation for each level of recursion
const SubEventsTable = (props) => {
    const {events, nestLevel} = props;

    return (
        <React.Fragment>
            {events.map(event => (
                <EventRow nestLevel={nestLevel} event={event} key={event.id} />
            ))}
        </React.Fragment>
    )
}

SubEventsTable.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object),
    nestLevel: PropTypes.number,
}

EventRow.defaultProps = {
    nestLevel: 1,
}

EventRow.propTypes = {
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
