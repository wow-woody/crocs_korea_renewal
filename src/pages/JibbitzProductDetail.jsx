// ⭐ CrocsProductDetail 디자인을 그대로 사용하면서
// ⭐ Jibbitz 데이터(product)를 적용한 버전

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../components/scss/ProductDetail.scss';
import './scss/CrocsProductDetail.scss';
import './scss/ProductPage_flat.scss';

import { collaboAuthStore } from '../store/collaboAuthStore';
import { wishListStore } from '../store/wishListStore';

import Title from '../components/Title';
import WishAddPopup from '../components/WishAddPopup';

const JibbitzProductDetail = () => {
    const { id } = useParams();
    const { jibbitzItems } = collaboAuthStore();
    const { onAddWishList, onProductAddCart, wishLists } = wishListStore();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);

    const increaseQty = () => setQuantity((q) => q + 1);
    const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    // 가격 숫자로 변환
    const parseNumber = useCallback((p) => {
        if (!p) return 0;
        return Number(String(p).replace(/[^0-9]/g, ''));
    }, []);

    // 총액 계산
    const price = product ? parseNumber(product.discountPrice || product.price) : 0;
    const totalPrice = price * quantity;

    useEffect(() => {
        if (!id || jibbitzItems.length === 0) return;
        const target = jibbitzItems.find((i) => String(i.id) === String(id));
        setProduct(target);
    }, [id, jibbitzItems]);

    if (!product) return <div>상품 정보를 불러오고 있습니다...</div>;

    // 이미지 배열로 통일
    const images = [product.imageUrl];

    return (
        <div className="sub_page">
            <div className="inner">
                <Title title="ProductDetail" />
                <div className="product-detail-wrap">
                    <div className="product-img-info">
                        <div className="product-img-info__wrap">
                            <div className="product-img">
                                {/* 작은 크럼브 */}
                                <div className="product-img__crumbs-wrap">
                                    <ul className="product-img__crumbs">
                                        <li className="product-img__crumb product-img__crumb--home">
                                            <a href="/" className="product-img__link">
                                                <img
                                                    className="product-img__icon"
                                                    src="/images/Sub_Women_Images/icon-close_cross.svg"
                                                    alt="홈"
                                                />
                                            </a>
                                        </li>
                                        <li className="product-img__sep">:</li>
                                        <li className="product-img__crumb">
                                            {product.category || 'jibbitz'}
                                        </li>
                                        <li className="product-img__sep">:</li>
                                        <li className="product-img__crumb product-img__crumb--current">
                                            {product.title}
                                        </li>
                                    </ul>
                                </div>

                                {/* 메인 이미지 */}
                                <div className="product-img__main-wrap">
                                    <ul className="product-img__list product-img__list--main">
                                        <li>
                                            <img
                                                className="product-img__img"
                                                src={images[selectedImageIdx]}
                                                alt={product.title}
                                            />
                                        </li>
                                    </ul>
                                </div>

                                {/* 썸네일 리스트 */}
                                <div className="product-img__thumbs-wrap">
                                    <div
                                        className="thumbs__ctrl thumbs__ctrl--top"
                                        aria-hidden="true"
                                    ></div>

                                    <ul className="product-img__thumbs-list">
                                        {images.map((img, idx) => (
                                            <li key={idx} className="product-img__thumbs-item">
                                                <button
                                                    type="button"
                                                    className="product-img__thumbs-link"
                                                    onClick={() => setSelectedImageIdx(idx)}
                                                >
                                                    <img
                                                        className="product-img__thumbs-img"
                                                        src={img}
                                                        alt="지비츠 썸네일"
                                                        style={
                                                            selectedImageIdx === idx
                                                                ? {
                                                                      filter: 'brightness(1.05)',
                                                                      transform: 'scale(1.05)',
                                                                  }
                                                                : {}
                                                        }
                                                    />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

                                    <div
                                        className="thumbs__ctrl thumbs__ctrl--bottom"
                                        aria-hidden="true"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 구매 영역 (Crocs 스타일 그대로 적용) */}
                    <div className="select-buy">
                        <div className="select-buy__wrap">
                            {/* 가격 영역 */}
                            <div className="select-buy__title_wrap">
                                <p className="select-buy__subtitle">Jibbitz</p>
                                <h2 className="select-buy__title">{product.title}</h2>

                                <div className="select-buy__price">
                                    <span className="select-buy__price_dc_rate">
                                        ₩{price.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="select-buy__breadcrumbs"></div>

                            {/* 수량 */}
                            <div className="select-buy__selected--wrap">
                                <div className="select-buy__select">
                                    <div className="select-buy__select-wrap">
                                        <span className="select-buy__select_chose-item-name">
                                            {product.title}
                                        </span>
                                    </div>

                                    <div className="select-buy__select__count-wrap">
                                        <div className="select-buy__select__count">
                                            <div className="select-buy__select__count-value-wrap">
                                                <p className="select-buy__select__count-value">
                                                    <span>{quantity}</span>
                                                </p>
                                            </div>

                                            <div className="select-buy__select__wrap">
                                                <button
                                                    className="select-buy__select__count-btn select-buy__select__count-btn--increase"
                                                    onClick={increaseQty}
                                                >
                                                    <img
                                                        src="/images/icon-arrow-up_bold-1.svg"
                                                        alt=""
                                                    />
                                                </button>
                                                <button
                                                    className="select-buy__select__count-btn select-buy__select__count-btn--decrease"
                                                    onClick={decreaseQty}
                                                    disabled={quantity <= 1}
                                                >
                                                    <img
                                                        src="/images/icon-arrow-down_bold-1.svg"
                                                        alt=""
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 총 금액 */}
                            <div className="select-buy__breadcrumbs"></div>

                            <div className="select-buy__total-wrap">
                                <p>총 상품 금액</p>
                                <div className="select-buy__total-price-wrap">
                                    <p className="total-price">₩{totalPrice.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="select-buy__breadcrumbs"></div>

                            {/* 버튼 */}
                            <div className="select-buy__buy-btns-wrap">
                                <button
                                    className="select-buy__buy-btns__btn-like"
                                    onClick={() => onAddWishList(product)}
                                >
                                    💚
                                </button>

                                <WishAddPopup />

                                <button
                                    className="select-buy__buy-btn select-buy__buy-btn--add-cart"
                                    onClick={() =>
                                        onProductAddCart({
                                            ...product,
                                            quantity,
                                            price,
                                            product_img: product.imageUrl,
                                        })
                                    }
                                >
                                    장바구니
                                </button>

                                <button className="select-buy__buy-btn select-buy__buy-btn--buy-now">
                                    구매하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JibbitzProductDetail;

// import React, { useEffect, useState } from 'react';
// import '../components/scss/ProductDetail.scss';
// import './scss/CrocsProductDetail.scss';
// import './scss/ProductPage_flat.scss';
// import { collaboAuthStore } from '../store/collaboAuthStore';
// import { wishListStore } from '../store/wishListStore';
// import { useParams } from 'react-router-dom';
// import JibbitzProductImage from '../components/JibbitzProductImage';
// import JibbitzProductInfo from '../components/JibbitzProductInfo';

// const JibbitzProductDetail = () => {
//     const { id } = useParams();
//     const { disneyItems, jibbitzItems } = collaboAuthStore();
//     const { onAddWishList } = wishListStore();

//     //찾은 상품을 저장할 변수
//     const [product, setProduct] = useState(null);

//     useEffect(() => {
//         if (!id || jibbitzItems.length === 0) return;
//         //선택된 제품 찾기
//         const findItem = jibbitzItems.find((item) => String(item.id) === String(id));
//         setProduct(findItem);
//     }, [id, jibbitzItems]);

//     if (!product) {
//         return <div>상품 정보를 불러오고 있으니 기다리</div>;
//     }
//     return (
//         <div className="sub_page">
//             <div className="inner">
//                 <div className="product-detail-page">
//                     <JibbitzProductImage product={product} />
//                     <JibbitzProductInfo product={product} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default JibbitzProductDetail;
