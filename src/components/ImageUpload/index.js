import '!style!css!sass!./index.scss'

import React from 'react';
import { FormattedMessage } from 'react-intl'

class ImageUpload extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            previewImg: null
        }
    }

    handleClick(event) {
        this.hiddenFileInput.click()
    }

    handleUpload(event) {
        let self = this
        let file = event.target.files[0]
        if(file && (file.type === 'image/jpeg' || file.type === 'image/png' )) {
            var reader = new FileReader();

            reader.onload = (function(theFile) {
                return function(e) {
                    self.imagePreview.src =  e.target.result;
                };
            })(file);

            // Read in the image file as a data URL.
            reader.readAsDataURL(file);
        }
    }

    render() {
        return (
            <div className="image-upload" onClick={(e) => this.handleClick(e)}>
                <input onChange={(e) => this.handleUpload(e)} style={{ display: 'none' }} type="file" ref={(ref) => this.hiddenFileInput = ref} />
                <img src={this.state.previewImg} ref={(ref) => this.imagePreview = ref} />
                <div>
                    <div>
                        <i className="material-icons">&#xE2C6;</i>
                    </div>
                    <label>
                        <FormattedMessage id="upload-picture"/>
                    </label>
                </div>
                { this.props.children }
            </div>
        )
    }
}

export default ImageUpload;
