import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useCrocsProductStore } from '../store/useCrocsProductStore';
import { wishListStore } from '../store/wishListStore';
import { useCrocsSizeStore } from '../store/useCrocsSizeStore';
import Title from '../components/Title';
import '../pages/scss/CrocsProductDetail.scss';
import '../pages/scss/ProductPage_flat.scss';

function CrocsProductDetail_v02Copy() {
    const { id } = useParams();
    const { crocsItems = [], onFetchItems } = useCrocsProductStore();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const [likeActive, setLikeActive] = useState(false);
    const [openJibbitz, setOpenJibbitz] = useState(false);
    const [openDesc, setOpenDesc] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);
    const [openReview, setOpenReview] = useState(false);
    const { addItem } = wishListStore();
    const { crocsSizes = [], onFetchSize } = useCrocsSizeStore();

    useEffect(() => {
        if (Array.isArray(crocsItems) && crocsItems.length > 0) {
            const currentProduct = crocsItems.find((item) => String(item.id) === String(id));
            if (currentProduct) {
                setProduct(currentProduct);
                if (currentProduct.color) setSelectedColor(currentProduct.color);
            }
        }
    }, [id, crocsItems]);

    useEffect(() => {
        onFetchItems();
        onFetchSize();
    }, [onFetchItems, onFetchSize]);

    const handleQuantityChange = (delta) => {
        const newQty = quantity + delta;
        if (newQty >= 1) setQuantity(newQty);
    };

    const handleLikeClick = () => {
        if (product) {
            addItem(product);
            setLikeActive(true);
        }
    };

    if (!product) return <div>Loading...</div>;

    const imgList = product.images || [];
    const mainImage = imgList[selectedImageIdx] || '/images/default.jpg';
    const thumbnails = imgList.slice(0, 6);
    const price = product.price || '0';
    const colors = product.colorOptions || [{ color: product.color, images: product.images }];

    return (
        <div className="sub_page">
            <div className="inner">
                <Title title="ProductDetail" />

                {/* Product Image & Info Wrapper */}
                <section className="product-img-info__wrap">
                    {/* Left: Product Image */}
                    <div className="product-img">
                        {/* Breadcrumbs */}
                        <div className="product-img__crumbs-wrap">
                            <ul className="product-img__crumbs">
                                <li>
                                    <Link to="/">
                                        <img src="/images/icon-home.svg" alt="home" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/women">Women</Link>
                                </li>
                                <li aria-current="page">
                                    <button type="button">{product.name}</button>
                                </li>
                            </ul>
                        </div>

                        {/* Main Image Display */}
                        <div className="product-img__main-image">
                            <img src={mainImage} alt={product.name} />
                        </div>

                        {/* Thumbnail Controls */}
                        <div className="product-img__controls">
                            <button
                                className="product-img__control-btn product-img__control-btn--left"
                                onClick={() => setSelectedImageIdx((prev) => (prev > 0 ? prev - 1 : 0))}
                                disabled={selectedImageIdx === 0}
                                type="button"
                                aria-label="이전 이미지"
                            >
                                <img src="/images/icon-arrow-left.svg" alt="이전" />
                            </button>

                            <div className="product-img__thumbnails">
                                {thumbnails.map((img, idx) => (
                                    <button
                                        key={idx}
                                        className={`product-img__thumbnail ${selectedImageIdx === idx ? 'product-img__thumbnail--active' : ''}`}
                                        onClick={() => setSelectedImageIdx(idx)}
                                        type="button"
                                        style={
                                            selectedImageIdx === idx
                                                ? { filter: 'brightness(1.05)', transform: 'scale(1.05)' }
                                                : undefined
                                        }
                                    >
                                        <img src={img} alt={`${product.name} ${idx + 1}`} />
                                    </button>
                                ))}
                            </div>

                            <button
                                className="product-img__control-btn product-img__control-btn--right"
                                onClick={() => setSelectedImageIdx((prev) => (prev < imgList.length - 1 ? prev + 1 : prev))}
                                disabled={selectedImageIdx === imgList.length - 1}
                                type="button"
                                aria-label="다음 이미지"
                            >
                                <img src="/images/icon-arrow-right.svg" alt="다음" />
                            </button>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="product-info__wrap">
                        <div className="product-info">
                            <h2 className="product-info__name">{product.name}</h2>
                            <p className="product-info__price">{price.toLocaleString()}원</p>

                            {/* Color Selection */}
                            <div className="product-info__color">
                                <h3 className="product-info__color-title">색상 선택</h3>
                                <div className="product-info__color-list">
                                    {colors.map((colorOption, idx) => (
                                        <button
                                            key={idx}
                                            className={`product-info__color-badge ${selectedColor === colorOption.color ? 'product-info__color-badge--active' : ''}`}
                                            onClick={() => {
                                                setSelectedColor(colorOption.color);
                                                if (colorOption.images && colorOption.images.length > 0) {
                                                    setSelectedImageIdx(0);
                                                }
                                            }}
                                            type="button"
                                            aria-label={`${colorOption.color} 색상 선택`}
                                            aria-pressed={selectedColor === colorOption.color}
                                            style={{ backgroundColor: colorOption.color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div className="product-info__size">
                                <h3 className="product-info__size-title">사이즈 선택</h3>
                                <div className="product-info__size-list">
                                    {crocsSizes.map((size, idx) => (
                                        <button
                                            key={idx}
                                            className={`product-info__size-badge ${selectedSize === String(size) ? 'product-info__size-badge--active' : ''}`}
                                            onClick={() => setSelectedSize(String(size))}
                                            type="button"
                                            aria-pressed={selectedSize === String(size)}
                                        >
                                            {String(size)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Toggle Sections: Jibbitz / Description / Notes / Review */}
                <section>
                    {/* Jibbitz */}
                    <div className="product-detail__toggle">
                        <button
                            className="product-detail__toggle-btn"
                            onClick={() => setOpenJibbitz((v) => !v)}
                            type="button"
                            aria-expanded={openJibbitz}
                        >
                            <span>지비츠 참</span>
                            <img
                                src="/images/icon-arrow-down.svg"
                                alt="토글"
                                style={{ transform: openJibbitz ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            />
                        </button>
                        {openJibbitz && (
                            <div className="product-detail__jibbitz active">
                                <p>지비츠 구멍에 다양한 지비츠를 장착하여 나만의 스타일을 완성하세요.</p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="product-detail__toggle">
                        <button
                            className="product-detail__toggle-btn"
                            onClick={() => setOpenDesc((v) => !v)}
                            type="button"
                            aria-expanded={openDesc}
                        >
                            <span>제품 설명</span>
                            <img
                                src="/images/icon-arrow-down.svg"
                                alt="토글"
                                style={{ transform: openDesc ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            />
                        </button>
                        {openDesc && (
                            <div className="product-detail__description active">
                                <p>{product.description || '제품 설명이 없습니다.'}</p>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="product-detail__toggle">
                        <button
                            className="product-detail__toggle-btn"
                            onClick={() => setOpenNotes((v) => !v)}
                            type="button"
                            aria-expanded={openNotes}
                        >
                            <span>유의사항</span>
                            <img
                                src="/images/icon-arrow-down.svg"
                                alt="토글"
                                style={{ transform: openNotes ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            />
                        </button>
                        {openNotes && (
                            <div className="product-detail__notes active">
                                <ul>
                                    <li>제품 색상은 모니터 환경에 따라 실제와 다를 수 있습니다.</li>
                                    <li>교환 및 반품은 구매 후 7일 이내 가능합니다.</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Review */}
                    <div className="product-detail__toggle">
                        <button
                            className="product-detail__toggle-btn"
                            onClick={() => setOpenReview((v) => !v)}
                            type="button"
                            aria-expanded={openReview}
                        >
                            <span>리뷰</span>
                            <img
                                src="/images/icon-arrow-down.svg"
                                alt="토글"
                                style={{ transform: openReview ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            />
                        </button>
                        {openReview && (
                            <div className="product-detail__review active">
                                <p>아직 등록된 리뷰가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Purchase Panel */}
                <section className="select-buy">
                    <div className="select-buy__inner">
                        {/* Color Selection */}
                        <div className="select-buy__color">
                            <h3 className="select-buy__color-title">색상</h3>
                            <div className="select-buy__color-list">
                                {colors.map((colorOption, idx) => (
                                    <button
                                        key={idx}
                                        className={`select-buy__color-badge ${selectedColor === colorOption.color ? 'select-buy__color-badge--active' : ''}`}
                                        onClick={() => setSelectedColor(colorOption.color)}
                                        type="button"
                                        aria-pressed={selectedColor === colorOption.color}
                                        style={{ backgroundColor: colorOption.color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="select-buy__size">
                            <h3 className="select-buy__size-title">사이즈</h3>
                            <div className="select-buy__size-list">
                                {crocsSizes.map((size, idx) => (
                                    <button
                                        key={idx}
                                        className={`select-buy__size-badge ${selectedSize === String(size) ? 'select-buy__size-badge--active' : ''}`}
                                        onClick={() => setSelectedSize(String(size))}
                                        type="button"
                                        aria-pressed={selectedSize === String(size)}
                                    >
                                        {String(size)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="select-buy__qty">
                            <h3 className="select-buy__qty-title">수량</h3>
                            <div className="select-buy__qty-controls">
                                <button
                                    className="select-buy__qty-btn select-buy__qty-btn--decrease"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    type="button"
                                    aria-label="수량 감소"
                                >
                                    -
                                </button>
                                <span className="select-buy__qty-value">{quantity}</span>
                                <button
                                    className="select-buy__qty-btn select-buy__qty-btn--increase"
                                    onClick={() => handleQuantityChange(1)}
                                    type="button"
                                    aria-label="수량 증가"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Total Price */}
                        <div className="select-buy__total">
                            <span className="select-buy__total-label">총 금액</span>
                            <span className="select-buy__total-price">{(price * quantity).toLocaleString()}원</span>
                        </div>

                        {/* Buttons */}
                        <div className="select-buy__buttons">
                            <button
                                className="select-buy__btn select-buy__btn--like"
                                onClick={handleLikeClick}
                                type="button"
                                aria-label="찜하기"
                                style={likeActive ? { display: 'none' } : {}}
                            >
                                ♡
                            </button>
                            <button className="select-buy__btn select-buy__btn--cart" type="button">
                                장바구니
                            </button>
                            <button className="select-buy__btn select-buy__btn--buy" type="button">
                                구매하기
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default CrocsProductDetail_v02Copy;
