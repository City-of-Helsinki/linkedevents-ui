import '!style!css!sass!./index.scss'

import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { selectImage } from 'src/actions/userImages'

class ImageThumbnail extends React.Component {

    constructor(props) {
        super(props)
    }

    selectThis() {
        this.props.dispatch(selectImage(this.props.data))
    }

    render() {
        // let classname = this.props.selected ? "col-md-6 col-xs-6 selected" : "col-md-6 col-xs-6"
        let classname = this.props.selected ? "image-thumb selected" : "image-thumb"

        if(this.props.empty) {
            classname += ' no-image'
            return (
                <div className="col-md-6" onClick={() => this.selectThis()} id={this.props.data.id}>
                    <div className={classname}>
                        <div className="thumbnail" style={{backgroundColor: "lightgray"}} />
                        <div className="no-image-text"><FormattedMessage id="no-image" /></div>
                    </div>
                </div>
            )
        }

        let bgStyle = {backgroundImage: 'url(' + this.props.url + ')'}

        return (
            <div className="col-md-6" onClick={() => this.selectThis()} id={this.props.data.id}>
                <div className={classname}>
                    <div className="thumbnail" style={bgStyle} />
                    <div className="name">{this.props.data.name}</div>
                </div>
            </div>
        )
    }
}

export default connect()(injectIntl(ImageThumbnail))
