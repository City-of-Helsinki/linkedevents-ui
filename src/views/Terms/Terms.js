import './Terms.scss'

import React from 'react'
import {FormattedMessage} from 'react-intl'

const Terms = () => (
    <div className="container terms-page">
        <h1><FormattedMessage id={'terms-heading'} /></h1>
        <p>some filler text, that can be easily replaced later.</p>
    </div>
)

export default Terms
