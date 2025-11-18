import React from 'react';
import './scss/WomenColorBadge.scss';

export default function WomenColorBadge({ color, onClick }) {
    return (
        <span 
            className={`color-badge color-badge--${color}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
        ></span>
    );
}
