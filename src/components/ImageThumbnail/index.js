import '!style-loader!css-loader!sass-loader!./index.scss'

import React from 'react'
import PropTypes from 'prop-types'

import {FormattedMessage, injectIntl} from 'react-intl'
import {connect} from 'react-redux'
import {selectImage as selectImageAction} from 'src/actions/userImages'
import ImageEdit from '../ImageEdit'

class ImageThumbnail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            edit: false,
        }

        this.selectThis = this.selectThis.bind(this)
    }

    selectThis() {
        this.props.selectImage(this.props.data)
    }

    render() {
    // let classname = this.props.selected ? "col-md-6 col-xs-6 selected" : "col-md-6 col-xs-6"
        let classname = this.props.selected ? 'image-thumb selected' : 'image-thumb'

        if(this.props.empty) {
            classname += ' no-image'
            return (
                <div className="col-md-3 col-xs-12" onClick={this.selectThis} id={this.props.data.id}>
                    <div className={classname}>
                        <div className="thumbnail" style={{backgroundColor: 'lightgray'}} />
                        <div className="no-image-text"><FormattedMessage id="no-image" /></div>
                    </div>
                </div>
            )
        }

        let bgStyle = {backgroundImage: 'url(' + this.props.url + ')'}

        return (
            <div className="col-md-3 col-xs-12" onClick={this.selectThis} id={this.props.data.id}>
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
ImageThumbnail.propTypes = {
    data: PropTypes.object,
    selected: PropTypes.bool,
    empty: PropTypes.bool,
    url: PropTypes.string,
    selectImage: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => ({
    selectImage: (data) => dispatch(selectImageAction(data)),
})

const mapStateToProps = () => ({})
// TODO: if leave null, react-intl not refresh. Replace this with better React context
export default connect(mapStateToProps, mapDispatchToProps)(ImageThumbnail)
