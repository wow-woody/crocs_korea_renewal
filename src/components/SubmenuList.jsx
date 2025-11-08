import React from 'react';
import { Link } from 'react-router-dom';

const submenus = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'NEW' },
    { key: 'women', label: 'WOMEN' },
    { key: 'men', label: 'MEN' },
    { key: 'kids', label: 'KIDS' },
    { key: 'jibbitz', label: 'JIBBITZ' },
    { key: 'collabs', label: 'COLLABS' },
];

const SubmenuList = () => {
    return (
        <ul className="submenu">
            {submenus.map((submenu) => (
                <li key={submenu.key} className={submenu.key}>
                    <Link to={`/${submenu.key}`}>{submenu.label}</Link>
                </li>
            ))}
        </ul>
    );
};

export default SubmenuList;
