import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCrocsProductStore } from '../store/useCrocsProductStore';
import { wishListStore } from '../store/wishListStore';
import Title from '../components/Title';
import WishAddPopup from '../components/WishAddPopup';
import { useCrocsSizeStore } from '../store/useCrocsSizeStore';
// CrocsProductDetail 스타일 적용 (BEM 클래스 대응)
import './scss/CrocsProductDetail.scss';
import './scss/ProductPage_flat.scss';

const CrocsProductDetail_v02 = () => {
    const { id } = useParams();
    const { crocsItems, onFetchItems } = useCrocsProductStore();
    const { crocsSizesByCategory, onFetchSize } = useCrocsSizeStore();
    const { onAddWishList } = wishListStore();

    const [CrocsProduct, setCrocsProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState('brown');
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const [likeActive, setLikeActive] = useState(false);

    const [openJibbitz, setOpenJibbitz] = useState(false);
    const [openDesc, setOpenDesc] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);
    const [openReview, setOpenReview] = useState(false);

    const jibbitzItems = [
        { id: 1, name: '지비츠 참 A', price: '₩4,900', img: '/images/ProductPage/imgi_53_crocs.avif' },
        { id: 2, name: '지비츠 참 B', price: '₩5,900', img: '/images/ProductPage/imgi_54_crocs.avif' },
        { id: 3, name: '지비츠 참 C', price: '₩6,900', img: '/images/ProductPage/imgi_55_crocs.avif' }
    ];

    const colorOptions = [
        { key: 'black', label: '블랙' },
        { key: 'brown', label: '브라운' },
        { key: 'pink', label: '핑크' },
        { key: 'green', label: '그린' },
        { key: 'blue', label: '블루' }
    ];

    const parsePriceNumber = useCallback((p) => {
        if (!p) return 0;
        const num = String(p).replace(/[^0-9]/g, '');
        return Number(num || 0);
    }, []);

    const salePriceNumber = parsePriceNumber(CrocsProduct?.prices?.[0]);
    const originalPriceNumber = parsePriceNumber(CrocsProduct?.prices?.[1]);
    const hasOriginal = originalPriceNumber > 0 && originalPriceNumber > salePriceNumber;
    const discountPercent = hasOriginal
        ? Math.round(((originalPriceNumber - salePriceNumber) / originalPriceNumber) * 100)
        : null;
    const totalPrice = salePriceNumber * quantity;

    const increaseQty = () => setQuantity((q) => q + 1);
    const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
    const handleColorSelect = (c) => setSelectedColor(c);

    useEffect(() => {
        onFetchItems();
        onFetchSize();
    }, [onFetchItems, onFetchSize]);

    useEffect(() => {
        if (!id || crocsItems.length === 0) return;
        const findCrocsItem = crocsItems.find((item) => String(item.id) === String(id));
        setCrocsProduct(findCrocsItem);
    }, [id, crocsItems]);

    if (!CrocsProduct) {
        return <div>상품 정보를 불러오고 있으니 기다려주세요.</div>;
    }

    const normalizeCate = (cate) => {
        if (!cate) return 'women';
        const c = cate.split(',')[0].trim().toLowerCase();
        if (c.includes('men') || c.includes('남성') || c.includes('man')) return 'men';
        if (c.includes('women') || c.includes('여성') || c.includes('woman')) return 'women';
        if (c.includes('kid') || c.includes('아동') || c.includes('주니어')) return 'kids';
        return 'women';
    };

    const mainCate = normalizeCate(CrocsProduct.cate);
    const categorySizes = crocsSizesByCategory[mainCate] || [];
    const images = Array.isArray(CrocsProduct.product_img)
        ? CrocsProduct.product_img
        : String(CrocsProduct.product_img).split(',').map((v) => v.trim()).filter(Boolean);

    return (
        <div className="sub_page">
            <div className="inner">
                <Title title="ProductDetail" />
                <section className="product-img-info__wrap">
                    <div className="product-img">
                        <div className="product-img__crumbs-wrap">
                            <ul className="product-img__crumbs">
                                <li className="product-img__crumb product-img__crumb--home">
                                    <Link to="/" className="product-img__link" aria-label="홈">
                                        <img className="product-img__icon" src="/images/Sub_Women_Images/icon-home.svg" alt="홈" />
                                    </Link>
                                </li>
                                <li className="product-img__sep"><span>:</span></li>
                                <li className="product-img__crumb product-img__crumb--category">
                                    <button type="button" className="product-img__link" aria-label="카테고리">
                                        <span className="product-img__text">{mainCate}</span>
                                        <img className="product-img__icon" src="/images/Sub_Women_Images/icon-arrow-right.svg" alt="카테고리" />
                                    </button>
                                </li>
                                <li className="product-img__sep"><span>:</span></li>
                                <li className="product-img__crumb product-img__crumb--current">
                                    <button type="button" className="product-img__link" aria-current="page" aria-label="현재 상품">
                                        <span className="product-img__text">{CrocsProduct.product}</span>
                                        <img className="product-img__icon" src="/images/Sub_Women_Images/icon-close_cross.svg" alt="닫기" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className="product-img__main-wrap">
                            <ul className="product-img__list product-img__list--main">
                                <li className="product-img__item">
                                    <img
                                        className="product-img__img"
                                        src={images[selectedImageIdx]}
                                        alt={CrocsProduct.product}
                                    />
                                </li>
                            </ul>
                        </div>

                        <div className="product-img__thumbs-wrap">
                            <div className="thumbs__ctrl thumbs__ctrl--top">
                                <button type="button" className="thumbs__btn thumbs__btn--up" disabled>
                                    <img className="thumbs__icon" src="/images/icon-arrow-up-hairline.svg" alt="위로" />
                                </button>
                            </div>
                            <ul className="product-img__thumbs-list">
                                {images.map((img, idx) => (
                                    <li key={idx} className="product-img__thumbs-item">
                                        <button
                                            type="button"
                                            className="product-img__thumbs-link"
                                            onClick={() => setSelectedImageIdx(idx)}
                                        >
                                            <img className="product-img__thumbs-img" src={img} alt={`썸네일 ${idx + 1}`} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="thumbs__ctrl thumbs__ctrl--bottom">
                                <button type="button" className="thumbs__btn thumbs__btn--down">
                                    <img className="thumbs__icon" src="/images/icon-arrow-down-hairline.svg" alt="아래로" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <section className="select-buy">
                        <div className="select-buy__wrap">
                            <div className="select-buy__title_wrap">
                                <p className="select-buy__subtitle">Classic Unforgettable Suede Clog</p>
                                <h2 className="select-buy__title">{CrocsProduct.product}</h2>
                                <div className="select-buy__price">
                                    {hasOriginal && (
                                        <>
                                            <span className="select-buy__price_dc_rate">{discountPercent}%</span>
                                            <span className="select-buy__price_original">₩{originalPriceNumber.toLocaleString()}</span>
                                        </>
                                    )}
                                    <span className="select-buy__price_sale">₩{salePriceNumber.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="select-buy__color-wrap">
                                <p className="select-buy__color-title">색상</p>
                                <ul className="select-buy__color-list">
                                    {colorOptions.map((color) => (
                                        <li key={color.key} className="select-buy__color-item">
                                            <button
                                                type="button"
                                                className={`select-buy__color-btn ${selectedColor === color.key ? 'selected' : ''}`}
                                                onClick={() => handleColorSelect(color.key)}
                                            >
                                                <span className={`info__color-badge buy__color-badge--${color.key}`}></span>
                                                <span className="select-buy__color-name">{color.label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="select-buy__size-wrap">
                                <p className="select-buy__size-title">사이즈</p>
                                <ul className="select-buy__size-list">
                                    {categorySizes.map((size) => (
                                        <li key={size}>
                                            <button
                                                type="button"
                                                className={`select-buy__size-btn ${selectedSize === size ? 'selected' : ''}`}
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="select-buy__size-notice-wrap">
                                    <span>원하는 옵션이 없으신가요?</span>
                                    <div>
                                        <Link to="#">
                                            <img src="/images/icon-bell.svg" alt="재입고 알림" />
                                            <span>재입고 알림 신청하기</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {selectedSize && (
                                <div className="select-buy__selected--wrap">
                                    <div className="select-buy__select">
                                        <div className="select-buy__select-wrap">
                                            <div className="select-buy__select_chose-item">
                                                <span className={`info__color-badge buy__color-badge--${selectedColor}`}></span>
                                                <span className="select-buy__select_chose-item-name">{CrocsProduct.product}</span>
                                            </div>
                                            <span className="select-buy__price_breadcrumbs__line"></span>
                                            <span className="select-buy__select_chose-item-option">{selectedSize}</span>
                                        </div>
                                        <div className="select-buy__select__count-wrap">
                                            <div className="select-buy__select__count">
                                                <div className="select-buy__select__count-value-wrap">
                                                    <p className="select-buy__select__count-value"><span>{quantity}</span></p>
                                                </div>
                                                <div className="select-buy__select__wrap">
                                                    <button
                                                        type="button"
                                                        className="select-buy__select__count-btn select-buy__select__count-btn--increase"
                                                        onClick={increaseQty}
                                                    >
                                                        <img src="/images/icon-arrow-up_bold-1.svg" alt="수량 증가" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="select-buy__select__count-btn select-buy__select__count-btn--decrease"
                                                        onClick={decreaseQty}
                                                    >
                                                        <img src="/images/icon-arrow-down_bold-1.svg" alt="수량 감소" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="select-buy__select__del">
                                            <button type="button" className="select-buy__select__del-btn">
                                                <img src="/images/ProductPage/icon-delete.svg" alt="삭제" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedSize && (
                                <>
                                    <div className="select-buy__breadcrumbs"></div>
                                    <div className="select-buy__total-wrap">
                                        <div className="select-buy__total-title">
                                            <p>총 상품 금액</p>
                                        </div>
                                        <div className="select-buy__total-content">
                                            <div className="select-buy__total-number-wrap">
                                                <p className="select-buy__total-number">
                                                    <span>{quantity}</span>
                                                    <span>개</span>
                                                </p>
                                                <span className="select-buy__total-bar">|</span>
                                                <p className="select-buy__total-price">
                                                    <span>₩{totalPrice.toLocaleString()}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="select-buy__buy-btns-wrap">
                                <div
                                    className="select-buy__buy-btns__btn-like"
                                    role="button"
                                    aria-pressed={likeActive}
                                    tabIndex={0}
                                    onClick={() => setLikeActive((v) => !v)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setLikeActive((v) => !v);
                                        }
                                    }}
                                >
                                    <p className="select-buy__buy-btns__btn-like_line" style={likeActive ? { display: 'none' } : {}}>
                                        <img src="/images/ProductPage/icon-love_line.svg" alt="좋아요 비활성" />
                                    </p>
                                    <p className="select-buy__buy-btns__btn-like_fill" style={likeActive ? {} : { display: 'none' }}>
                                        <img src="/images/ProductPage/icon-love_fill.svg" alt="좋아요 활성" />
                                    </p>
                                </div>
                                <button className="select-buy__buy-btn select-buy__buy-btn--add-cart" type="button">장바구니</button>
                                <button className="select-buy__buy-btn select-buy__buy-btn--buy-now" type="button">구매하기</button>
                            </div>
                        </div>
                    </section>
                </section>
            </div>
        </div>
    );
};

export default CrocsProductDetail_v02;
