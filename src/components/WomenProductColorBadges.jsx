import React from 'react';
import WomenColorBadge from './WomenColorBadge';
import './scss/WomenProductColorBadges.scss';

export default function WomenProductColorBadges({ colors = [], onColorClick }) {
    return (
        <div className="product-card__color">
            <div className="product-card__color__title--wrap">
                <p className="product-card__color__title">색상</p>
            </div>
            <div className="color-badge__wrap">
                {colors.map((color, index) => (
                    <WomenColorBadge 
                        key={index} 
                        color={color}
                        onClick={() => onColorClick && onColorClick(color)}
                    />
                ))}
            </div>
        </div>
    );
}
