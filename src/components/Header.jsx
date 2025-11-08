import React from 'react';
import { Link } from 'react-router-dom';
import MainmenuList from './MainmenuList';
import './scss/header.scss';
import GnbWrap from './GnbWrap';
import Depth1 from './Depth1';

const Header = () => {
    return (
        <header>
            <div className="wide_inner">
                <div className="header_left">
                    <h1 className="logo">
                        <Link to="/">
                            <img src="./images/crocs_logo.svg" alt="crocs logo" />
                        </Link>
                    </h1>
                    <nav>
                        <MainmenuList />
                        <Depth1 />
                    </nav>
                </div>
                <div className="header_right">
                    <GnbWrap />
                </div>
            </div>
        </header>
    );
};

export default Header;
