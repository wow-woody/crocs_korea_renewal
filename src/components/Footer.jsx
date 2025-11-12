import React from 'react';
import FooterTitle from './FooterTitle';
import FooterContents from './FooterContents';
import FooterBottom from './FooterBottom';
import './scss/Footer.scss';

const Footer = () => {
    return (
        <footer>
            <FooterTitle />
            <FooterContents />
            <FooterBottom />
        </footer>
    );
};

export default Footer;
