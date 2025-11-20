import React, { useState } from 'react';
import DepthmenuList from './DepthmenuList';
import SubmenuList from './SubmenuList';
import { menuList } from '../store/menuList';
import './scss/depth1.scss';

const Depth1 = () => {
    // 서브메뉴 상태 저장
    const [activeMenu, setActiveMenu] = useState('all');

    const currentMenu = menuList.find((m) => m.key === activeMenu);

    return (
        <div className="depth_wrap">
            <div className="depth1">
                <div className="depth1_left">
                    <DepthmenuList activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                </div>
                <div className="depth1_right">
                    <SubmenuList mainmenu={currentMenu} submenus={currentMenu?.submenu_list} />
                </div>
            </div>
        </div>
    );
};

export default Depth1;
