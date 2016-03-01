import React from 'react';
import { get as getIfExists } from 'lodash'
import { connect } from 'react-redux'
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
        // save the id of the selected image of this event (or editor values)
        let selected_id = getIfExists(this.props.editor.values, 'image.id', null)

        // show latest modified at top
        let sorted = this.props.images.items.sort((a,b) => {
            let date_a = new Date(a.last_modified_time)
            let date_b = new Date(b.last_modified_time)
            return date_b - date_a
        })

        // build the classes for the thumbnails
        let imgs = this.props.images.items.map((img) => {
            let selected = selected_id == img.id
            return (
                <ImageThumbnail selected={selected} key={img.id} url={img.url} data={img} />
            )
        })

        // ...and finally check if there is no image for this event to be able to set the class
        let selected = selected_id == null
        // unsift == prepend
        imgs.unshift(<ImageThumbnail selected={selected} key={0} empty={true} url="" data={{}}/>)

        return (
            <div className="image-grid container-fluid">
                <div className="row">
                    {imgs}
                    <div className="clearfix" />
                </div>
            </div>
        )
    }
}

export default connect()(ImageGalleryGrid)
