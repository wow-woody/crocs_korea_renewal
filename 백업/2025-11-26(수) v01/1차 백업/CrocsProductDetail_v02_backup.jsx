import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useCrocsProductStore } from '../store/useCrocsProductStore';
import { wishListStore } from '../store/wishListStore';
import Title from '../components/Title';
import WishAddPopup from '../components/WishAddPopup';
import { useCrocsSizeStore } from '../store/useCrocsSizeStore';
// CrocsProductDetail 스타일 적용 (BEM 클래스 대응)
import './scss/CrocsProductDetail.scss';
import './scss/ProductPage_flat.scss';

const CrocsProductDetail = () => {
    const { id } = useParams();
    const { crocsItems, onFetchItems } = useCrocsProductStore();
    const { crocsSizesByCategory, onFetchSize } = useCrocsSizeStore();
    const { onAddWishList } = wishListStore();

    const [CrocsProduct, setCrocsProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState('brown'); // 기본 색상
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const [likeActive, setLikeActive] = useState(false);

    // 토글 섹션 상태 (지비츠 / 설명 / 유의사항 / 리뷰)
    const [openJibbitz, setOpenJibbitz] = useState(false);
    const [openDesc, setOpenDesc] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);
    const [openReview, setOpenReview] = useState(false);

    // 더미 지비츠 데이터 (실제 연동 전 시각적 구조용)
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

    // 가격 파싱 유틸 (문자열 내 숫자만 추출)
    const parsePriceNumber = useCallback((p) => {
        if (!p) return 0;
        const num = String(p).replace(/[^0-9]/g, '');
        return Number(num || 0);
    }, []);

    // CrocsProduct가 아직 로드되지 않았을 때 null 접근 방지
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

    // 초기 데이터 로드 (스토어 액션 불변, 의존성 추가로 ESLint 경고 제거)
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
        if (!cate) return 'women'; // 기본값

        const c = cate.split(',')[0].trim().toLowerCase();

        if (c.includes('men') || c.includes('남성') || c.includes('man')) return 'men';
        if (c.includes('women') || c.includes('여성') || c.includes('woman')) return 'women';
        if (c.includes('kid') || c.includes('아동') || c.includes('주니어')) return 'kids';

        return 'women'; // fallback
    };

    // 카테고리 기반 사이즈 찾기
    const mainCate = normalizeCate(CrocsProduct.cate);

    console.log('정규화된 mainCate:', mainCate);
    console.log('sizes store:', crocsSizesByCategory);

    const categorySizes = crocsSizesByCategory[mainCate] || [];

    // ⭐ 이미지 타입 관계없이 배열로 통일
    const images = Array.isArray(CrocsProduct.product_img)
        ? CrocsProduct.product_img
        : String(CrocsProduct.product_img)
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);

    return (
        <div className="sub_page">
            <div className="inner">
                <Title title="ProductDetail" />
                <section className="product-img-info__wrap">
                    {/* 이미지 + 썸네일 + 크럼브 영역 */}
                    <div className="product-img">
                        <div className="product-img__crumbs-wrap">
                            <ul className="product-img__crumbs">
                                <li className="product-img__crumb product-img__crumb--home">
                                    <a href="/" className="product-img__link" aria-label="홈">
                                        <img className="product-img__icon" src="/images/Sub_Women_Images/icon-close_cross.svg" alt="홈" />
                                    </a>
                                </li>
                                <li className="product-img__sep"><span>:</span></li>
                                <li className="product-img__crumb product-img__crumb--category">
                                    <button type="button" className="product-img__link" aria-label="카테고리">
                                        <span className="product-img__text">{mainCate}</span>
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
                            {/* 상단 컨트롤 (비활성화 상태 유지) */}
                            <div className="thumbs__ctrl thumbs__ctrl--top" aria-hidden="true">
                                <button type="button" className="thumbs__btn thumbs__btn--up" tabIndex={-1}>
                                    <img className="thumbs__icon" src="/images/icon-arrow-up-hairline.svg" alt="" />
                                </button>
                                <button type="button" className="thumbs__btn thumbs__btn--active" tabIndex={-1}>
                                    <img className="thumbs__icon" src="/images/icon-arrow-up-green.svg" alt="" />
                                </button>
                            </div>
                            <ul className="product-img__thumbs-list">
                                {images.map((img, idx) => (
                                    <li key={idx} className="product-img__thumbs-item">
                                        <button
                                            type="button"
                                            className="product-img__thumbs-link"
                                            aria-label={`이미지 ${idx + 1} 보기`}
                                            onClick={() => setSelectedImageIdx(idx)}
                                        >
                                            <img
                                                className="product-img__thumbs-img"
                                                src={img}
                                                alt={`${CrocsProduct.product} 썸네일 ${idx + 1}`}
                                                style={selectedImageIdx === idx ? { filter: 'brightness(1.05)', transform: 'scale(1.05)' } : undefined}
                                            />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="thumbs__ctrl thumbs__ctrl--bottom" aria-hidden="true">
                                <button type="button" className="thumbs__btn thumbs__btn--down" tabIndex={-1}>
                                    <img className="thumbs__icon" src="/images/icon-arrow-down-hairline.svg" alt="" />
                                </button>
                                <button type="button" className="thumbs__btn thumbs__btn--active" tabIndex={-1}>
                                    <img className="thumbs__icon" src="/images/icon-arrow-down-green.svg" alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* 상품 정보 영역 */}
                    <div className="product-info__wrap">
                        <div className="product-info">
                            <div className="product-info__title_wrap">
                                <p className="product-info__subtitle">{CrocsProduct.product}</p>
                                <h2 className="product-info__title">{CrocsProduct.product}</h2>
                                <div className="product-info__price">
                                    <span className="product-info__price_dc_rate">{salePriceNumber ? salePriceNumber.toLocaleString() : '가격 없음'}</span>
                                    {hasOriginal && <span className="product-info__price_breadcrumbs__line" />}
                                    {discountPercent && <span className="product-info__price_sale">{discountPercent}%</span>}
                                    {hasOriginal && <span className="product-info__price_breadcrumbs__line" />}
                                    {hasOriginal && <span className="product-info__price_cost">{originalPriceNumber.toLocaleString()}</span>}
                                </div>
                            </div>
                            <div className="product-info_breadcrumbs" />
                            {/* 색상 선택 */}
                            <div className="product-info_color">
                                <div className="product-info__color-title-wrap">
                                    <p className="product-info__color-title">색상</p>
                                    <span className="product-info__price_breadcrumbs__line" />
                                    <p className="product-info__color-select">
                                        {colorOptions.find((c) => c.key === selectedColor)?.label || '브라운'}
                                    </p>
                                </div>
                                <div className="product-info__color-badge-wrap" role="group" aria-label="색상 선택">
                                    {colorOptions.map((c) => (
                                        <button
                                            key={c.key}
                                            type="button"
                                            className={`color-badge color-badge--${c.key} ${selectedColor === c.key ? 'active' : ''}`}
                                            aria-label={`${c.label} 선택`}
                                            aria-pressed={selectedColor === c.key}
                                            onClick={() => handleColorSelect(c.key)}
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* 사이즈 선택 (BEM 구조 변환) */}
                            <div className="product-info_size">
                                <div className="product-info_size-title-wrap">
                                    <p className="product-info_size-title">사이즈</p>
                                    <span className="product-info_size_breadcrumbs__line" />
                                    <p className="product-info_size-select">{selectedSize || '선택하세요'}</p>
                                </div>
                                <div className="product-info_size-btns-wrap">
                                    <ul className="product-info_size-btns" role="group" aria-label="사이즈 선택">
                                        {categorySizes.map((size) => (
                                            <li key={size}>
                                                <button
                                                    type="button"
                                                    className={selectedSize === size ? 'active' : ''}
                                                    onClick={() => setSelectedSize(size)}
                                                >
                                                    {size}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <button onClick={() => onAddWishList(CrocsProduct)}>위시버튼💚</button>
                            <WishAddPopup />
                        </div>
                    </div>
                </section>

                {/* 지비츠 / 설명 / 유의사항 / 리뷰 토글 섹션 */}
                <section>
                    {/* 지비츠 */}
                    <div className="product-detail product-detail--jibbitz">
                        <div className="product-detail__title-wrap">
                            <h2 className="product-detail__title">지비츠™ 참</h2>
                            <p className="product-detail__sub-title">나만의 스타일을 표현해 보세요.</p>
                        </div>
                        <div className="product-detail__toggle">
                            <button
                                type="button"
                                className="product-detail__toggle-btn product-detail__toggle-btn--open js-toggle"
                                aria-expanded={openJibbitz}
                                onClick={() => setOpenJibbitz((v) => !v)}
                            >
                                <img
                                    className="product-detail__toggle-btn__icon-open"
                                    src={openJibbitz ? '/images/ProductPage/icon-arrow-up_btn.svg' : '/images/ProductPage/icon-arrow-down_btn.svg'}
                                    alt={openJibbitz ? '접기' : '열기'}
                                />
                            </button>
                        </div>
                    </div>
                    {openJibbitz && (
                        <div className="product-detail__jibbitz active">
                            <div className="product-detail__jibbitz-item-wrap">
                                {jibbitzItems.map((jb) => (
                                    <div key={jb.id} className="product-detail__jibbitz-item">
                                        <div className="product-detail__jibbitz-item-img-wrap">
                                            <img className="product-detail__jibbitz-item-img" src={jb.img} alt={jb.name} />
                                        </div>
                                        <div className="product-detail__desc-item-title-wrap">
                                            <h3>{jb.name}</h3>
                                            <div className="product-detail__desc-item-price-wrap">
                                                <span className="product-detail__dc_pride">{jb.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 상세 설명 */}
                    <div className="product-detail product-detail--desc">
                        <div className="product-detail__title-wrap">
                            <h2 className="product-detail__title">제품 설명</h2>
                        </div>
                        <div className="product-detail__toggle">
                            <button
                                type="button"
                                className="product-detail__toggle-btn product-detail__toggle-btn--open js-toggle"
                                aria-expanded={openDesc}
                                onClick={() => setOpenDesc((v) => !v)}
                            >
                                <img
                                    className="product-detail__toggle-btn__icon-open"
                                    src={openDesc ? '/images/ProductPage/icon-arrow-up_btn.svg' : '/images/ProductPage/icon-arrow-down_btn.svg'}
                                    alt={openDesc ? '접기' : '열기'}
                                />
                            </button>
                        </div>
                    </div>
                    {openDesc && (
                        <div className="product-detail_desc active">
                            <div className="product-detail_desc__wrap">
                                <div className="product-detail_desc__item">
                                    <p className="product-detail_desc__item-text">이 제품은 편안함과 경량성을 제공하는 소재로 만들어졌습니다.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 유의 사항 */}
                    <div className="product-detail product-detail--notes">
                        <div className="product-detail__title-wrap">
                            <h2 className="product-detail__title">유의 사항</h2>
                        </div>
                        <div className="product-detail__toggle">
                            <button
                                type="button"
                                className="product-detail__toggle-btn product-detail__toggle-btn--open js-toggle"
                                aria-expanded={openNotes}
                                onClick={() => setOpenNotes((v) => !v)}
                            >
                                <img
                                    className="product-detail__toggle-btn__icon-open"
                                    src={openNotes ? '/images/ProductPage/icon-arrow-up_btn.svg' : '/images/ProductPage/icon-arrow-down_btn.svg'}
                                    alt={openNotes ? '접기' : '열기'}
                                />
                            </button>
                        </div>
                    </div>
                    {openNotes && (
                        <div className="product-detail_notes active">
                            <div className="product-detail_notes__wrap">
                                <div className="product-detail_notes__item">
                                    <p className="product-detail_notes__item-text">직사광선 및 고열을 피해 보관하세요.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 리뷰 */}
                    <div className="product-detail product-detail_review">
                        <div className="product-detail__title-wrap">
                            <h2 className="product-detail__title">상품 리뷰</h2>
                        </div>
                        <div className="product-detail__toggle">
                            <button
                                type="button"
                                className="product-detail__toggle-btn product-detail__toggle-btn--open js-toggle"
                                aria-expanded={openReview}
                                onClick={() => setOpenReview((v) => !v)}
                            >
                                <img
                                    className="product-detail__toggle-btn__icon-open"
                                    src={openReview ? '/images/ProductPage/icon-arrow-up_btn.svg' : '/images/ProductPage/icon-arrow-down_btn.svg'}
                                    alt={openReview ? '접기' : '열기'}
                                />
                            </button>
                        </div>
                    </div>
                    {openReview && (
                        <div className="product-detail_review__wrap active">
                            <p>아직 리뷰가 없습니다.</p>
                        </div>
                    )}
                </section>

                {/* 구매 패널 */}
                <section className="select-buy">
                    <div className="select-buy__wrap">
                        <div className="select-buy__title_wrap">
                            <p className="select-buy__subtitle">{CrocsProduct.product}</p>
                            <h2 className="select-buy__title">{CrocsProduct.product}</h2>
                            <div className="select-buy__price">
                                <span className="select-buy__price_dc_rate">{salePriceNumber ? salePriceNumber.toLocaleString() : '가격 없음'}</span>
                                {hasOriginal && <span className="select-buy__price_breadcrumbs__line" />}
                                {discountPercent && <span className="select-buy__price_sale">{discountPercent}%</span>}
                                {hasOriginal && <span className="select-buy__price_breadcrumbs__line" />}
                                {hasOriginal && <span className="select-buy__price_cost">{originalPriceNumber.toLocaleString()}</span>}
                            </div>
                        </div>
                        <div className="select-buy__breadcrumbs" />
                        {/* 색상 선택 (구매 패널) */}
                        <div className="select-buy__color">
                            <div className="select-buy__color-title-wrap">
                                <p className="select-buy__color-title">색상</p>
                                <span className="select-buy__price_breadcrumbs__line" />
                                <p className="select-buy__color-select">{colorOptions.find((c) => c.key === selectedColor)?.label}</p>
                            </div>
                            <div className="select-buy__color-badge-wrap">
                                {colorOptions.map((c) => (
                                    <button
                                        key={c.key}
                                        type="button"
                                        className={`select-buy__color-badge color-badge--${c.key}`}
                                        aria-label={`${c.label} 선택`}
                                        aria-pressed={selectedColor === c.key}
                                        style={selectedColor === c.key ? { transform: 'scale(1.25)', borderColor: '#ffffff' } : undefined}
                                        onClick={() => handleColorSelect(c.key)}
                                    />
                                ))}
                            </div>
                        </div>
                        {/* 사이즈 선택 (구매 패널) */}
                        <div className="select-buy__size">
                            <div className="select-buy__size-title-wrap">
                                <p className="select-buy__size-title">사이즈</p>
                                <span className="select-buy__size_breadcrumbs__line" />
                                <p className="select-buy__size-select">{selectedSize || '선택하세요'}</p>
                            </div>
                            <div className="select-buy__size-btns-wrap">
                                <ul className="select-buy__size-btns" role="group" aria-label="사이즈 선택">
                                    {categorySizes.map((size) => (
                                        <li key={size}>
                                            <button
                                                type="button"
                                                className={selectedSize === size ? 'active' : ''}
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="select-buy__breadcrumbs" />
                        {/* 선택된 항목 */}
                        <div className="select-buy__selected--wrap">
                            <div className="select-buy__select">
                                <div className="select-buy__select-wrap">
                                    <div className="select-buy__select_chose-item">
                                        <span className={`info__color-badge buy__color-badge--${selectedColor}`}></span>
                                        <span className="select-buy__select_chose-item-name">{CrocsProduct.product}</span>
                                    </div>
                                    <span className="product-info__price_breadcrumbs__line" />
                                    <span className="select-buy__select_chose-item-option">{selectedSize || '-'}</span>
                                </div>
                                <div className="select-buy__select__count-wrap">
                                    <div className="select-buy__select__count-value-wrap">
                                        <p className="select-buy__select__count-value"><span>{quantity}</span></p>
                                        <div className="select-buy__select__wrap">
                                            <button
                                                type="button"
                                                className="select-buy__select__count-btn select-buy__select__count-btn--increase"
                                                onClick={increaseQty}
                                            >
                                                <span className="select-buy__select__count-link select-buy__select__count-link--disabled-1">
                                                    <img src="/images/icon-arrow-up_bold-1.svg" alt="증가" />
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                className="select-buy__select__count-btn select-buy__select__count-btn--decrease"
                                                onClick={decreaseQty}
                                                disabled={quantity <= 1}
                                            >
                                                <span className="select-buy__select__count-link select-buy__select__count-link--disabled-1">
                                                    <img src="/images/icon-arrow-down_bold-1.svg" alt="감소" />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="select-buy__breadcrumbs" />
                        {/* 총 금액 */}
                        <div className="select-buy__total-wrap">
                            <div className="select-buy__total-title"><p>총 상품 금액</p></div>
                            <div className="select-buy__total-content">
                                <div className="select-buy__total-number-wrap">
                                    <p className="total-number-text">수량: {quantity}</p>
                                </div>
                                <div className="select-buy__total-price-wrap">
                                    <p className="total-price">₩{totalPrice.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="select-buy__breadcrumbs" />
                        {/* 구매 버튼 */}
                        <div className="select-buy__buy-btns-wrap">
                            <div
                                className="select-buy__buy-btns__btn-like"
                                role="button"
                                aria-pressed={likeActive}
                                tabIndex={0}
                                onClick={() => setLikeActive((v) => !v)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLikeActive((v) => !v); } }}
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
            </div>
        </div>
    );
};
export default CrocsProductDetail;
