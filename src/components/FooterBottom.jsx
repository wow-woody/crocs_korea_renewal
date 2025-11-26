import React from 'react';
import { Link } from 'react-router-dom';

const FooterBottom = ({ onOpenCS }) => {
    return (
        <>
            <div className="footer_bottom">
                <div className="wide_inner">
                    <button onClick={onOpenCS}>CS Center</button>
<<<<<<< HEAD
                    <Link to="/companyinfo">
=======
                    <button>
>>>>>>> origin/Chae-A
                        <span>INFO</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default FooterBottom;
