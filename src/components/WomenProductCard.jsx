import React from 'react';
import WomenProductCardSwiper from './WomenProductCardSwiper';
import WomenProductName from './WomenProductName';
import WomenProductPrice from './WomenProductPrice';
import WomenProductColorBadges from './WomenProductColorBadges';
import WomenProductSizeButtons from './WomenProductSizeButtons';
import './scss/WomenProductCard.scss';

export default function WomenProductCard({ product }) {
    const handleColorClick = (color) => {
        console.log('Selected color:', color);
    };

    const handleSizeSelect = (size) => {
        console.log('Selected size:', size);
    };

    return (
        <li className="product-card">
            <div className="product-card__img_info_wrap">
                <WomenProductCardSwiper images={product.images} />
                <WomenProductName name={product.name} />
                <WomenProductPrice price={product.price} />
                <WomenProductColorBadges 
                    colors={product.colors}
                    onColorClick={handleColorClick}
                />
                <WomenProductSizeButtons 
                    sizes={product.sizes}
                    soldOutSizes={product.soldOutSizes || []}
                    onSizeSelect={handleSizeSelect}
                />
            </div>
        </li>
    );
}
