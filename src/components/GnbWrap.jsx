import React from 'react';
import GnbLeft from './GnbLeft';
import GnbRight from './GnbRight';

const GnbWrap = ({ onSearchClick, onCartClick }) => {
    return (
        <div className="gnb_wrap">
            <GnbLeft />
            <GnbRight onSearchClick={onSearchClick} onCartClick={onCartClick} />
        </div>
    );
};

export default GnbWrap;
