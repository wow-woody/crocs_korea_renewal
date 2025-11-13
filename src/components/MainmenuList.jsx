import React from 'react';
import { Link } from 'react-router-dom';

// 메인 메뉴 리스트
// new, women, men, kids, jibbitz, collabs

const menus = [
    { key: 'new', label: 'NEW' },
    { key: 'women', label: 'WOMEN' },
    { key: 'men', label: 'MEN' },
    { key: 'kids', label: 'KIDS' },
    { key: 'jibbitz', label: 'JIBBITZ' },
    { key: 'collabs', label: 'COLLABS' },
];

const MainmenuList = () => {
    return (
        <ul className="main_menu">
            {menus.map((menu) => (
                <li key={menu.key} className={menu.key}>
                    <Link to={`/${menu.key}`}>{menu.label}</Link>
                </li>
            ))}
        </ul>
    );
};

export default MainmenuList;
