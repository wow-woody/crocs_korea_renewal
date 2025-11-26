import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCrocsProductStore } from '../store/useCrocsProductStore';
import { wishListStore } from '../store/wishListStore';
import Title from '../components/Title';
import WishAddPopup from '../components/WishAddPopup';
import { useCrocsSizeStore } from '../store/useCrocsSizeStore';
import './scss/CrocsProductDetail.scss';

const CrocsProductDetail = () => {

    const { id } = useParams();
    const { crocsItems, onFetchItems } = useCrocsProductStore();
    const { crocsSizesByCategory, onFetchSize } = useCrocsSizeStore();
    const { onAddWishList, onProductAddCart } = wishListStore();

    const [CrocsProduct, setCrocsProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState('brown'); // 기본 색상
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);

    // 가격 파싱 유틸 (문자열 내 숫자만 추출)
    const parsePriceNumber = useCallback((p) => {
        if (!p) return 0;
        const num = String(p).replace(/[^0-9]/g, '');
        return Number(num || 0);
    }, []);

    // CrocsProduct가 아직 로드되지 않았을 때 null 접근 방지
    // const salePriceNumber = parsePriceNumber(CrocsProduct?.prices?.[0]);
    // const originalPriceNumber = parsePriceNumber(CrocsProduct?.prices?.[1]);
    // const hasOriginal = originalPriceNumber > 0 && originalPriceNumber > salePriceNumber;
    // const discountPercent = hasOriginal
    //     ? Math.round(((originalPriceNumber - salePriceNumber) / originalPriceNumber) * 100)
    //     : null;
    // ⭐ 장바구니 규칙과 동일한 가격 계산 함수
    const getDetailPrice = (product) => {
        if (!product) return 0; // ⭐ null 방어

        if (product.price) {
            return Number(String(product.price).replace(/,/g, ''));
        }

        if (product.prices && product.prices.length > 0) {
            const sale = product.prices[1] || product.prices[0] || '0';
            return Number(String(sale).replace(/,/g, ''));
        }

        return 0;
    };

    // ⭐ 원가 계산 (prices[0])
    const getOriginalPrice = (product) => {
        if (!product || !product.prices) return null; // ⭐ null 방어

        const origin = product.prices[0];
        if (!origin) return null;

        return Number(String(origin).replace(/,/g, ''));
    };

    // ⭐ 할인율 계산
    const detailPrice = CrocsProduct ? getDetailPrice(CrocsProduct) : 0;
    const originalPrice = CrocsProduct ? getOriginalPrice(CrocsProduct) : null;

    const hasOriginal = originalPrice !== null && originalPrice > detailPrice;

    const discountPercent = hasOriginal
        ? Math.round(((originalPrice - detailPrice) / originalPrice) * 100)
        : null;

    const totalPrice = detailPrice * quantity;

    const increaseQty = () => setQuantity((q) => q + 1);
    const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
    const handleColorSelect = (c) => setSelectedColor(c);

    // 토글 섹션 상태 (지비츠 / 설명 / 유의사항 / 리뷰)
    const [openJibbitz, setOpenJibbitz] = useState(false);
    const [openDesc, setOpenDesc] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);
    const [openReview, setOpenReview] = useState(false);

    // 더미 지비츠 데이터 (실제 연동 전 시각적 구조용)
    const jibbitzItems = [
        {
            id: 1,
            name: '지비츠 참 A',
            price: '₩4,900',
            img: '/images/ProductPage/imgi_53_crocs.avif',
        },
        {
            id: 2,
            name: '지비츠 참 B',
            price: '₩5,900',
            img: '/images/ProductPage/imgi_54_crocs.avif',
        },
        {
            id: 3,
            name: '지비츠 참 C',
            price: '₩6,900',
            img: '/images/ProductPage/imgi_55_crocs.avif',
        },
    ];

    const colorOptions = [
        { key: 'black', label: '블랙' },
        { key: 'brown', label: '브라운' },
        { key: 'pink', label: '핑크' },
        { key: 'green', label: '그린' },
        { key: 'blue', label: '블루' },
    ];

    useEffect(() => {
        onFetchItems();
        onFetchSize();
    }, []);

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
        <div className="sub_page container">
            <section className="product-img-info">
                <Title title="ProductDetail" />
                <div className="product-img-info__wrap">
                    {/* 이미지 + 썸네일 + 크럼브 영역 */}
                    <div className="product-img">
                        <div className="product-img__crumbs-wrap">
                            <ul className="product-img__crumbs">
                                <li className="product-img__crumb product-img__crumb--home">
                                    <a href="/" className="product-img__link" aria-label="홈">
                                        <img className="product-img__icon" src="/images/Sub_Women_Images/icon-close_cross.svg"
                                            alt="홈" />
                                    </a>
                                </li>

                                <li className="product-img__sep">
                                    <span>:</span>
                                </li>

                                <li className="product-img__crumb product-img__crumb--category">
                                    <button type="button" className="product-img__link" aria-label="카테고리">
                                        <span className="product-img__text">{mainCate}</span>
                                    </button>
                                </li>

                                <li className="product-img__sep">
                                    <span>:</span>
                                </li>

                                <li className="product-img__crumb product-img__crumb--current">
                                    <button type="button" className="product-img__link" aria-current="page" aria-label="현재 상품">
                                        <span className="product-img__text">
                                            {CrocsProduct.product}
                                        </span>
                                        <img className="product-img__icon" src="/images/Sub_Women_Images/icon-close_cross.svg"
                                            alt="닫기" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className="product-img__main-wrap">
                            <ul className="product-img__list product-img__list--main">
                                <li className="product-img__item">
                                    <img className="product-img__img" src={images[selectedImageIdx]}
                                        alt={CrocsProduct.product} />
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

                            {/* 썸네일 리스트 */}
                            <ul className="product-img__thumbs-list">
                                {images.map((img, idx) => (
                                    <li key={idx} className="product-img__thumbs-item">
                                        <button type="button" className="product-img__thumbs-link" aria-label={`이미지 ${idx + 1} 보기`}
                                            onClick={() => setSelectedImageIdx(idx)}
                                        >
                                            <img className="product-img__thumbs-img" src={img} alt={`${CrocsProduct.product} 썸네일
                                    ${idx + 1}`} style={selectedImageIdx === idx ? {
                                                    filter: 'brightness(1.05)',
                                                    transform: 'scale(1.05)',
                                                } : undefined} />
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* 상단 컨트롤 (비활성화 상태 유지) */}
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
                </div>

                {/* 지비츠 참 */}


            </section>

            {/* 구매하기 영역 */}
            <section className="select-buy">
                <div className="select-buy__wrap">

                    {/* 타이틀 영역 */}
                    <div className="select-buy__title_wrap">
                        <p class="select-buy__subtitle">{CrocsProduct.product}</p>
                        <h2 class="select-buy__title">{CrocsProduct.product}</h2>
                        <div className="select-buy__price">
                            <span class="select-buy__price_dc_rate">{detailPrice ? detailPrice.toLocaleString() : '가격 없음'}</span>
                            <span class="select-buy__price_breadcrumbs__line"></span>
                            <span class="select-buy__price_sale">{discountPercent}%</span>
                            <span class="select-buy__price_breadcrumbs__line"></span>
                            <span class="select-buy__price_cost">{originalPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* 구분선 */}
                    <div className="select-buy__breadcrumbs"></div>

                    {/* 색상 선택 영역 */}
                    <div className="select-buy__color">
                        <div className="select-buy__color-title-wrap">
                            <p className="select-buy__color-title">색상</p>
                            <span className="select-buy__price_breadcrumbs__line"></span>
                            <p className="select-buy__color-select">
                                {colorOptions.find((c) => c.key === selectedColor)?.label ||
                                    '브라운'}</p>
                        </div>
                        <div className="select-buy__color-badge-wrap" role="group" aria-label="색상 선택">
                            {colorOptions.map((c) => (
                                <button key={c.key} type="button" className={`color-badge color-badge--${c.key} ${selectedColor === c.key ? 'active' : ''}`} aria-label={`${c.label} 선택`}
                                    aria-pressed={selectedColor === c.key} onClick={() => handleColorSelect(c.key)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 사이즈 선택 (BEM 구조 변환) */}
                    <div className="select-buy__size">
                        <div className="select-buy__size-title-wrap">
                            <p className="select-buy__size-title">사이즈</p>
                            <span className="select-buy__size_breadcrumbs__line" />
                            <p className="select-buy__size-select">
                                {selectedSize || '선택하세요'}
                            </p>
                        </div>
                        <div className="select-buy__size-btns-wrap">
                            <ul className=" select-buy__size-btns" role="group" aria-label="사이즈 선택">
                                {categorySizes.map((size) => (
                                    <li key={size}>
                                        <button type="button" className={selectedSize === size ? 'active' : ''} onClick={() =>
                                            setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="select-buy__size-notice-wrap">
                                <span>원하는 옵션이 없으신가요?</span>
                                <div>
                                    <a href="#">
                                        <img src="/images/icon-bell.svg" alt="재입고 알림 아이콘" />
                                        <span>재입고 알림 신청하기</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 구분선 */}
                    <div className="select-buy__breadcrumbs"></div>


                    {/* 구매 선택 수량 목록 */}
                    <div className="select-buy__selected--wrap">
                        <div className="select-buy__select">
                            <div className="select-buy__select-wrap">
                                <div className="select-buy__select_chose-item">
                                    <span className="info__color-badge buy__color-badge--black"></span>
                                    <span className="select-buy__select_chose-item-name">클래식 언퍼게터블 스웨이드 클로그</span>
                                </div>
                                <span className="select-buy__price_breadcrumbs__line"></span>
                                <span className="select-buy__select_chose-item-option">220</span>
                            </div>
                            <div className="select-buy__select__count-wrap">
                                <div className="select-buy__select__count">
                                    <div className="select-buy__select__count-value-wrap">
                                        <p className=" select-buy__select__count-value"><span>1</span></p>
                                    </div>
                                    {/* 카운타 버튼 */}
                                    <div className="select-buy__select__wrap">
                                        {/* 증가 버튼 */}
                                        <button className="select-buy__select__count-btn select-buy__select__count-btn--increase">
                                            <a href="#"
                                                className="select-buy__select__count-link select-buy__select__count-link--disabled-1">
                                                <img src="/images/icon-arrow-up_bold-1.svg" alt="수량 증가 버튼"
                                                    className="count-btn__icon-1" />
                                            </a>
                                            <a href="#"
                                                className="select-buy__select__count-link select-buy__select__count-link--disabled-2">
                                                <img src="/images/icon-arrow-up_bold-2.svg" alt="수량 증가 버튼 비활성화"
                                                    className="count-btn__icon-2" />
                                            </a>
                                        </button>
                                        {/* 감소 버튼 */}
                                        <button className="select-buy__select__count-btn select-buy__select__count-btn--decrease">
                                            <a href="#"
                                                className="select-buy__select__count-link select-buy__select__count-link--disabled-1">
                                                <img src="/images/icon-arrow-down_bold-1.svg" alt="수량 감소 버튼"
                                                    className="count-btn__icon-1" />
                                            </a>
                                            <a href="#"
                                                className="select-buy__select__count-link select-buy__select__count-link--disabled-2">
                                                <img src="/images/icon-arrow-down_bold-2.svg" alt="수량 감소 버튼 비활성화"
                                                    className="count-btn__icon-2" />
                                            </a>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="select-buy__select__del">
                                <button className="select-buy__select__del-btn ">
                                    <img src="/images/ProductPage/icon-delete.svg" className="del-btn--normal" />
                                    <img src="/images/ProductPage/icon-delete-hover.svg" className="del-btn--hover" />
                                </button>
                                {/*<!-- <button class="select-buy__select__del-btn del-btn--hover">
                                    <img src="/images/ProductPage/icon-delete-hover.svg" />
                                </button> -->*/}

                            </div>
                        </div>
                        <div className="select-buy__select">
                            <div className="select-buy__select-wrap">
                                <div className="select-buy__select_chose-item">
                                    <span className="info__color-badge buy__color-badge--brown"></span>
                                    <span className="select-buy__select_chose-item-name">클래식 언퍼게터블 스웨이드 클로그</span>
                                </div>
                                <span className="select-buy__price_breadcrumbs__line"></span>
                                <span className="select-buy__select_chose-item-option">220</span>
                            </div>
                            <div className="select-buy__select__count-wrap">
                                <div className="select-buy__select__count">
                                    <div className="select-buy__select__count-value-wrap">
                                        <p className=" select-buy__select__count-value"><span>1</span></p>

                                        {/* 카운타 버튼 */}
                                        <div className="select-buy__select__wrap">
                                            {/* 증가 버튼 */}
                                            <button
                                                className="select-buy__select__count-btn select-buy__select__count-btn--increase">
                                                <a href="#"
                                                    className="select-buy__select__count-link select-buy__select__count-link--disabled-1">
                                                    <img src="/images/icon-arrow-up_bold-1.svg" alt="수량 증가 버튼"
                                                        className="count-btn__icon-1" />
                                                </a>
                                                <a href="#"
                                                    className="select-buy__select__count-link select-buy__select__count-link--disabled-2">
                                                    <img src="/images/icon-arrow-up_bold-2.svg" alt="수량 증가 버튼 비활성화"
                                                        className="count-btn__icon-2" />
                                                </a>
                                            </button>
                                            {/* 감소 버튼 */}
                                            <button
                                                className="select-buy__select__count-btn select-buy__select__count-btn--decrease">
                                                <a href="#"
                                                    className="select-buy__select__count-link select-buy__select__count-link--disabled-1">
                                                    <img src="/images/icon-arrow-down_bold-1.svg" alt="수량 감소 버튼"
                                                        className="count-btn__icon-1" />
                                                </a>
                                                <a href="#"
                                                    className="select-buy__select__count-link select-buy__select__count-link--disabled-2">
                                                    <img src="/images/icon-arrow-down_bold-2.svg" alt="수량 감소 버튼 비활성화"
                                                        className="count-btn__icon-2" />
                                                </a>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="select-buy__select__del">
                                    <button className="select-buy__select__del-btn ">
                                        <img src="/images/ProductPage/icon-delete.svg" className="del-btn--normal" />
                                        <img src="/images/ProductPage/icon-delete-hover.svg" className="del-btn--hover" />
                                    </button>
                                    {/*<!-- <button class="select-buy__select__del-btn del-btn--hover">
                                    <img src="/images/ProductPage/icon-delete-hover.svg" />
                                </button> -->*/}

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 구분선 */}
                    <div className="select-buy__breadcrumbs">
                    </div>

                    {/* 총 상품 금액 */}
                    <div className="select-buy__total-wrap">
                        <div className="select-buy__total-title">
                            <p>총 상품 금액</p>
                        </div>
                        <div className="select-buy__total-content">
                            <div className="select-buy__total-number-wrap">
                                <p className="total-number-text">총 수량</p>
                                <p className="total-number">2</p>
                                <p>개</p>
                            </div>
                            <div className="select-buy__total-price-wrap">
                                <p className="total-price">77,790</p>
                                <p className="total-price-text">원</p>
                            </div>
                        </div>
                    </div>
                    <div className="select-buy__breadcrumbs"></div>

                    {/* 구매 버튼 영역 */}
                    <div className="select-buy__buy-btns-wrap">
                        <button className="select-buy__buy-btns__btn-like" onClick={() => onAddWishList(CrocsProduct)}>
                            💚
                            {/* <p className="select-buy__buy-btns__btn-like_line">
                                <img src="/images/ProductPage/icon-love_line.svg" alt="좋아요 비활성화" />
                            </p>
                            <p className="select-buy__buy-btns__btn-like_fill">
                                <img src="/images/ProductPage/icon-love_fill.svg" alt="좋아요 활성화" />
                            </p> */}
                        </button>
                        <WishAddPopup />
                        <button className="select-buy__buy-btn select-buy__buy-btn--add-cart" onClick={() =>
                            onProductAddCart({
                                id: CrocsProduct.id,

                                // ⭐ CartStore에서 name 사용하므로 반드시 넣기
                                name: CrocsProduct.product,
                                title: CrocsProduct.product, // 혹시 title도 찾을 수 있으므로 같이 넣기

                                // ⭐ 할인 가격 or 정상 가격 반영
                                price: detailPrice,

                                // ⭐ 장바구니 수량
                                quantity: quantity,

                                // ⭐ 선택한 사이즈
                                size: selectedSize || null,

                                // ⭐ 대표 이미지
                                product_img: Array.isArray(CrocsProduct.product_img)
                                    ? CrocsProduct.product_img[0]
                                    : CrocsProduct.product_img,
                            })
                        }>
                            장바구니
                        </button>
                        <WishAddPopup />
                        <button className="select-buy__buy-btn select-buy__buy-btn--buy-now">구매하기</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CrocsProductDetail

