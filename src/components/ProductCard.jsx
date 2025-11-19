<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { useCrocsSizeStore } from '../store/useCrocsSizeStore';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './scss/WomenComponents.scss';
import './scss/leftNavigation.scss';

// 이미지 슬라이더
const ProductCardSwiper = ({ images }) => {
    const swiperRef = useRef(null);

    const imgList = Array.isArray(images)
        ? images
        : images
        ? [images] // 문자열 또는 객체라도 배열로 변환됨
        : [];

    useEffect(() => {
        if (!imgList.length) return;

        const swiper = new Swiper(swiperRef.current, {
            modules: [Navigation, Pagination],
            // loop: true,
            loop: imgList.length > 1, // 슬라이드가 1개 이상일 때만 loop
            pagination: { el: '.swiper-pagination', type: 'progressbar' },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        });

        return () => swiper.destroy(true, true);
    }, [imgList]);

    return (
        <div className="product-card__img_wrap swiper" ref={swiperRef}>
            <div className="swiper-wrapper">
                {imgList.map((img, i) => (
                    <div className="swiper-slide" key={i}>
                        <img
                            src={typeof img === 'string' ? img : img.src}
                            alt={`상품 이미지 ${i + 1}`}
                            className="product-card__img"
                        />
                    </div>
                ))}
            </div>
            <div
                className="swiper-button-prev product-card__arrow_left"
                onClick={(e) => e.stopPropagation()}
            />
            <div
                className="swiper-button-next product-card__arrow_right"
                onClick={(e) => e.stopPropagation()}
            />
            <div className="swiper-pagination product-card__pagination" />
        </div>
    );
};

// ---------- 상품명 ----------
const ProductName = ({ name }) => (
    <div className="product-card__name--wrap">
        <p style={{ whiteSpace: 'pre-line' }}>{name}</p>
    </div>
);

// ---------- 가격 ----------
const ProductPrice = ({ prices }) => {
    if (!prices || !Array.isArray(prices) || !prices[0]) return null;
    const [originalPrice, discountPrice, discountRate] = prices;
    const hasDiscount = discountPrice != null;

    return (
        <div className="product-card__price_wrap">
            {hasDiscount ? (
                <>
                    <div className="discount-price">
                        {discountPrice}
                        {discountRate && ` (${discountRate} 할인)`}
                    </div>
                    <div className="original-price" style={{ textDecoration: 'line-through' }}>
                        {originalPrice}
                    </div>
                </>
            ) : (
                <div className="original-price">{originalPrice}</div>
            )}
        </div>
    );
};

// ---------- 색상 ----------
const normalizeColor = (c) => {
    if (!c) return null;
    if (c.startsWith('rgb')) return c;
    if (c.match(/^\d+\s*,/)) return `rgb(${c})`;
    if (c.startsWith('#')) return c;
    return null;
};

const ProductColorBadges = ({ colors = [], onColorClick }) => {
    const normalized = (Array.isArray(colors) ? colors : [colors])
        .map(normalizeColor)
        .filter(Boolean);

    // 컬러가 하나도 없으면 렌더링하지 않음
    if (normalized.length === 0) return null;

    return (
        <div className="product-card__color">
            <div className="product-card__color__title--wrap">
                <p>색상</p>
            </div>
            <div className="color-badge__wrap">
                {normalized.map((color, i) => (
                    <button
                        key={i}
                        className="color-badge"
                        style={{ background: color }}
                        onClick={() => onColorClick?.(color)}
                    />
                ))}
            </div>
        </div>
    );
};

// ---------- 사이즈 ----------
const ProductSizeButtons = ({ cate, soldOutSizes = [], onSizeSelect }) => {
    const { crocsSizesByCategory, onFetchSize } = useCrocsSizeStore();
    const [active, setActive] = useState(null);

    useEffect(() => {
        if (!crocsSizesByCategory || Object.keys(crocsSizesByCategory).length === 0) {
            onFetchSize();
        }
    }, [crocsSizesByCategory, onFetchSize]);

    // cate 안에 특정 단어가 포함되어 있는지 체크
    let categoryId = null;
    if (cate?.includes('여성')) categoryId = 'women';
    else if (cate?.includes('남성')) categoryId = 'men';
    else if (cate?.includes('키즈')) categoryId = 'kids';

    console.log('cate:', cate);
    console.log('categoryId:', categoryId);

    const sizes = crocsSizesByCategory[categoryId] || [];

    return (
        <div className="product-card__size">
            <div className="product-card__size__title--wrap">
                <p>사이즈</p>
            </div>
            <ul className="product-card__size--btns__wrap">
                {sizes.map((size) => {
                    const soldOut = soldOutSizes.includes(size);
                    const isActive = active === size;

                    return (
                        <li key={size} className="size--btns__item">
                            <button
                                className={`size--btns__button ${isActive ? 'active' : ''} ${
                                    soldOut ? 'sold-out' : ''
                                }`}
                                onClick={() => {
                                    if (!soldOut) {
                                        setActive(size);
                                        onSizeSelect?.(size);
                                    }
                                }}
                                disabled={soldOut}
                            >
                                {size}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

// ---------- 상품 카드 ----------
const ProductCard = ({ product, onClick, onSizeSelect }) => (
    <li className="product-card" onClick={onClick}>
        <ProductCardSwiper images={product.product_img || []} />
        <ProductName name={product.product} />
        <ProductPrice prices={product.prices} />
        <ProductColorBadges
            colors={product.color || []}
            onColorClick={(c) => console.log('색상 선택:', c)}
        />
        <ProductSizeButtons
            cate={product.cate} // 여기서 cate 값을 전달
            soldOutSizes={product.soldOutSizes || []}
            onSizeSelect={onSizeSelect} // 🔥 상위 상태로 전달
        />
    </li>
);

export default ProductCard;
=======
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
>>>>>>> a61aa1d (2025-11-19(수) 여성 페이지 파일명 변경 및 scss 파일 한개의 파일로 통합 -  v01)
