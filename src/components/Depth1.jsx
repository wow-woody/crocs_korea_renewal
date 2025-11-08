import React from 'react';
import SubList from './SubList';

const Depth1 = () => {
    return (
        <div className="depth1">
            <div className="depth1_left">
                <SubList />
            </div>
            <div className="depth1_right"></div>
        </div>
    );
};

export default Depth1;
