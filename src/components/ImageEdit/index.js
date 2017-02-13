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
            name: "",
            photographerName: "",
            license: "cc_by"
        }
    }

    handleImagePost() {
        let data = new FormData()
        if(this.props.imageFile) {
            data.append('image', this.props.imageFile)
        } else {
            data.append('url', this.props.thumbnailUrl)
        }
        data.append("name", this.state.name)
        data.append("photographer_name", this.state.photographerName)
        data.append("license", this.state.license)
        this.props.dispatch(
            postImage(
                data,
                this.props.user
            )
        )
        this.props.close()
    }

    handleTextChange(e, key) {
        this.setState({[key]: e.target.value})
    }
    render() {
        return (
            <Modal
                id="image-modal"
                show={true}
                onHide={() => this.props.close()}
                aria-labelledby="ModalHeader"
                width="600px"
             >
               <Modal.Header>
                    <RaisedButton
                        label="Sulje"
                        onClick={() => this.props.close()}
                        style={{float:"right"}}
                        primary={true}
                    />
                    <h3>Kuvan tiedot</h3>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={() => this.handleImagePost()} className="row">
                        <div className="col-sm-8 edit-form">
                            <div className="hel-text-field">
                                <label className="hel-label">Kuvateksti (korkeintaan 160 merkkiä)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => this.handleTextChange(e, "name")}
                                    value={this.state.name}
                                />
                            </div>
                            <div className="hel-text-field">
                                <label className="hel-label">Kuvaaja</label>
                                <input type="text" className="form-control" onChange={(e) => this.handleTextChange(e, "photographerName")} value={this.state.photographerName} />
                            </div>
                            <h4>Kuvan lisenssi</h4>
                            <div className="form-check">
                                <label className="edit-label">
                                    <input value="cc_by" checked={this.state.license === "cc_by"}  onChange={() => this.setState({license: "cc_by"})} type="radio" className="form-check-input" />
                                    Creative Commons BY 4.0
                                </label>
                                <label className="edit-label">
                                    <input value="event_only" checked={this.state.license === "event_only"} onChange={() => this.setState({license: "event_only"})} type="radio" className="form-check-input" />
                                    Käyttö rajattu tapahtuman yhteyteen
                                </label>
                            </div>
                        </div>
                        <img className="col-sm-4 edit-form form-image" src={this.props.thumbnailUrl} />
                        <button type="submit" className="col-sm-12 btn btn-save-image-data">Tallenna tiedot</button>

                    </form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default connect((state) =>({
    user: state.user,
    editor: state.editor,
    images: state.images
}))(injectIntl(ImageEdit))
