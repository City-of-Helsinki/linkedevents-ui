import '!style!css!sass!./index.scss'

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl'
import Modal from 'react-bootstrap/lib/Modal';
import { RaisedButton } from 'material-ui'
import { postImage, postImageWithURL, deleteImage } from 'src/actions/userImages.js'
import { connect } from 'react-redux'
import { get as getIfExists, isEmpty } from 'lodash'

import ImageGalleryGrid from '../ImageGalleryGrid'

class ImagePicker extends React.Component {

    constructor(props) {
        super(props)

        // NB! WIP. "selected"-class of image thumbnails depends on these props
        // if(this.props.editor.values.image) {
        //     this.props.images.selected = this.props.editor.values.image
        // }

        this.state = {
            open: false
        }
    }

    clickHiddenUploadInput() {
        this.hiddenFileInput.click()
    }

    handleExternalImageSave() {
        this.props.dispatch(postImage(null, this.props.user, this.externalImageURL.value))
    }

    handleUpload(event) {
        let file = event.target.files[0]
        let data = new FormData()
        data.append('image', file)
        if(file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' )) {
            this.props.dispatch(postImage(data, this.props.user))
        }
    }

    handleDelete(event) {
        let selectedImage = this.props.editor.values.image
        if (!isEmpty(selectedImage)) {
            this.props.dispatch(deleteImage(selectedImage, this.props.user))
        }
    }

    closeGalleryModal() {
        this.setState({ open: false })
    }
    openGalleryModal() {
        this.setState({ open: true })
    }

    render() {
        let bgStyle = {backgroundImage: 'url(' + getIfExists(this.props.editor.values, 'image.url', '') + ')'}
        return (
            <div className="image-picker" onClick={() => this.openGalleryModal()}>
                <div>
                    <div className="img-preview" style={bgStyle} />
                    <div>
                        <i className="material-icons">&#xE2C6;</i>
                    </div>
                    <label>
                        <FormattedMessage id="choose-image"/>
                    </label>
                </div>

                <Modal
                    id="image-modal"
                    show={this.state.open}
                    onHide={() => this.closeGalleryModal()}
                    aria-labelledby="ModalHeader"
                    width="600px"
                 >
                    <Modal.Header>
                        <RaisedButton
                            label={<FormattedMessage id="ready"/>}
                            onClick={() => this.closeGalleryModal()}
                            style={{float:"right"}}
                            primary={true}
                        />

                        <Modal.Title id='ModalHeader'><FormattedMessage id="new-image" /></Modal.Title>
                        <br />
                        <input onChange={(e) => this.handleUpload(e)} style={{ display: 'none' }} type="file" ref={(ref) => this.hiddenFileInput = ref} />
                        <RaisedButton
                            label= {<FormattedMessage id="upload-image" />}
                            onClick={() => this.clickHiddenUploadInput()}
                            primary={true}
                            style={{margin:"0 0 15px 0"}}
                        />
                        <br />
                        <FormattedMessage id="use-external-image-url" />
                        <br />
                        <input id="externalImageURL" onSubmit={this.handleExternalImageSave} placeholder={"URL"} ref={(ref) => this.externalImageURL = ref} />
                        <RaisedButton
                            label="OK"
                            onClick={() => this.handleExternalImageSave()}
                            style={{margin:"0 0 0 10px"}}
                        />
                    </Modal.Header>

                    <Modal.Body>
                        <Modal.Title id='ModalBodyTitle'><FormattedMessage id="use-existing-image"/></Modal.Title>
                        <ImageGalleryGrid editor={this.props.editor} user={this.props.user} images={this.props.images} />
                        <div style={{clear:'both'}} />
                    </Modal.Body>

                    <Modal.Footer>
                        <RaisedButton
                            label={<FormattedMessage id="delete"/>}
                            onClick={() => this.handleDelete()}
                            primary={false}
                            style={{margin:"0 10px 0 0"}}
                            disabled={isEmpty(this.props.editor.values.image)}
                        />
                        <RaisedButton
                            label={<FormattedMessage id="ready"/>}
                            onClick={() => this.closeGalleryModal()}
                            primary={true}
                        />
                    </Modal.Footer>

                </Modal>
                { this.props.children }
            </div>
        )
    }
}

export default connect((state) =>({
    user: state.user,
    editor: state.editor,
    images: state.images
}))(injectIntl(ImagePicker))
