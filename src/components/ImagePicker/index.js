import './index.scss'

import React from 'react';
import PropTypes from 'prop-types'

import {FormattedMessage, injectIntl} from 'react-intl'
import Modal from 'react-bootstrap/lib/Modal';
import {Button} from 'material-ui'
import {deleteImage} from 'src/actions/userImages.js'
import {connect} from 'react-redux'
import {get as getIfExists, isEmpty} from 'lodash'
import ImageEdit from '../ImageEdit'
import ImageGalleryGrid from '../ImageGalleryGrid'
import {confirmAction} from 'src/actions/app.js'
import {getStringWithLocale} from 'src/utils/locale'

export class ImagePicker extends React.Component {

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
            thumbnailUrl: null,
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
                        additionalMsg: selectedImage.name,
                        additionalMarkup: ' ',
                    }
                )
            )
        }
    }

    closeGalleryModal() {
        this.setState({open: false})
    }
    openGalleryModal() {
        this.setState({open: true})
    }

    render() {
        let bgStyle = {backgroundImage: 'url(' + getIfExists(this.props.editor.values, 'image.url', '') + ')'}
        return (
            <div className="image-picker">
                <div>
                    <div className="img-preview" style={bgStyle} onClick={() => this.openGalleryModal()}/>
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
                        <button
                            onClick={() => this.closeGalleryModal()}
                            className='close'
                            data-dismiss='modal'
                            aria-label='Close'
                        ><span aria-hidden="true">&times;</span>
                        </button>

                        <Modal.Title id='ModalHeader'><FormattedMessage id="new-image" /></Modal.Title>
                        
                        <input onChange={(e) => this.handleUpload(e)} style={{display: 'none'}} type="file" ref={(ref) => this.hiddenFileInput = ref} />
                        <Button
                            className={'upload-img'}
                            raised
                            onClick={() => this.clickHiddenUploadInput()}
                            color="primary">
                            <FormattedMessage id="upload-image" />
                        </Button>
                        
                        <div className={'external-file-upload'}>
                            <div className="hel-text-field">
                                <label className="hel-label">Tai syötä ulkoisen kuvan osoite (url)</label>
                                <input id="externalImageURL" className="form-control" onSubmit={this.handleExternalImageSave} ref={(ref) => this.externalImageURL = ref}/>
                            </div>
                            <Button
                                className={'attach-external'}
                                raised
                                color={'primary'}
                                onClick={() => this.handleExternalImageSave()}><FormattedMessage id="attach-image-to-event"/>
                            </Button>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Modal.Title id='ModalBodyTitle'><FormattedMessage id="use-existing-image"/></Modal.Title>
    
                        <div className={'button-row'}>
                            <Button
                                className={'delete'}
                                color={'accent'}
                                raised
                                onClick={() => this.handleDelete()}
                                primary={'false'}
                                disabled={isEmpty(this.props.editor.values.image)}><FormattedMessage id="delete-from-filesystem"/>
                            </Button>
    
                            <div className={'wrapper-right'}>
                                <Button
                                    className={'edit'}
                                    raised
                                    primary={'false'}
                                    disabled={isEmpty(this.props.editor.values.image)}><FormattedMessage id="edit-selected-image"/>
                                </Button>
                                <Button
                                    className={'attach'}
                                    raised
                                    onClick={() => this.closeGalleryModal()}
                                    color="primary"><FormattedMessage id="attach-image-to-event"/>
                                </Button>
                            </div>
                        </div>
                        
                        <ImageGalleryGrid editor={this.props.editor} user={this.props.user} images={this.props.images} />
                        <div style={{clear:'both'}} />
                    </Modal.Body>
                    <Modal.Footer>
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

ImagePicker.defaultProps = {
    editor: {
        values: {},
    },
    images: {},
    user: {},
}

ImagePicker.propTypes = {
    editor: PropTypes.object,
    user: PropTypes.object,
    images: PropTypes.object,
    children: PropTypes.element,
    dispatch: PropTypes.func,
}

const mapStateToProps = (state) => ({
    user: state.user,
    editor: state.editor,
    images: state.images,
})

export default connect(mapStateToProps)(injectIntl(ImagePicker))
