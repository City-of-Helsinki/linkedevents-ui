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
        let classname = this.props.selected ? "col-md-4 col-xs-6 thumb selected" : "col-md-4 col-xs-6 thumb"

        if(this.props.empty) {
            classname += ' no-image'
            return (
                <div className={classname} onClick={() => this.selectThis()} id={this.props.data.id}>
                    <div className="thumbnail">
                        <p className="no-image-text"><FormattedMessage id="no-image" /></p>
                    </div>
                </div>
            )
        }

        return (
            <div className={classname} onClick={() => this.selectThis()} id={this.props.data.id}>
                <div className="thumbnail">
                    <img src={this.props.url} />
                    <p>{this.props.data.name}</p>
                </div>
            </div>
        )
    }
}

export default connect()(injectIntl(ImageThumbnail))
