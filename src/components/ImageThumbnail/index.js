import '!style-loader!css-loader!sass-loader!./index.scss'

import React from 'react'
import {FormattedMessage, injectIntl} from 'react-intl'
import {connect} from 'react-redux'
import {selectImage} from 'src/actions/userImages'
import ImageEdit from '../ImageEdit'

class ImageThumbnail extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      edit: false,
    }
  }

  selectThis() {
    this.props.dispatch(selectImage(this.props.data))
  }

  render() {
    // let classname = this.props.selected ? "col-md-6 col-xs-6 selected" : "col-md-6 col-xs-6"
    let classname = this.props.selected ? 'image-thumb selected' : 'image-thumb'

    if(this.props.empty) {
      classname += ' no-image'
      return (
        <div className="col-md-3 col-xs-12" onClick={() => this.selectThis()} id={this.props.data.id}>
          <div className={classname}>
            <div className="thumbnail" style={{backgroundColor: 'lightgray'}} />
            <div className="no-image-text"><FormattedMessage id="no-image" /></div>
          </div>
        </div>
      )
    }

    let bgStyle = {backgroundImage: 'url(' + this.props.url + ')'}

    return (
      <div className="col-md-3 col-xs-12" onClick={() => this.selectThis()} id={this.props.data.id}>
        <div className={classname}>
          <div className="thumbnail" style={bgStyle} />
          <div className="name edit-image" onClick={() => this.setState({edit: true})}>{this.props.data.name || 'Edit image'}<i className="material-icons edit-icon">&#xE869;</i></div>
        </div>
        {   this.state.edit &&
                    <ImageEdit
                      id={this.props.data.id}
                      defaultName={this.props.data.name}
                      defaultPhotographerName={this.props.data.photographer_name}
                      thumbnailUrl={this.props.url}
                      license={this.props.data.license}
                      close={() => this.setState({edit: false})}
                      updateExisting
                    />
        }
      </div>
    )
  }
}

export default connect()(injectIntl(ImageThumbnail))
