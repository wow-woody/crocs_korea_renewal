import React from 'react';
import ProductCardSwiper from './ProductCardSwiper';
import ProductName from './ProductName';
import ProductPrice from './ProductPrice';
import ProductColorBadges from './ProductColorBadges';
import ProductSizeButtons from './ProductSizeButtons';
import './scss/WomenComponents.scss';

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
                <ProductCardSwiper images={product.images} />
                <ProductName name={product.name} />
                <ProductPrice price={product.price} />
                <ProductColorBadges 
                    colors={product.colors}
                    onColorClick={handleColorClick}
                />
                <ProductSizeButtons 
                    sizes={product.sizes}
                    soldOutSizes={product.soldOutSizes || []}
                    onSizeSelect={handleSizeSelect}
                />
            </div>
        </li>
    );
}
