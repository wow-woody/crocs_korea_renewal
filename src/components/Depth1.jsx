import React from 'react';
import SubmenuList from './SubmenuList';

const Depth1 = () => {
    return (
        <div className="depth_wrap">
            <div className="depth1">
                <div className="depth1_left">
                    <SubmenuList />
                </div>
                <div className="depth1_right"></div>
            </div>
        </div>
    );
};

export default Depth1;
