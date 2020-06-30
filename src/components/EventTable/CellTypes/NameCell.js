import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {getBadge} from 'src/utils/helpers';
import {getEventName} from 'src/utils/events';
import constants from '../../../constants';

class NameCell extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Returns object containing event status
     * @returns {{umbrella: boolean, series: boolean, draft: boolean, cancelled: boolean, postponed: boolean}}
     */
    getEventStatus() {
        const {event, isSuperEvent, superEventType} = this.props;

        return {
            draft: event.publication_status === constants.PUBLICATION_STATUS.DRAFT,
            cancelled: event.event_status === constants.EVENT_STATUS.CANCELLED,
            postponed: event.event_status === constants.EVENT_STATUS.POSTPONED,
            umbrella: isSuperEvent  && superEventType === constants.SUPER_EVENT_TYPE_UMBRELLA,
            series: isSuperEvent && superEventType === constants.SUPER_EVENT_TYPE_RECURRING,
        };
    }

    render() {
        const {
            event,
            nestLevel,
            isSuperEvent,
            hasSubEvents,
            showSubEvents,
            toggleSubEvent,
        } = this.props;
        const eventStatus = this.getEventStatus();
        const name = getEventName(event);
        const indentationStyle = {
            paddingLeft: `${nestLevel * 24}px`,
            fontWeight: nestLevel === 1 && isSuperEvent ? 'bold' : 'normal',
        };

        return (
            <td style={indentationStyle}>
                <div className='nameCell'>
                    {isSuperEvent && hasSubEvents &&
                    <span
                        className='sub-event-toggle tag-space'
                        onClick={toggleSubEvent}
                    >
                        {showSubEvents ?
                            <span className='glyphicon glyphicon-chevron-down' />
                            :
                            <span className='glyphicon glyphicon-chevron-right' />
                        }
                    </span>
                    }
                    {eventStatus.postponed && getBadge('postponed')}
                    {eventStatus.cancelled && getBadge('cancelled')}
                    {eventStatus.draft && getBadge('draft')}
                    {eventStatus.umbrella && getBadge('umbrella')}
                    {eventStatus.series && getBadge('series')}
                    <Link to={`/event/${event.id}`}>{name}</Link>
                </div>
            </td>
        );
    }
}

NameCell.propTypes = {
    event: PropTypes.object,
    nestLevel: PropTypes.number,
    isSuperEvent: PropTypes.bool,
    superEventType: PropTypes.oneOf([
        constants.SUPER_EVENT_TYPE_RECURRING,
        constants.SUPER_EVENT_TYPE_UMBRELLA,
    ]),
    hasSubEvents: PropTypes.bool,
    showSubEvents: PropTypes.bool,
    toggleSubEvent: PropTypes.func,
};

export default NameCell;
