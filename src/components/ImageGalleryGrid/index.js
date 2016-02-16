import React from 'react';
import { connect } from 'react-redux'
import { setData } from 'src/actions/editor.js'
import { fetchUserImages } from 'src/actions/userImages'
import ImageThumbnail from '../ImageThumbnail'

class ImageGalleryGrid extends React.Component {

    constructor(props) {
        super(props)
    }
    componentDidMount() {
        this.fetchImages();
    }

    componentDidUpdate() {
        const { fetchComplete, isFetching } = this.props.images
        if (fetchComplete || isFetching) {
            return;
        }
        this.fetchImages();
    }

    fetchImages() {
        if (this.props.user) {
            this.props.dispatch(fetchUserImages(this.props.user, 1000));
        }
    }

    render() {

        let imgs = this.props.images.items.map((img) => {
            let sel = false
            if(this.props.images.selected) {
                sel = img.id == this.props.images.selected.id
            }
            return (
                <ImageThumbnail selected={sel} key={img.id} url={img.url} data={img} />
            )
        })
        // unsift == prepend
        imgs.unshift(<ImageThumbnail url="" data={{}}/>)

        return (
            <div className="image-grid">
                {imgs}
                <div className="clearfix" />
            </div>
        )
    }
}

export default connect()(ImageGalleryGrid)

// export default connect((state) => ({
//     events: state.events,
//     user: state.user,
//     organization: state.organization,
//     apiErrorMsg: state.events.apiErrorMsg
// }))(EventListing);


// =======================================================

//
// import FilterableEventTable from 'src/components/FilterableEventTable'
// import EventGrid from 'src/components/EventGrid'
// import SearchBar from 'src/components/SearchBar'
//
// import { fetchUserEvents } from 'src/actions/userEvents'
// import {login, logout} from 'src/actions/user.js'
//
// class EventListing extends React.Component {
//     constructor(props) {
//         super(props)
//     }
//     // componentDidMount() {
//     //     this.fetchEvents();
//     // }
//     // componentDidUpdate() {
//     //     const { fetchComplete, isFetching } = this.props.events;
//     //     if (fetchComplete || isFetching) {
//     //         return;
//     //     }
//     //     this.fetchEvents();
//     // }
//     //
//     // getInitialState() {
//     //     return {nextEventsPage: 1}
//     // }
//     //
//     // fetchEvents() {
//     //     if (this.props.user) {
//     //         this.props.dispatch(fetchUserEvents(this.props.user, 1));
//     //     }
//     // }
//
//     // <FilterableEventTable events={this.props.events} apiErrorMsg={''} />
//
//     render() {
//         // Use material UI table
//         // or similar grid
//         const { events, user } = this.props;
//         const header = <h1><FormattedMessage id="organization-events"/></h1>
//         if (!user) {
//             return (
//                 <div className="container">
//                     {header}
//                     <p>
//                     <a style={{cursor: 'pointer'}} onClick={() => this.props.dispatch(login())}>
//                       <FormattedMessage id="login" />
//                     </a>
//                     {" "}<FormattedMessage id="organization-events-prompt" /></p>
//                     </div>);
//         }
//         if (events.isFetching && user) {
//             return <h1>{`Fetching events for user ${user.id}`}</h1>
//         }
//         if (events.fetchComplete) {
//             return (
//                     <div className="container">
//                     <h1><FormattedMessage id="organization-events"/></h1>
//                     <FilterableEventTable events={events.items} apiErrorMsg={''} />
//                     </div>
//             )
//         }
//         return null;
//     }
// }
