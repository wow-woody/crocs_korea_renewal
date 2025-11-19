import React, { useState, useRef, useEffect } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './scss/WomenComponents.scss';

// 이미지 슬라이더
const ProductCardSwiper = ({ images = [] }) => {
    const swiperRef = useRef(null);

    useEffect(() => {
        const swiper = new Swiper(swiperRef.current, {
            modules: [Navigation, Pagination],
            loop: true,
            pagination: { el: '.swiper-pagination', type: 'progressbar' },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
        });
        return () => swiper.destroy(true, true);
    }, []);

    return (
        <div className="product-card__img_wrap swiper" ref={swiperRef}>
            <div className="swiper-wrapper">
                {images.map((img, i) => (
                    <div className="swiper-slide" key={i}>
                        <a href="#" className="product-card__link">
                            <img src={img.src} alt={img.alt || `상품 이미지 ${i + 1}`} className="product-card__img" />
                        </a>
                    </div>
                ))}
            </div>
            <div className="swiper-button-prev product-card__arrow_left" />
            <div className="swiper-button-next product-card__arrow_right" />
            <div className="swiper-pagination product-card__pagination" />
        </div>
    );
};

// 상품명
const ProductName = ({ name }) => (
    <div className="product-card__name--warp">
        <p style={{ whiteSpace: 'pre-line' }}>{name}</p>
    </div>
);

// 가격
const ProductPrice = ({ price: { discountedPrice, discountRate, originalPrice } }) => (
    <div className="product-card__price_wrap">
        <div className="product-card__price">
            <span className="product-card__price_dc_rate">{discountedPrice.toLocaleString()}</span>
            <span className="product-card__price_breadcrumbs__line" />
            <span className="product-card__price_slel">{discountRate}%</span>
            <span className="product-card__price_breadcrumbs__line" />
            <span className="product-card__price_cost">{originalPrice.toLocaleString()}</span>
        </div>
    </div>
);

// 색상 선택
const ProductColorBadges = ({ colors = [], onColorClick }) => (
    <div className="product-card__color">
        <div className="product-card__color__title--wrap">
            <p>색상</p>
        </div>
        <div className="color-badge__wrap">
            {colors.map((color, i) => (
                <span 
                    key={i}
                    className={`color-badge color-badge--${color}`}
                    onClick={() => onColorClick?.(color)}
                    role="button"
                    tabIndex={0}
                />
            ))}
        </div>
    </div>
);

// 사이즈 선택
const ProductSizeButtons = ({ sizes, soldOutSizes = [], onSizeSelect }) => {
    const [active, setActive] = useState(null);

    return (
        <div className="product-card__size">
            <div className="product-card__size__title--wrap">
                <p>사이즈</p>
            </div>
            <ul className="product-card__size--btns__wrap">
                {sizes.map(size => {
                    const soldOut = soldOutSizes.includes(size);
                    const isActive = active === size;
                    
                    return (
                        <li key={size} className="size--btns__item">
                            {soldOut ? (
                                <span className="size--btns__link sold-out">
                                    <span className="size--btns__button">{size}</span>
                                    <span className="sold-out-line" />
                                </span>
                            ) : (
                                <a 
                                    href="#" 
                                    className={`size--btns__link btn-menu-style ${isActive ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActive(size);
                                        onSizeSelect?.(size);
                                    }}
                                >
                                    <button className="size--btns__button btn-menu__button">{size}</button>
                                </a>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

// 상품 카드
const WomenProductCard = ({ product }) => (
    <li className="product-card">
        <div className="product-card__img_info_wrap">
            <ProductCardSwiper images={product.images} />
            <ProductName name={product.name} />
            <ProductPrice price={product.price} />
            <ProductColorBadges 
                colors={product.colors} 
                onColorClick={(c) => console.log('색상:', c)} 
            />
            <ProductSizeButtons 
                sizes={product.sizes} 
                soldOutSizes={product.soldOutSizes || []} 
                onSizeSelect={(s) => console.log('사이즈:', s)} 
            />
        </div>
    </li>
);

export default WomenProductCard;
