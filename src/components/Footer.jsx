import React from 'react';
import FooterTitle from './FooterTitle';
import FooterContents from './FooterContents';
import FooterBottom from './FooterBottom';
import './scss/Footer.scss';

const Footer = ({ onOpenCS }) => {
    return (
        <footer>
<<<<<<< HEAD
            <FooterTitle />
            <FooterContents />
=======
            <div className="footer_top">
                <FooterTitle />
                <FooterContents />
            </div>

>>>>>>> origin/Chae-A
            <FooterBottom onOpenCS={onOpenCS} />
        </footer>
    );
};

export default Footer;
