import React from 'react';
import FooterTitle from './FooterTitle';
import FooterContents from './FooterContents';
import FooterBottom from './FooterBottom';
import './scss/Footer.scss';

const Footer = ({ onOpenCS }) => {
    return (
        <footer>
            <FooterTitle />
            <FooterContents />
            <FooterBottom onOpenCS={onOpenCS} />
        </footer>
    );
};

export default Footer;
