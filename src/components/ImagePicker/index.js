import '!style!css!sass!./index.scss'
import '!style!css!../../../node_modules/react-bootstrap-modal/lib/styles/rbm-complete.css'

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl'
import Modal from 'react-bootstrap-modal'
import { RaisedButton } from 'material-ui'
import { postImage, postImageWithURL } from 'src/actions/userImages.js'
import { connect } from 'react-redux'

import ImageGalleryGrid from '../ImageGalleryGrid'

class ImagePicker extends React.Component {

    constructor(props) {
        super(props)

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

    closeGalleryModal() {
        this.setState({ open: false })
    }
    openGalleryModal() {
        this.setState({ open: true })
    }

    saveAndClose() {
        // api.saveData()
        //     .then(() => this.setState({ open: false }))
        this.setState({ open: false })
    }

    render() {
        let selectedImage = ''
        if(("image" in this.props.editor.values)
            && (null !== this.props.editor.values.image)
            && ("url" in this.props.editor.values.image)) {
            selectedImage = this.props.editor.values.image.url
        }
        return (
            <div className="image-picker" onClick={() => this.openGalleryModal()}>
                <img src={selectedImage} ref={(ref) => this.imagePreview = ref} />
                <div>
                    <div>
                        <i className="material-icons">&#xE2C6;</i>
                    </div>
                    <label>
                        <FormattedMessage id="choose-picture"/>
                    </label>
                </div>

                <Modal
                    show={this.state.open}
                    onHide={() => this.closeGalleryModal()}
                    aria-labelledby="ModalHeader"
                 >
                    <Modal.Header closeButton>
                        <Modal.Title id='ModalHeader'>Uusi kuva</Modal.Title>
                        <br />
                        <input onChange={(e) => this.handleUpload(e)} style={{ display: 'none' }} type="file" ref={(ref) => this.hiddenFileInput = ref} />
                        <RaisedButton
                            label= "Lataa kuva kovalevyltäsi"
                            primary= {true}
                            onClick={() => this.clickHiddenUploadInput()}
                            style={{margin:"0 0 15px 0"}}
                        />
                        <br />
                        tai käytä kuvaa ulkoisessa osoitteessa:
                        <br />
                        <input id="externalImageURL" onSubmit={this.handleExternalImageSave} placeholder={"ulkoinen URL"} ref={(ref) => this.externalImageURL = ref} />
                        <RaisedButton
                            label="OK"
                            onClick={() => this.handleExternalImageSave()}
                            style={{margin:"0 0 0 10px"}}
                        />
                    </Modal.Header>

                    <Modal.Body>
                        <Modal.Title id='ModalBodyTitle'>Käytä järjestelmässä olemassaolevaa kuvaa</Modal.Title>
                        <ImageGalleryGrid user={this.props.user} images={this.props.images} />
                        <div style={{clear:'both'}} />
                    </Modal.Body>

                    <Modal.Footer>
                        <RaisedButton
                            label={<FormattedMessage id="ready"/>}
                            onClick={() => this.saveAndClose()}
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
