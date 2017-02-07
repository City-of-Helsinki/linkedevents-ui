import '!style!css!sass!./index.scss'

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl'
import Modal from 'react-bootstrap/lib/Modal';
import { RaisedButton } from 'material-ui'
import { postImage, postImageWithURL, deleteImage } from 'src/actions/userImages.js'
import { connect } from 'react-redux'
import { get as getIfExists, isEmpty } from 'lodash'
import FormFields from '../FormFields'
import ImageGalleryGrid from '../ImageGalleryGrid'
import { confirmAction } from 'src/actions/app.js'
import { getStringWithLocale } from 'src/utils/locale'

class ImageEdit extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }

    handleImageDataSave() {
        // Save image data
    }

    closeGalleryModal() {
        this.setState({ open: false })
    }
    openGalleryModal() {
        this.setState({ open: true })
    }

    render() {
        return (
            <div className="name edit-image" onClick={() => this.openGalleryModal()}>Edit image<i className="material-icons">&#xE869;</i>

                <Modal
                    id="image-modal"
                    show={this.state.open}
                    onHide={() => this.closeGalleryModal()}
                    aria-labelledby="ModalHeader"
                    width="600px"
                 >
                   <Modal.Body>
                        <RaisedButton
                            label="Sulje"
                            onClick={() => this.closeGalleryModal()}
                            style={{float:"right"}}
                            primary={true}
                        />
                        <h3>Kuvan tiedot</h3>
                        <div>
                            <div className="col-sm-8 edit-form">
                                <div className="hel-text-field">
                                    <label className="hel-label">Kuvateksti (korkeintaan 160 merkkiä)</label>
                                    <input type="text" className="form-control" />
                                </div>
                                <div className="hel-text-field">
                                    <label className="hel-label">Kuvaaja</label>
                                    <input type="text" className="form-control" />
                                </div>
                                <h4>Kuvan lisenssi</h4>
                                <div className="form-check">
                                    <label className="edit-label">
                                        <input type="checkbox" className="form-check-input" checked />
                                        Creative Commons BY 4.0
                                    </label>
                                    <label className="edit-label">
                                        <input type="checkbox" className="form-check-input" />
                                        Käyttö rajattu tapahtuman yhteyteen
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="col-sm-12 btn btn-save-image-data">Tallenna tiedot</button>
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
}))(injectIntl(ImageEdit))
