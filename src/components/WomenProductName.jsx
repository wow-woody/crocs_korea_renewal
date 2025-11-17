import React from 'react';
import './scss/WomenProductName.scss';

export default function WomenProductName({ name }) {
    return (
        <div className="product-card__name--warp">
            <p className="product-card__name">{name}</p>
        </div>
    );
}
