import React from 'react';
import PropTypes from 'prop-types'

import {get as getIfExists} from 'lodash'
import {connect} from 'react-redux'
import {fetchUserImages as fetchUserImagesAction} from 'src/actions/userImages'
import ImageThumbnail from '../ImageThumbnail'

const ImagePagination = (props) => {
    console.log('ImagePagination props');
    console.log(props.responseMetadata);
    
    // TODO pass the next url to the fetch functionq
    
    return <nav aria-label='Page navigation example'>
        <ul className='pagination'>
            <li className='page-item'><a className='page-link' href='#'>Previous</a></li>
            <li className='page-item'><a className='page-link' href='#' onClick={() => alert('jess')}>1</a></li>
            <li className='page-item'><a className='page-link' href='#'>2</a></li>
            <li className='page-item'><a className='page-link' href='#'>3</a></li>
            <li className='page-item'><a className='page-link' href={props.responseMetadata.next}>Next</a></li>
        </ul>
    </nav>
}

class ImageGalleryGrid extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        console.log('component did mount')
        this.fetchImages();
    }

    componentDidUpdate() {
        console.log('component did update')
        
        const {fetchComplete, isFetching} = this.props.images
        if (fetchComplete || isFetching) {
            return;
        }
        this.fetchImages();
    }

    fetchImages() {
        if (this.props.user) {
            this.props.fetchUserImages(this.props.user, 100);
        }
    }

    render() {
    // save the id of the selected image of this event (or editor values)
        let selected_id = getIfExists(this.props.editor.values, 'image.id', null)
        
        // console.log(this.props)

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
            <div className='image-grid container-fluid'>
                <div className='row'>
                    {imgs}
                    <div className='clearfix' />
                </div>
    
                <ImagePagination responseMetadata={this.props.images.meta} />
            </div>
        )
    }
    
    // <ArchiveSorting returnedSelectValue={this.changeBlogPostType} defaultValue={"summary"}></ArchiveSorting>
}

ImageGalleryGrid.propTypes = {
    images: PropTypes.object,
    user: PropTypes.object,
    editor: PropTypes.object,
    fetchUserImages: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => ({
    fetchUserImages: (user, amount) => dispatch(fetchUserImagesAction(user, amount)),
})

const mapStateToProps = (state) => ({

})

ImagePagination.propTypes = {
    responseMetadata: PropTypes.object,
};

// TODO: if leave null, react-intl not refresh. Replace this with better React context
export default connect(mapStateToProps, mapDispatchToProps)(ImageGalleryGrid)
