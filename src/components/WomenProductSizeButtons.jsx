import React, { useState } from 'react';
import WomenSizeButton from './WomenSizeButton';
import './scss/WomenProductSizeButtons.scss';

export default function WomenProductSizeButtons({ 
    sizes = ['210', '220', '230', '240', '250', '260', '265', '270', '280', '290', '300', '310'],
    soldOutSizes = [],
    onSizeSelect
}) {
    const [activeSize, setActiveSize] = useState(null);

    const handleSizeClick = (size) => {
        setActiveSize(size);
        onSizeSelect && onSizeSelect(size);
    };

    return (
        <div className="product-card__size">
            <div className="product-card__size__title--wrap">
                <p className="product-card__size--title">사이즈</p>
            </div>
            <ul className="product-card__size--btns__wrap size-menu__wrap--size">
                {sizes.map((size) => (
                    <WomenSizeButton
                        key={size}
                        size={size}
                        isActive={activeSize === size}
                        isSoldOut={soldOutSizes.includes(size)}
                        onClick={handleSizeClick}
                    />
                ))}
            </ul>
        </div>
    );
}
