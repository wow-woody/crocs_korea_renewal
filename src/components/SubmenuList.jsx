import React from 'react';
import { Link } from 'react-router-dom';

const submenus = [
    { key: 'new', label: 'NEW', imgUrl: './images/item_01.png' },
    { key: 'women', label: 'WOMEN', imgUrl: './images/item_01.png' },
    { key: 'men', label: 'MEN', imgUrl: './images/item_01.png' },
    { key: 'kids', label: 'KIDS', imgUrl: './images/item_01.png' },
    { key: 'jibbitz', label: 'JIBBITZ', imgUrl: './images/item_01.png' },
    { key: 'collabs', label: 'COLLABS', imgUrl: './images/item_01.png' },
];

const SubmenuList = () => {
    return (
        <div className="submenu_wrap">
            <ul className="submenu">
                {submenus.map((submenu) => (
                    <li key={submenu.key}>
                        <Link to={`/${submenu.key}`}>
                            <img src={submenu.imgUrl} alt={submenu.key} />
                            <span>{submenu.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubmenuList;
