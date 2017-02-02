import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'

import defaultThumbnail from 'src/assets/images/helsinki-coat-of-arms-white.png'

import '!style!css!sass!./index.scss'

let dateFormat = function(timeStr) {
    return timeStr ? moment(timeStr).format('YYYY-MM-DD') : ''
}

let EventItem = (props) => {

    let name = (
        props.event.name.fi || props.event.name.en || props.event.name.sv ||
        props.event.headline.fi || props.event.headline.en || props.event.headline.sv
    )

    let url = "/event/" + encodeURIComponent(props.event['id']) + '/'

    const image = props.event.images.length > 0 ? props.event.images[0].url : defaultThumbnail
    let thumbnailStyle = {
        backgroundImage: 'url(' + image + ')'
    }

    return (
        <Link to={url}>
            <div className="col-xs-12 col-md-6 col-lg-4" key={ props.event['id'] }>
                <div className="event-item">
                    <div className="thumbnail" style={thumbnailStyle} />
                    <div className="name">{name}</div>
                </div>
            </div>
        </Link>
    )
}

let EventGrid = (props) => {

    let gridItems = props.events.map(function(event) {
        return (<EventItem event={event} key={event.id} />)
    })

    return (
        <div className="row event-grid">
            {gridItems}
        </div>
    )
}

export default connect()(EventGrid)
