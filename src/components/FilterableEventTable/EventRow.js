import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {TableCell, TableRow, Table, TableBody, CircularProgress} from 'material-ui'
import {FormattedMessage, FormattedDate, FormattedRelative} from 'react-intl'
import {Link} from 'react-router-dom'

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
            && subEvents.length <= 0
            && _.keys(event.sub_events).length > 0
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
        let draft = this.props.event.publication_status === constants.PUBLICATION_STATUS.DRAFT
        // let draftClass = draft ? 'draft-row' : ''
        let draftClass = null
        let cancelled = this.props.event.event_status === constants.EVENT_STATUS.CANCELLED
        let isSuper = this.props.event.super_event_type === 'recurring'
        // let cancelledClass = cancelled ? 'cancelled-row' : ''
        let cancelledClass = null
        if (draft) {
            nameColumn = (<TableCell className={draftClass}><span className="badge badge-warning text-uppercase"><FormattedMessage id="draft"/></span> <Link to={url}>{name}</Link></TableCell>)
        } else if (cancelled) {
            nameColumn = (<TableCell className={cancelledClass}><span className="badge badge-danger text-uppercase"><FormattedMessage id="cancelled"/></span> <Link to={url}>{name}</Link></TableCell>)
        } else if (isSuper) {
            nameColumn = (<TableCell className={cancelledClass}><span className="badge badge-success text-uppercase"><FormattedMessage id="sarja"/></span> <Link to={url}>{name}</Link></TableCell>)
        } else {
            nameColumn = (<TableCell><Link to={url}>{name}</Link></TableCell>)
        }

        const progressStyle = {
            marginTop: '20px',
            marginLeft: '60px',
        }

        return (
            <React.Fragment>
                <TableRow key={e['id']} onClick={this.toggleSubEvent}>
                    {nameColumn}
                    <TableCell className={draftClass}>{dateFormat(e.start_time)}</TableCell>
                    <TableCell className={draftClass}>{dateFormat(e.end_time)}</TableCell>
                    <TableCell className={draftClass}>{dateTimeFormat(e.last_modified_time)}</TableCell>
                </TableRow>
                {_.keys(e.sub_events).length > 0 && this.state.showSubEvents && (
                    <TableRow>
                        <TableCell colSpan={4} style={{padding: 0, paddingLeft: 24}}>
                            {this.props.fetchingId === e.id
                                ? <span><CircularProgress style={progressStyle}/></span>
                                : (
                                    <Table className='event-table'>
                                        <TableBody>
                                            {this.props.getSubEvents(e.id).map(event => (
                                                <EventRow event={event} key={event.id} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                )
                            }
                        </TableCell>
                    </TableRow>
                )}
            </React.Fragment>
        )
    }
}

EventRow.propTypes = {
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
