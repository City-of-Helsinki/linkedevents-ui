import '!style!css!sass!./index.scss'
import '!style!css!../../../node_modules/react-bootstrap-modal/lib/styles/rbm-complete.css'

import React from 'react';
import { FormattedMessage } from 'react-intl'
import Modal from 'react-bootstrap-modal'
import { RaisedButton } from 'material-ui'

class ImageGallery extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            chosenImg: null,
            open: false
        }
    }

    render() {
        let closeGalleryModal = () => this.setState({ open: false })
        let openGalleryModal = () => this.setState({ open: true })

        let saveAndClose = () => {
            // api.saveData()
            //     .then(() => this.setState({ open: false }))
            this.setState({ open: false })
        }

        // let buttonStyle = {
        //     height: '22px',
        //     margin: '0 10px'
        // }

        return (
            <div className="image-gallery" onClick={openGalleryModal}>
                <div>
                    <img src={this.state.previewImg} ref={(ref) => this.imagePreview = ref} />
                    <i className="material-icons">&#xE3B6;</i>
                    <label>
                        <FormattedMessage id="choose-picture"/>
                    </label>
                </div>

                <Modal
                    show={this.state.open}
                    onHide={closeGalleryModal}
                    aria-labelledby="ModalHeader"
                 >
                    <Modal.Header closeButton>
                        <Modal.Title id='ModalHeader'><FormattedMessage id="organization-pictures"/></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Kuvat näkyvät tässä</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <RaisedButton
                            label={<FormattedMessage id="cancel"/>}
                            onClick={saveAndClose}
                        />
                    </Modal.Footer>
                </Modal>
                { this.props.children }
            </div>
        )
    }
}

export default ImageGallery;
