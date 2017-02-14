import '!style!css!sass!./index.scss'

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl'
import Modal from 'react-bootstrap/lib/Modal';
import { RaisedButton } from 'material-ui'
import { postImage, deleteImage } from 'src/actions/userImages.js'
import { connect } from 'react-redux'
import { get as getIfExists, isEmpty } from 'lodash'
import ImageEdit from '../ImageEdit'
import ImageGalleryGrid from '../ImageGalleryGrid'
import { confirmAction } from 'src/actions/app.js'
import { getStringWithLocale } from 'src/utils/locale'

class ImagePicker extends React.Component {

    constructor(props) {
        super(props)

        // NB! WIP. "selected"-class of image thumbnails depends on these props
        // if(this.props.editor.values.image) {
        //     this.props.images.selected = this.props.editor.values.image
        // }

        this.state = {
            open: false,
            edit: false,
            imageFile: null,
            thumbnailUrl: null
        }
    }

    clickHiddenUploadInput() {
        this.hiddenFileInput.click()
    }

    handleExternalImageSave() {
        this.setState({edit: true, imageFile: null, thumbnailUrl: this.externalImageURL.value})
    }

    handleUpload(event) {
        let file = event.target.files[0]
        let data = new FormData()
        data.append('image', file)
        if(file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' )) {
            this.setState({edit: true, imageFile: file, thumbnailUrl: window.URL.createObjectURL(file)})
        }
    }

    handleDelete(event) {
        let selectedImage = this.props.editor.values.image
        if (!isEmpty(selectedImage)) {
            this.props.dispatch(
                confirmAction(
                    'confirm-image-delete',
                    'warning',
                    'delete',
                    {
                        action: e => this.props.dispatch(deleteImage(selectedImage, this.props.user)),
                        additionalMsg: selectedImage.name
                    }
                )
            )
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
                {   this.state.edit &&
                    this.state.thumbnailUrl &&
                    <ImageEdit
                        imageFile={this.state.imageFile}
                        thumbnailUrl={this.state.thumbnailUrl}
                        close={() => this.setState({edit: false, open: false})}
                    />
                }
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
