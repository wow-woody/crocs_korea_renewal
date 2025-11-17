import React from 'react';
import './scss/WomenSizeButton.scss';

export default function WomenSizeButton({ size, isActive, onClick, isSoldOut = false }) {
    if (isSoldOut) {
        return (
            <li className="size--btns__item">
                <span className="size--btns__link sold-out">
                    <span className="size--btns__button">{size}</span>
                    <span className="sold-out-line"></span>
                </span>
            </li>
        );
    }

    return (
        <li className="size--btns__item">
            <a 
                href="#" 
                className={`size--btns__link btn-menu-style ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                    e.preventDefault();
                    onClick && onClick(size);
                }}
            >
                <button className="size--btns__button btn-menu__button">{size}</button>
            </a>
        </li>
    );
}
