import React, { useState, useCallback } from 'react';
import './scss/ProductDetail.scss';
import { wishListStore } from '../store/wishListStore';
import WishAddPopup from './WishAddPopup';
// import CartAddPopup from './CartAddPopup';

const JibbitzProductInfo = ({ product }) => {
    const [count, setCount] = useState(1);
    const { wishLists, onAddWishList, onProductAddCart } = wishListStore();

    const onHeart = wishLists.some((item) => item.id === product.id);
    // const isWish = popUp.message.includes('위시리스트');

    const handleIncrease = useCallback(() => {
        setCount((prevCount) => prevCount + 1);
    }, []);

    const handleDecrease = useCallback(() => {
        setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
    }, []);

    return (
        <div className="product-info__wrap" aria-labelledby="product-title">
            <div className="product-info">
                <div className="product-info__title_wrap">
                    <p className="product-info__subtitle">
                        {product.title.includes('세트') ? 'Jibbitz pack' : 'Jibbitz single'}
                    </p>
                    <h2 className="product-info__title">{product.title}</h2>
                    <div className="product-info__price">
                        <span className="product-info__price_dc_rate">
                            {product?.discountPrice || product?.price}
                        </span>
                        <span className="product-info__price_breadcrumbs__line"></span>
                        <span className="product-info__price_sale">
                            {product.discountPrice !== '' ? product.discountPercent : ''}
                        </span>
                        <span className="product-info__price_breadcrumbs__line"></span>
                        <span className="product-info__price_cost">
                            {product.discountPrice !== '' ? product?.price : ''}
                        </span>
                    </div>
                </div>
                <div className="product-info__snswish_wrap">
                    <div className="product-sns-wrap"></div>
                    <div className="product-wish-btn">
                        <p
                            className={`wish-btn ${onHeart ? 'active' : 'normal'}`}
                            onClick={() => onAddWishList(product)}
                        >
                            <img src="/images/icon-love_line.svg" alt="wishIcon" />
                        </p>
                        {/* <WishAddPopup /> */}
                        {/* <button onClick={() => onAddWishList(product)}>
                            <img src="/images/icon-love_line.svg" alt="wishIcon" />
                        </button> */}
                    </div>
                </div>

                <div className="product-info_breadcrumbs"></div>

                <div className="product-info_select">
                    <div className="product-info__wrap">
                        <div className="product-info-select_chose-item">
                            {/* <span
                                className={`info__color-badge info__color-badge--${selectedColor}`}
                            ></span> */}
                            <span className="product-info-select_chose-item-name">
                                {product.title}
                            </span>
                        </div>
                        {/* <span className="product-info__price_breadcrumbs__line"></span> */}
                        {/* <span className="product-info-select_chose-item-option">
                            {selectedSize}
                        </span> */}
                    </div>
                    <div className="product-info-select__count-wrap">
                        <div className="product-info-select__count">
                            <div className="product-info-select__count-value-wrap">
                                <p className="product-info-select__count-value">
                                    <span>{count}</span>
                                </p>
                                <div className="product-info-select__wrap">
                                    <button
                                        type="button"
                                        className="product-info-select__count-btn product-info-select__count-btn--increase"
                                        onClick={handleIncrease}
                                    >
                                        <span className="product-info-select__count-link product-info-select__count-link--disabled-1">
                                            <img
                                                src={`${process.env.PUBLIC_URL}/images/icon-arrow-up_bold-1.svg`}
                                                alt="수량 증가 버튼"
                                                className="count-btn__icon-1"
                                            />
                                        </span>
                                        <span className="product-info-select__count-link product-info-select__count-link--disabled-2">
                                            <img
                                                src={`${process.env.PUBLIC_URL}/images/icon-arrow-up_bold-2.svg`}
                                                alt="수량 증가 버튼 비활성화"
                                                className="count-btn__icon-2"
                                            />
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        className="product-info-select__count-btn product-info-select__count-btn--decrease"
                                        onClick={handleDecrease}
                                        disabled={count <= 1}
                                    >
                                        <span className="product-info-select__count-link product-info-select__count-link--disabled-1">
                                            <img
                                                src={`${process.env.PUBLIC_URL}/images/icon-arrow-down_bold-1.svg`}
                                                alt="수량 감소 버튼"
                                                className="count-btn__icon-1"
                                            />
                                        </span>
                                        <span className="product-info-select__count-link product-info-select__count-link--disabled-2">
                                            <img
                                                src={`${process.env.PUBLIC_URL}/images/icon-arrow-down_bold-2.svg`}
                                                alt="수량 감소 버튼 비활성화"
                                                className="count-btn__icon-2"
                                            />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product-info_breadcrumbs"></div>
                <div className="product-btn-wrap">
                    <button
                        className="product-btn-cart"
                        onClick={() => onProductAddCart(product, count)}
                    >
                        장바구니
                    </button>
                    <WishAddPopup />
                    <button className="product-btn-buy">구매하기</button>
                </div>
            </div>
        </div>
    );
};

export default JibbitzProductInfo;
