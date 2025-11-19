import React from 'react';
import ColorBadge from './ColorBadge';
import './scss/WomenComponents.scss';

export default function WomenProductColorBadges({ colors = [], onColorClick }) {
    return (
        <div className="product-card__color">
            <div className="product-card__color__title--wrap">
                <p className="product-card__color__title">색상</p>
            </div>
            <div className="color-badge__wrap">
                {colors.map((color, index) => (
                    <ColorBadge 
                        key={index} 
                        color={color}
                        onClick={() => onColorClick && onColorClick(color)}
                    />
                ))}
            </div>
        </div>
    );
}
