import React from 'react';
import './Footer.scss';

import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

const Footer = () => {
    return (
        <footer className='main-footer' aria-label='Footer'>
            <div className='container'>
                <div className='row'>
                    <div className='footer-list'>
                        <div className='col-md-3 col-sm-6'>
                            <Link to='/accessibility'>Saavutettavuusseloste</Link>
                        </div>
                    </div>
                </div>
                <div className='footer-logo'></div>
            </div>
        </footer>
    );
};

export default Footer;
