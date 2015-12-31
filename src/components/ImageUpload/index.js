import '!style!css!sass!./index.scss'

import React from 'react';
import { FormattedMessage } from 'react-intl'

let ImageUpload = (props) => (
    <div className="image-upload">
        <div>
            <div>
                <i className="material-icons">&#xE2C6;</i>
            </div>
            <label>
                <FormattedMessage id="upload-picture"/>
            </label>
        </div>
        { props.children }
    </div>
)

export default ImageUpload;
