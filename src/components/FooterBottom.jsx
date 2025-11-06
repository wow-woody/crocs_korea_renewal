import React from 'react';
import './scss/FooterBottom.scss';
import { Link } from 'react-router-dom';

const FooterBottom = () => {
    return (
        <>
            <div className="footer_bottom">
                <Link to="/cscenter">CS Center</Link>{' '}
                <Link to="/companyinfo">
                    <span>INFO</span>
                </Link>
            </div>
        </>
    );
};

export default FooterBottom;
