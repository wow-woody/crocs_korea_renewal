import React from 'react';
import './scss/WomenProductPrice.scss';

export default function WomenProductPrice({ price }) {
    const { discountedPrice, discountRate, originalPrice } = price;
    
    return (
        <div className="product-card__price_wrap">
            <div className="product-card__price">
                <span className="product-card__price_dc_rate">{discountedPrice.toLocaleString()}</span>
                <span className="product-card__price_breadcrumbs__line"></span>
                <span className="product-card__price_slel">{discountRate}%</span>
                <span className="product-card__price_breadcrumbs__line"></span>
                <span className="product-card__price_cost">{originalPrice.toLocaleString()}</span>
            </div>
        </div>
    );
}
