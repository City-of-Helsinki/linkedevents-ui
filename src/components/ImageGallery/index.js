import '!style!css!sass!./index.scss'
import '!style!css!../../../node_modules/react-bootstrap-modal/lib/styles/rbm-complete.css'

import React from 'react';
import { FormattedMessage } from 'react-intl'
import Modal from 'react-bootstrap-modal'
import { RaisedButton } from 'material-ui'
import { uploadImage, setData } from 'src/actions/editor.js'

class ImageGallery extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false
        }
    }

    handleClick(event) {
        this.hiddenFileInput.click()
    }

    handleUpload(event) {
        let self = this
        let file = event.target.files[0]
        let data = new FormData()
        data.append('image', file)
        if(file && (file.type === 'image/jpeg' || file.type === 'image/png' )) {
            this.props.dispatch(uploadImage(data, this.props.user, this.closeGalleryModal));
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

        let chosenImg = this.props.editor.previewImg || ''
        return (
            <div className="image-upload" onClick={() => this.openGalleryModal()}>
                <img src={chosenImg} ref={(ref) => this.imagePreview = ref} />
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
                        <Modal.Title id='ModalHeader'><FormattedMessage id="organization-pictures"/></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Kuvat näkyvät tässä</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <input onChange={(e) => this.handleUpload(e)} style={{ display: 'none' }} type="file" ref={(ref) => this.hiddenFileInput = ref} />
                        <RaisedButton
                            label= "Upload"
                            primary= {true}
                            onClick={(e) => this.handleClick(e)}
                        />
                        <RaisedButton
                            label={<FormattedMessage id="cancel"/>}
                            onClick={() => this.saveAndClose()}
                        />
                    </Modal.Footer>
                </Modal>
                { this.props.children }
            </div>
        )
    }
}

export default ImageGallery;
