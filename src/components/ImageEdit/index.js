import '!style-loader!css-loader!sass-loader!./index.scss'

import React from 'react';
import {injectIntl} from 'react-intl'
import Modal from 'react-bootstrap/lib/Modal';
import {Button} from 'material-ui'
import {postImage, deleteImage} from 'src/actions/userImages.js'
import {connect} from 'react-redux'
import FormFields from '../FormFields'
import HelTextField from '../HelFormFields/HelTextField'

class ImageEdit extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      updateExisting: this.props.updateExisting || false,
      name: this.props.defaultName || '',
      photographerName: this.props.defaultPhotographerName || '',
      license: this.props.license || 'cc_by',
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
    this.props.dispatch(
      postImage(
        data,
        this.props.user,
        this.state.updateExisting ? this.props.id : null
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
                <label className="hel-label">Kuvateksti (korkeintaan 160 merkkiä)</label>
                <HelTextField
                  onChange={(e) => this.handleTextChange(e, 'name')}
                  defaultValue={this.state.name}
                  validations={['shortString']}
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

export default connect((state) =>({
  user: state.user,
  editor: state.editor,
  images: state.images,
}))(injectIntl(ImageEdit))
