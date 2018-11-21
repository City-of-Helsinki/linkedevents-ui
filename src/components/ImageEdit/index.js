import '!style-loader!css-loader!sass-loader!./index.scss'

import React from 'react';
import PropTypes from 'prop-types'
import {injectIntl, FormattedMessage} from 'react-intl'
import {Modal} from 'react-bootstrap';
import {Button} from 'material-ui'
import {connect} from 'react-redux'

import FormFields from '../FormFields'
import HelTextField from '../HelFormFields/HelTextField'

import CONSTANTS from '../../constants' 
import {postImage as postImageAction} from 'src/actions/userImages'

class ImageEdit extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            updateExisting: this.props.updateExisting || false,
            name: this.props.defaultName || '',
            photographerName: this.props.defaultPhotographerName || '',
            license: this.props.license || 'cc_by',
        }
    }

    handleImagePost() {
        let data = new FormData()
        if(!this.state.updateExisting) {
            if(this.props.imageFile) {
                data.append('image', this.props.imageFile)
            } else {
                data.append('url', this.props.thumbnailUrl)
            }
        }
        data.append('name', this.state.name)
        data.append('photographer_name', this.state.photographerName)
        data.append('license', this.state.license)
        this.props.postImage(
            data,
            this.props.user,
            this.state.updateExisting ? this.props.id : null
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
                    <Button
                        raised
                        onClick={() => this.props.close()}
                        style={{float:'right'}}
                        color="primary">Sulje</Button>
                    <h3>Kuvan tiedot</h3>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={() => this.handleImagePost()} className="row">
                        <div className="col-sm-8 edit-form">
                            <div className="hel-text-field">
                                <label className="hel-label">
                                    <FormattedMessage id={'image-caption-limit'} values={{limit:CONSTANTS.CHARACTER_LIMIT.SHORT_STRING}}/>
                                </label>
                                <HelTextField
                                    onChange={(e) => this.handleTextChange(e, 'name')}
                                    defaultValue={this.state.name}
                                    validations={[CONSTANTS.VALIDATION_RULES.SHORT_STRING]}
                                />
                            </div>
                            <div className="hel-text-field">
                                <label className="hel-label">Kuvaaja</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => this.handleTextChange(e, 'photographerName')}
                                    defaultValue={this.state.photographerName}
                                />
                            </div>
                            <h4>Kuvan lisenssi</h4>
                            <div className="form-check">
                                <label className="edit-label">
                                    <input value="cc_by" checked={this.state.license === 'cc_by'}  onChange={() => this.setState({license: 'cc_by'})} type="radio" className="form-check-input" />
                                    Creative Commons BY 4.0
                                </label>
                                <label className="edit-label">
                                    <input value="event_only" checked={this.state.license === 'event_only'} onChange={() => this.setState({license: 'event_only'})} type="radio" className="form-check-input" />
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
ImageEdit.propTypes = {
    updateExisting: PropTypes.bool,
    defaultName: PropTypes.string,
    defaultPhotographerName: PropTypes.string,
    license: PropTypes.string,
    imageFile: PropTypes.object,
    thumbnailUrl: PropTypes.string,
    postImage: PropTypes.func,
    user: PropTypes.object,
    id: PropTypes.number,
    close: PropTypes.func,
}

const mapStateToProps = (state) => ({
    user: state.user,
    editor: state.editor,
    images: state.images,
})
const mapDispatchToProps = (dispatch) => ({
    postImage: (data, user, id) => dispatch(postImageAction(data, user, id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ImageEdit))
