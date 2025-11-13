import React from 'react';
import { Link } from 'react-router-dom';

const FooterBottom = () => {
    return (
        <>
            <div className="footer_bottom">
                <div className="wide_inner">
                    <Link to="/cscenter">CS Center</Link>{' '}
                    <Link to="/companyinfo">
                        <span>INFO</span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default FooterBottom;
