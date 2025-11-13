import React from 'react';
import DepthmenuList from './DepthmenuList';
import SubmenuList from './SubmenuList';

const Depth1 = () => {
    return (
        <div className="depth_wrap">
            <div className="depth1">
                <div className="depth1_left">
                    <DepthmenuList />
                </div>
                <div className="depth1_right">
                    <SubmenuList />
                </div>
            </div>
        </div>
    );
};

export default Depth1;
