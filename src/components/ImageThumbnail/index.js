import '!style!css!sass!./index.scss'

import React from 'react'
import { connect } from 'react-redux'
import { selectImage } from 'src/actions/userImages'

class ImageThumbnail extends React.Component {

    constructor(props) {
        super(props)
    }

    selectThis() {
        console.log(this.props.data)
        this.props.dispatch(selectImage(this.props.data))
    }

    render() {
        let classname = this.props.selected ? "image-thumbnail selected" : "image-thumbnail"
        return (
            <div className={classname} onClick={() => this.selectThis()} id={this.props.data.id}>
                <img src={this.props.url} />
            </div>
        )
    }
}

export default connect()(ImageThumbnail)
