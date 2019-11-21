import PropTypes from 'prop-types'
import React from 'react'
import {isNil} from 'lodash'
import {TableCell} from 'material-ui'

const PublisherCell = props => {
    const {publisher, createdBy, eventName} = props
    let creator, email

    if (!isNil(createdBy)) {
        const searchKey = ' - '
        const splitCreator = createdBy.split(searchKey)
        creator = splitCreator[0] += searchKey
        email = splitCreator[1]
    }

    return (
        <TableCell>
            <span>
                {publisher}
                {creator && email &&
                    <React.Fragment>
                        <br/>
                        <small>
                            {creator}
                            <a href={`mailto:${email}?subject=Tapahtumailmoituksesi ${eventName ? `"${eventName}" ` : ''}vaatii toimenpiteitä – Helsingin kaupunki`}>{email}</a>
                        </small>
                    </React.Fragment>
                }
            </span>
        </TableCell>
    )
}

PublisherCell.propTypes = {
    publisher: PropTypes.string,
    createdBy: PropTypes.string,
    eventName: PropTypes.string,
}

export default PublisherCell
