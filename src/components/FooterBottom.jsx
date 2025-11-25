import React from 'react';
import { Link } from 'react-router-dom';

const FooterBottom = ({ onOpenCS }) => {
    return (
        <>
            <div className="footer_bottom">
                <div className="wide_inner">
                    <button onClick={onOpenCS}>CS Center</button>
                    <Link to="/companyinfo">
                        <span>INFO</span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default FooterBottom;
