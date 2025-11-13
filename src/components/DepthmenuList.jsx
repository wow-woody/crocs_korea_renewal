import React from 'react';
import { Link } from 'react-router-dom';

const depthmenus = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'NEW' },
    { key: 'women', label: 'WOMEN' },
    { key: 'men', label: 'MEN' },
    { key: 'kids', label: 'KIDS' },
    { key: 'jibbitz', label: 'JIBBITZ' },
    { key: 'collabs', label: 'COLLABS' },
];

const DepthmenuList = () => {
    return (
        <ul className="depthmenu">
            {depthmenus.map((depthmenu) => (
                <li key={depthmenu.key} className={depthmenu.key}>
                    <Link to={`/${depthmenu.key}`}>{depthmenu.label}</Link>
                </li>
            ))}
        </ul>
    );
};

export default DepthmenuList;
