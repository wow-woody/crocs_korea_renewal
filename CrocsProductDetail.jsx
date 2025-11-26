import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCrocsProductStore } from '../store/useCrocsProductStore';
import { wishListStore } from '../store/wishListStore';
import Title from '../components/Title';
import WishAddPopup from '../components/WishAddPopup';
import { useCrocsSizeStore } from '../store/useCrocsSizeStore';


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
                <div className="product-detail product-detail--jibbitz">
                    <div class="product-detail__title-wrap">
                        <h2 class="product-detail__title">지비츠™ 참 </h2>
                        <p class="product-detail__sub-title">지비츠™ 참을 추가해서 나만의 스타일과 개성을 표현해 보세요.</p>
                    </div>
                    <div class="product-detail__toggle">
                        <button
                            class="product-detail__toggle-btn product-detail__toggle-btn--open product-detail--jibbitz-btn--open js-toggle"
                            data-target="#jibbitzContent" aria-expanded="false" aria-label="지비츠 영역 열기">
                            <img src="./public/images/ProductPage/icon-arrow-down_btn.svg" alt="상세 열기 아이콘"
                                class="product-detail__toggle-btn__icon-open">
                                <img src="./public/images/ProductPage/icon-arrow-down_btn-hover.svg" alt="상세 닫기 아이콘"
                                    class="product-detail__toggle-btn__icon-open--hover">
                                </button>
                                {/*<!-- <button class="product-detail__toggle-btn product-detail__toggle-btn--close" aria-expanded="false" aria-label="상세 닫기"> -->*/}
                            </div>
                    </div>
                    <div class="product-detail__jibbitz" id="jibbitzContent" style="display:none;">
                        <div class="product-detail__jibbitz-item-wrap">
                            <div class="product-detail__jibbitz-item">
                                <div class="product-detail__jibbitz-item-img-wrap">
                                    <div class="product-detail__jibbitz-item">
                                        <p class="product-detail__jibbitz-item-img ">
                                            <img src="./public/images/ProductPage/2_동물의_숲_부케_1.jpg" alt="동물의_숲_부케_이미지">
                                        </p>
                                        <div class="product-detail__jibbitz-item-icon-wrap">
                                            <a href="#">
                                                <div className="product-detail__title-wrap">
                                                    <h2 className="product-detail__title">지비츠™ 참 </h2>
                                                    <p className="product-detail__sub-title">지비츠™ 참을 추가해서 나만의 스타일과 개성을 표현해 보세요.</p>
                                            </a>
                                            <div className="product-detail__toggle">
                                                <p class="icon-like-fill">
                                                    className="product-detail__toggle-btn product-detail__toggle-btn--open product-detail--jibbitz-btn--open js-toggle"
                                                </p>
                                                <img src="/images/ProductPage/icon-arrow-down_btn.svg" alt="상세 열기 아이콘"
                                                    className="product-detail__toggle-btn__icon-open">
                                                    <img src="/images/ProductPage/icon-arrow-down_btn-hover.svg" alt="상세 닫기 아이콘"
                                                        className="product-detail__toggle-btn__icon-open--hover">
                                                        <img src="./public/images/ProductPage/icon-cart.svg" alt="장바구니 담기">
                                                            {/* <button className="product-detail__toggle-btn product-detail__toggle-btn--close" aria-expanded="false" aria-label="상세 닫기"> */}
                                                        </a>
                                                    </div>
                                                    <div className="product-detail__jibbitz" id="jibbitzContent" style={{ display: 'none' }}>
                                                        <div className="product-detail__jibbitz-item-wrap">
                                                            <div className="product-detail__jibbitz-item">
                                                                <div className="product-detail__jibbitz-item-img-wrap">
                                                                    <div className="product-detail__jibbitz-item">
                                                                        <p className="product-detail__jibbitz-item-img ">
                                                                            <img src="/images/ProductPage/2_동물의_숲_부케_1.jpg" alt="동물의_숲_부케_이미지" />
                                                                            <p class="product-detail__breadcrumbs__line"></p>
                                                                            <div className="product-detail__jibbitz-item-icon-wrap">
                                                                                <p class="product-detail__breadcrumbs__line"></p>
                                                                                <p className="icon-like">
                                                                                    <img src="/images/ProductPage/icon-love_line.svg" alt="좋아요 아이콘 비활성화" />
                                                                            </div>
                                                                    </div>
                                                                    <div class="product-detail__jibbitz-item-wrap">
                                                                        <p className="icon-like-fill">
                                                                            <img src="/images/ProductPage/icon-love_Fill.svg" alt="좋아요 아이콘 활성화" />
                                                                            <div class="product-detail__jibbitz-item">
                                                                                <p class="product-detail__jibbitz-item-img ">
                                                                                    <img src="./public/images/ProductPage/2_동물의_숲_부케_1.jpg" alt="동물의_숲_부케_이미지">
                                                                                </p>
                                                                                <p className="icon-cart">
                                                                                    <img src="/images/ProductPage/icon-cart.svg" alt="장바구니 담기" />
                                                                                    <p class="icon-like">
                                                                                        <img src="./public/images/ProductPage/icon-love_line.svg" alt="좋아요 아이콘 비활성화">
                                                                                    </p>
                                                                                </a>
                                                                                <a href="#">
                                                                                    <div className="product-detail__desc-item-title-wrap">
                                                                                        <h3 className="product-detail__desc-item-title">동물의 숲 부케 지비츠™ 참 <br />6팩</h3>
                                                                                    </p>
                                                                                    <div className="product-detail__desc-item-price-wrap">
                                                                                        <p className="product-detail__dc_pride">55,900</p>
                                                                                        <p className="product-detail__breadcrumbs__line"></p>
                                                                                        <p className="product-detail__price_sale">20%</p>
                                                                                        <p className="product-detail__breadcrumbs__line"></p>
                                                                                        <p className="product-detail__price_cost">69,900</p>
                                                                                </a>
                                                                            </div>
                                                                    </div>
                                                                    <div className="product-detail__jibbitz-item-wrap">
                                                                        <div className="product-detail__jibbitz-item">
                                                                            <div className="product-detail__jibbitz-item-img-wrap">
                                                                                <div className="product-detail__jibbitz-item">
                                                                                    <p className="product-detail__jibbitz-item-img ">
                                                                                        <img src="/images/ProductPage/2_동물의_숲_부케_1.jpg" alt="동물의_숲_부케_이미지" />
                                                                                        <p class="product-detail__breadcrumbs__line"></p>
                                                                                        <div className="product-detail__jibbitz-item-icon-wrap">
                                                                                            <p class="product-detail__breadcrumbs__line"></p>
                                                                                            <p className="icon-like">
                                                                                                <img src="/images/ProductPage/icon-love_line.svg" alt="좋아요 아이콘 비활성화" />
                                                                                        </div>
                                                                                </div>
                                                                                <div class="product-detail__jibbitz-item-wrap">
                                                                                    <p className="icon-like-fill">
                                                                                        <img src="/images/ProductPage/icon-love_Fill.svg" alt="좋아요 아이콘 활성화" />
                                                                                        <div class="product-detail__jibbitz-item">
                                                                                            <p class="product-detail__jibbitz-item-img ">
                                                                                                <img src="./public/images/ProductPage/2_동물의_숲_부케_1.jpg" alt="동물의_숲_부케_이미지">
                                                                                            </p>
                                                                                            <p className="icon-cart">
                                                                                                <img src="/images/ProductPage/icon-cart.svg" alt="장바구니 담기" />
                                                                                                <p class="icon-like">
                                                                                                    <img src="./public/images/ProductPage/icon-love_line.svg" alt="좋아요 아이콘 비활성화">
                                                                                                </p>
                                                                                            </a>
                                                                                            <a href="#">
                                                                                                <div className="product-detail__desc-item-title-wrap">
                                                                                                    <h3 className="product-detail__desc-item-title">동물의 숲 부케 지비츠™ 참 <br />6팩</h3>
                                                                                                </p>
                                                                                                <div className="product-detail__desc-item-price-wrap">
                                                                                                    <p className="product-detail__dc_pride">55,900</p>
                                                                                                    <p className="product-detail__breadcrumbs__line"></p>
                                                                                                    <p className="product-detail__price_sale">20%</p>
                                                                                                    <p className="product-detail__breadcrumbs__line"></p>
                                                                                                    <p className="product-detail__price_cost">69,900</p>
                                                                                            </a>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="product-detail__jibbitz-item-wrap">
                                                                                    <div class="product-detail__desc-item-title-wrap">
                                                                                        <h3 class="product-detail__desc-item-title">동물의 숲 부케 지비츠™ 참 <br>6팩</h3>
                                                                                    </div>
                                                                                    <div class="product-detail__desc-item-price-wrap">
                                                                                        <img src="/images/ProductPage/2_동물의_숲_부케_1.jpg" alt="동물의_숲_부케_이미지" />
                                                                                        <p class="product-detail__breadcrumbs__line"></p>
                                                                                        <p class="product-detail__price_sale">20%</p>
                                                                                        <p class="product-detail__breadcrumbs__line"></p>
                                                                                        <p class="product-detail__price_cost">69,900</p>
                                                                                        <img src="/images/ProductPage/icon-love_line.svg" alt="좋아요 아이콘 비활성화" />
                                                                                    </div>
                                                                                </div>
                                                                                <div class="product-detail__jibbitz-item-wrap">
                                                                                    <div class="product-detail__jibbitz-item">
                                                                                        <img src="/images/ProductPage/icon-love_Fill.svg" alt="좋아요 아이콘 활성화" />
                                                                                        <div class="product-detail__jibbitz-item">
                                                                                            <p class="product-detail__jibbitz-item-img ">
                                                                                                <img src="./public/images/ProductPage/2_동물의_숲_부케_1.jpg" alt="동물의_숲_부케_이미지">
                                                                                            </p>
                                                                                            <div class="product-detail__jibbitz-item-icon-wrap">
                                                                                                <img src="/images/ProductPage/icon-cart.svg" alt="장바구니 담기" />
                                                                                                <p class="icon-like">
                                                                                                    <img src="./public/images/ProductPage/icon-love_line.svg" alt="좋아요 아이콘 비활성화">
                                                                                                </p>
                                                                                            </a>
                                                                                            <a href="#">
                                                                                                <p class="icon-like-fill">
                                                                                                    <h3 class="product-detail__desc-item-title">동물의 숲 부케 지비츠™ 참 <br />6팩</h3>
                                                                                                </p>
                                                                                            </a>
                                                                                        </div>
                                                                                        <a href="#">
                                                                                            <p class="icon-cart">
                                                                                                <img src="./public/images/ProductPage/icon-cart.svg" alt="장바구니 담기">
                                                                                            </p>
                                                                                        </a>
                                                                                    </div>
                                                                                </div>

                                                                                <div class="product-detail__desc-item-title-wrap">
                                                                                    <h3 class="product-detail__desc-item-title">동물의 숲 부케 지비츠™ 참 <br>6팩</h3>
                                                                                </div>
                                                                                <div class="product-detail__desc-item-price-wrap">
                                                                                    <img src="/images/ProductPage/2_동물의_숲_부케_1.jpg" alt="동물의_숲_부케_이미지" />
                                                                                    <p class="product-detail__breadcrumbs__line"></p>
                                                                                    <p class="product-detail__price_sale">20%</p>
                                                                                    <p class="product-detail__breadcrumbs__line"></p>
                                                                                    <p class="product-detail__price_cost">69,900</p>
                                                                                    <img src="/images/ProductPage/icon-love_line.svg" alt="좋아요 아이콘 비활성화" />
                                                                                </div>
                                                                            </div>
                                                                            <div class="product-detail__jibbitz-item-wrap">
                                                                                <div class="product-detail__jibbitz-item">
                                                                                    <img src="/images/ProductPage/icon-love_Fill.svg" alt="좋아요 아이콘 활성화" />
                                                                                    <div class="product-detail__jibbitz-item">
                                                                                        <p class="product-detail__jibbitz-item-img ">
                                                                                            <img src="./public/images/ProductPage/2_동물의_숲_부케_1.jpg" alt="동물의_숲_부케_이미지">
                                                                                        </p>
                                                                                        <div class="product-detail__jibbitz-item-icon-wrap">
                                                                                            <img src="/images/ProductPage/icon-cart.svg" alt="장바구니 담기" />
                                                                                            <p class="icon-like">
                                                                                                <img src="./public/images/ProductPage/icon-love_line.svg" alt="좋아요 아이콘 비활성화">
                                                                                            </p>
                                                                                        </a>
                                                                                        <a href="#">
                                                                                            <p class="icon-like-fill">
                                                                                                <h3 class="product-detail__desc-item-title">동물의 숲 부케 지비츠™ 참 <br />6팩</h3>
                                                                                            </p>
                                                                                        </a>
                                                                                    </div>
                                                                                    <a href="#">
                                                                                        <p class="icon-cart">
                                                                                            <img src="./public/images/ProductPage/icon-cart.svg" alt="장바구니 담기">
                                                                                        </p>
                                                                                    </a>
                                                                                </div>
                                                                            </div>

                                                                            <div class="product-detail__desc-item-title-wrap">
                                                                                <h3 class="product-detail__desc-item-title">동물의 숲 부케 지비츠™ 참 <br>6팩</h3>
                                                                            </div>
                                                                            <div class="product-detail__desc-item-price-wrap">
                                                                                <img src="/images/ProductPage/2_동물의_숲_부케_1.jpg" alt="동물의_숲_부케_이미지" />
                                                                                <p class="product-detail__breadcrumbs__line"></p>
                                                                                <p class="product-detail__price_sale">20%</p>
                                                                                <p class="product-detail__breadcrumbs__line"></p>
                                                                                <p class="product-detail__price_cost">69,900</p>
                                                                                <img src="/images/ProductPage/icon-love_line.svg" alt="좋아요 아이콘 비활성화" />
                                                                            </div>
                                                                        </div>
                                                                        <div class="product-detail__jibbitz-item-wrap">
                                                                            <div class="product-detail__jibbitz-item">
                                                                                <img src="/images/ProductPage/icon-love_Fill.svg" alt="좋아요 아이콘 활성화" />
                                                                                <div class="product-detail__jibbitz-item">
                                                                                    <p class="product-detail__jibbitz-item-img ">
                                                                                        <img src="./public/images/ProductPage/2_동물의_숲_부케_1.jpg" alt="동물의_숲_부케_이미지">
                                                                                    </p>
                                                                                    <div class="product-detail__jibbitz-item-icon-wrap">
                                                                                        <img src="/images/ProductPage/icon-cart.svg" alt="장바구니 담기" />
                                                                                        <p class="icon-like">
                                                                                            <img src="./public/images/ProductPage/icon-love_line.svg" alt="좋아요 아이콘 비활성화">
                                                                                        </p>
                                                                                    </a>
                                                                                    <a href="#">
                                                                                        <p class="icon-like-fill">
                                                                                            <h3 class="product-detail__desc-item-title">동물의 숲 부케 지비츠™ 참 <br />6팩</h3>
                                                                                        </p>
                                                                                    </a>
                                                                                </div>
                                                                                <a href="#">
                                                                                    <p class="icon-cart">
                                                                                        <img src="./public/images/ProductPage/icon-cart.svg" alt="장바구니 담기">
                                                                                    </p>
                                                                                </a>
                                                                            </div>
                                                                        </div>

                                                                        <div class="product-detail__desc-item-title-wrap">
                                                                            <div className="product-detail product-detail--desc">
                                                                            </div>
                                                                            <h2 className="product-detail__title">상품 상세 설명</h2>
                                                                            <p className="product-detail__sub-title"></p>
                                                                            <p class="product-detail__breadcrumbs__line"></p>
                                                                            <div className="product-detail__toggle">
                                                                                <p class="product-detail__breadcrumbs__line"></p>
                                                                                className="product-detail__toggle-btn product-detail__toggle-btn--open product-detail--desc-btn--open js-toggle"
                                                                            </div>
                                                                            <img src="/images/ProductPage/icon-arrow-down_btn.svg" alt="상세 열기 아이콘 "
                                                                                className="product-detail__toggle-btn__icon-open">
                                                                                <img src="/images/ProductPage/icon-arrow-down_btn-hover.svg" alt="상세 닫기 아이콘"
                                                                                    className="product-detail__toggle-btn__icon-open--hover">
                                                                                    <div class="product-detail product-detail--desc">
                                                                                        {/* <button className="product-detail__toggle-btn product-detail__toggle-btn--close"
                <h2 class="product-detail__title">상품 상세 설명</h2>
                                                    <img src="/images/ProductPage/icon-arrow-up_btn.svg" alt="상세 열기 아이콘 "
                                                        className="product-detail__toggle-btn__icon-close">
                                                    <img src="/images/ProductPage/icon-arrow-up_btn-hover.svg" alt="상세 닫기 아이콘"
                                                        className="product-detail__toggle-btn__icon-close--hover">
                                                </button> */}
                    data-target="#descContent" aria-expanded="false" aria-label="상세 열기">
                                                                                        <img src="./public/images/ProductPage/icon-arrow-down_btn.svg" alt="상세 열기 아이콘 "
                                <div className="product-detail_desc" id="descContent" style={{ display: 'none' }}>
                                                                                            <div className="product-detail_desc__wrap">
                                                                                                <div className="product-detail_desc__item">
                                                                                                    <p className="product-detail_desc__item-title">Easy to Clean</p>
                                                                                                    <span className="product-detail_desc__item-text">
                            aria-expanded="false" aria-label="상세 닫기">
                                                                                                        <img src="./public/images/ProductPage/icon-arrow-up_btn.svg" alt="상세 열기 아이콘 "
                                                                                                            class="product-detail__toggle-btn__icon-close">
                                                                                                            <img src="./public/images/ProductPage/icon-arrow-up_btn-hover.svg" alt="상세 닫기 아이콘"
                                                                                                                class="product-detail__toggle-btn__icon-close--hover">
                                                                                                            </button> -->*/}
                                                                                                        </div>
                                                                                                </div>
                                                                                                <div class="product-detail_desc" id="descContent" style="display:none;">
                                                                                                    <div class="product-detail_desc__wrap">
                                                                                                        <div class="product-detail_desc__item">
                                                                                                            <p class="product-detail_desc__item-title">Easy to Clean</p>
                                                                                                            <span class="product-detail_desc__item-text">
                                                                                                                • 물과 비누로 세척해주세요.<br>
                                                                                                                    • 겉감 : 92% 폴리에스터, 8% 에틸렌비닐아세테이트<br>
                                                                                                                        • 안감 : 92% 폴리에스터, 8% 에틸렌비닐아세테이트<br>
                                                                                                                            • 수입자 : 크록스코리아<br>
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                        <div className="product-detail_desc__item">
                                                                                                                            <p className="product-detail_desc__item-title">클래식 언퍼게터블 스웨이드 클로그</p>
                                                                                                                            <span className="product-detail_desc__item-text">
                                                                                                                                • 궁극의 편안함과 스타일을 원한다면 새로운 클래식 언퍼게터블 클로그의 인조 스웨이드 버전을 만나보세요.<br>
                                                                                                                                    • 클래식 라인드 클로그의 다용도성과 코지 슬리퍼의 온종일 느끼는 편안함이 결합된 새로운 스타일을 만나보세요.<br>
                                                                                                                                        • 비건 인조 스웨이드 어퍼에 슬리퍼의 편안함을 제공하는 인조 퍼 라이너, 칼라 및 백스트랩을 더한 것이 특징입니다.<br>
                                                                                                                                            • Croslite™ 아웃솔의 다용도성 덕분에 어디에서든 하루를 함께할 수 있습니다.<br>
                                                                                                                                                • 발을 감싸주는 부드러움을 선사하는 풋베드가 편안함을 더해주며, 인조 퍼 백스트랩에는 지비츠™ 구멍이 있어 개성을 표현할 수 있습니다.<br>
                                                                                                                                                    • 편안함과 스타일을 극대화해주는 클래식 언퍼게터블 비건 스웨이드 클로그를 신고 하루를 보내세요.
                                                                                                                                                </span>
                                                                                                                                            </div>
                                                                                                                                            <div className="product-detail_desc__item">
                                                                                                                                                <p className="product-detail_desc__item-title">클래식 언퍼게터블 비건 스웨이드 클로그 디테일</p>
                                                                                                                                                <span className="product-detail_desc__item-text">
                                                                                                                                                    • 비건 인조 스웨이드 어퍼<br>
                                                                                                                                                        • 아이코닉한 디자인과 클래식 라인드 클로그의 다용도성<br>
                                                                                                                                                            • 슬리퍼의 편안함을 제공하는 인조 퍼 라이너, 칼라 및 백스트랩<br>
                                                                                                                                                                • 편안함을 더해주는 풋베드의 발을 감싸주는 부드러움<br>
                                                                                                                                                                    • 피보팅 인조 퍼 백스트랩과 개성을 표현할 수 있는 지비츠™ 구멍<br>
                                                                                                                                                                        • 아웃도어용으로 어울리는 Croslite™ 아웃솔이 선사하는 다용도성<br>
                                                                                                                                                                            • 믿기 힘들 정도의 가벼움과 착용의 편리함<br>
                                                                                                                                                                                • Dual Crocs Comfort™: 더없이 만족스러운 지지력. 부드러움. 아늑한 편안함.<br>
                                                                                                                                                                                </span>
                                                                                                                                                                            </div>
                                                                                                                                                                        </div>
                                                                                                                                                                    </div>

                                                                                                                                                                    {/* 싱품 상세 설명 */}
                                                                                                                                                                    <div className="product-detail product-detail--notes">
                                                                                                                                                                        <div class="product-detail__title-wrap">
                                                                                                                                                                            <h2 className="product-detail__title">유의 사항 및 품질보증기간</h2>
                                                                                                                                                                            <p className="product-detail__sub-title"></p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="product-detail__toggle">
                                                                                                                                                                            <button
                                                                                                                                                                                className="product-detail__toggle-btn product-detail__toggle-btn--open product-detail--notes-btn--open js-toggle"
                                                                                                                                                                                data-target="#notesContent" aria-expanded="false" aria-label="상세 열기">
                                                                                                                                                                                <img src="/images/ProductPage/icon-arrow-down_btn.svg" alt="상세 열기 아이콘 "
                                                                                                                                                                                    className="product-detail__toggle-btn__icon-open">
                                                                                                                                                                                    <img src="/images/ProductPage/icon-arrow-down_btn-hover.svg" alt="상세 닫기 아이콘"
                                                                                                                                                                                        className="product-detail__toggle-btn__icon-open--hover">
                                                                                                                                                                                    </button>
                                                                                                                                                                                    {/* <button className="product-detail__toggle-btn product-detail__toggle-btn--close"
                            aria-expanded="false" aria-label="상세 닫기">
                            <img src="/images/ProductPage/icon-arrow-up_btn.svg" alt="상세 열기 아이콘 "
                                className="product-detail__toggle-btn__icon-close">
                            <img src="/images/ProductPage/icon-arrow-up_btn-hover.svg" alt="상세 닫기 아이콘"
                                className="product-detail__toggle-btn__icon-close--hover">
                        </button> */}
                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="product-detail_notes" id="notesContent" style={{ display: 'none' }}>
                                                                                                                                                                            <div className="product-detail_notes__wrap">
                                                                                                                                                                                <div className="product-detail_notes__item">
                                                                                                                                                                                    <p className="product-detail_notes__item-title">유의 사항</p>
                                                                                                                                                                                    <span className="product-detail_notes__item-text">
                                                                                                                                                                                        • 에스컬레이터나 무빙워크에서 사고방지를 위한 안내 안전선 안에 위치하시고, 접촉면 어디에도 닿지 않도록 하십시오. 아이들의 손을 잡고 늘 살펴보세요.<br>
                                                                                                                                                                                            • 미끄러지기 쉬운 장소에서는 주의해 주십시오.<br>
                                                                                                                                                                                                • 발에 맞지 않는 신발 착용 시 찰과상이 발생될 수 있습니다.<br>
                                                                                                                                                                                                    • 36개월미만 어린이는 부자재 장식을 삼킬 위험이 있으니 주의가 필요합니다.<br>

                                                                                                                                                                                                        • 세척시에는 중성세제, 부드러운 스폰지, 상온의 물을 사용하십시오.(천, 가죽, 스웨이드 세척불가)<br>
                                                                                                                                                                                                            • 표백제, 세탁기, 건조기, 탈수기는 사용하지 마십시오.<br>
                                                                                                                                                                                                                • 직사광선이 드는 곳 (차 안 등), 고온다습한 곳에 신발을 보관하지 마십시오.<br>
                                                                                                                                                                                                                    • 물에 장시간 담그지 마시고, 통풍이 양호한 그늘에 완전 건조하십시오.<br>
                                                                                                                                                                                                                        • 가죽, 스웨이드, 천은 물기 및 마찰에 의해 변형, 변색, 물빠짐 현상이 나타날 수 있으며, 의복에 이염되는 경우가 있으니 주의하십시오.<br>
                                                                                                                                                                                                                            • 미끄럼 방지 기능은 오랜기간 착화시 마모로 인해 기능이 저하될 수 있습니다.<br>
                                                                                                                                                                                                                            </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="product-detail_notes__item">
                                                                                                                                                                                                                            <p className="product-detail_notes__item-title">품질보증기간 : 구입후 6개월</p>
                                                                                                                                                                                                                            <span className="product-detail_notes__item-text">
                                                                                                                                                                                                                                • 저희 제품의 결함으로 확인된 제품에 대해서는 공정거래 위원회 고시 소비자 분쟁 해결 기준에 의거 다음과 같이 교환 또는 보상 받을 수 있습니다.<br>
                                                                                                                                                                                                                                    <br>
                                                                                                                                                                                                                                        <span>• 원자재/표면불량</span><br>
                                                                                                                                                                                                                                            ∙ 구입일로부터 6개월이내 동일한 가격 / 제품으로 교환을 원칙<br>
                                                                                                                                                                                                                                                ∙ 동일제품으로 교환 불가능할 시, 유사제품으로 교환<br>
                                                                                                                                                                                                                                                    <br>
                                                                                                                                                                                                                                                        <span>• 보상제외</span><br>
                                                                                                                                                                                                                                                            ∙ 제품에 부착되어 있는 사용방법 및 취급시 주의사항에 따라 제품을 관리해주시고, 소비자 부주의로 인한 품질 이상 변형에 대해서는 책임을 지지
                                                                                                                                                                                                                                                            않습니다.<br>
                                                                                                                                                                                                                                                                ∙ 소비자 과실 및 부주의로 인한 하자/ 착화로 인한 마모 및 파손/ 잘못된 세탁 및 품질보증기간 경과 / 잘못된 착화로 인한 변형 및 품질이상.<br>
                                                                                                                                                                                                                                                                    <br>
                                                                                                                                                                                                                                                                        <span>• 보상절차</span><br>
                                                                                                                                                                                                                                                                            ∙ 주문번호와 제품사진, 제품의 증상을 이메일문의하기를 이용하여 문의하여 주시기 바랍니다.<br>
                                                                                                                                                                                                                                                                            </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="product-detail_notes__item">
                                                                                                                                                                                                                                                                            <p className="product-detail_notes__item-title">크록스코리아 고객센터 : 1661-0677</p>
                                                                                                                                                                                                                                                                            <span className="product-detail_notes__item-text"></span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                                {/* 상품 리뷰 */}
                                                                                                                                                                                                                                                                <div className="product-detail product-detail_review">
                                                                                                                                                                                                                                                                    <div class="product-detail__title-wrap">
                                                                                                                                                                                                                                                                        <h2 className="product-detail__title">상품 리뷰 </h2>
                                                                                                                                                                                                                                                                        <p className="product-detail__sub-title">120명이 상품 리뷰 참여에 참여했습니다.</p>
                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                    <div className="product-detail__toggle">
                                                                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                                            className="product-detail__toggle-btn product-detail__toggle-btn--open product-detail--review-btn--open js-toggle"
                                                                                                                                                                                                                                                                            data-target="#reviewContent" aria-expanded="false" aria-label="상품 리뷰 열기">
                                                                                                                                                                                                                                                                            <img src="/images/ProductPage/icon-arrow-down_btn.svg" alt="상세 열기 아이콘"
                                                                                                                                                                                                                                                                                className="product-detail__toggle-btn__icon-open">
                                                                                                                                                                                                                                                                                <img src="/images/ProductPage/icon-arrow-down_btn-hover.svg" alt="상세 닫기 아이콘"
                                                                                                                                                                                                                                                                                    className="product-detail__toggle-btn__icon-open--hover">
                                                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                                                {/* 접근성: aria-expanded 는 JS 상태 변화에 따라 업데이트 */}
                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                    </div>

                                                                                                                                                                                                                                                                    <div className="product-detail_review">
                                                                                                                                                                                                                                                                        <div className="product-detail_review__wrap" id="reviewContent" style={{ display: 'none' }}>
                                                                                                                                                                                                                                                                            <div className="product-detail_review--write">리뷰 작성하기</div>
                                                                                                                                                                                                                                                                            <div className="product-detail__review-summary">
                                                                                                                                                                                                                                                                                {/*<!-- 평점 -->*/}
                                                                                                                                                                                                                                                                                <div className="product-detail__rating">
                                                                                                                                                                                                                                                                                    <div className="product-detail__rating-wrap">
                                                                                                                                                                                                                                                                                        <p className="product-detail__title">평점 및 리뷰</p>
                                                                                                                                                                                                                                                                                        <div className="product-detail__rating-score-wrap">
                                                                                                                                                                                                                                                                                            <div className="product-detail__rating-score">
                                                                                                                                                                                                                                                                                                <p className="product-detail__rating-value">5</p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__bar">
                                                                                                                                                                                                                                                                                                    <span className="product-detail__bar-fill"></span>
                                                                                                                                                                                                                                                                                                    <span className="product-detail__bar-bg"></span>
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__probability">74%</p>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                            <div className="product-detail__rating-score">
                                                                                                                                                                                                                                                                                                <p className="product-detail__rating-value">4</p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__bar">
                                                                                                                                                                                                                                                                                                    <span className="product-detail__bar-fill"></span>
                                                                                                                                                                                                                                                                                                    <span className="product-detail__bar-bg"></span>
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__probability">74%</p>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                            <div className="product-detail__rating-score">
                                                                                                                                                                                                                                                                                                <p className="product-detail__rating-value">3</p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__bar">
                                                                                                                                                                                                                                                                                                    <span className="product-detail__bar-fill"></span>
                                                                                                                                                                                                                                                                                                    <span className="product-detail__bar-bg"></span>
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__probability">74%</p>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                            <div className="product-detail__rating-score">
                                                                                                                                                                                                                                                                                                <p className="product-detail__rating-value">2</p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__bar">
                                                                                                                                                                                                                                                                                                    <span className="product-detail__bar-fill"></span>
                                                                                                                                                                                                                                                                                                    <span className="product-detail__bar-bg"></span>
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__probability">74%</p>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                            <div className="product-detail__rating-score">
                                                                                                                                                                                                                                                                                                <p className="product-detail__rating-value">1</p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__bar">
                                                                                                                                                                                                                                                                                                    <span className="product-detail__bar-fill"></span>
                                                                                                                                                                                                                                                                                                    <span className="product-detail__bar-bg"></span>
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__probability">74%</p>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                                                {/* 사이즈 */}
                                                                                                                                                                                                                                                                                <div className="product-detail__size">
                                                                                                                                                                                                                                                                                    <div className="product-detail__size-wrap">
                                                                                                                                                                                                                                                                                        <p className="product-detail__title">사이즈</p>
                                                                                                                                                                                                                                                                                        <div className="product-detail__size-score-wrap">
                                                                                                                                                                                                                                                                                            <div className="product-detail__size-score">
                                                                                                                                                                                                                                                                                                <p className="product-detail__size-value">작음</p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__size-bar">
                                                                                                                                                                                                                                                                                                    <span className="product-detail__size-bar-fill"></span>
                                                                                                                                                                                                                                                                                                    <span className="product-detail__size-bar-bg"></span>
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__probability">6%</p>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                            <div className="product-detail__size-score">
                                                                                                                                                                                                                                                                                                <p className="product-detail__size-value">조금 작음</p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__size-bar">
                                                                                                                                                                                                                                                                                                    <span className="product-detail__size-bar-fill"></span>
                                                                                                                                                                                                                                                                                                    <span className="product-detail__size-bar-bg"></span>
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__probability">9%</p>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                            <div className="product-detail__size-score">
                                                                                                                                                                                                                                                                                                <p className="product-detail__size-value">정 사이즈</p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__size-bar">
                                                                                                                                                                                                                                                                                                    <span className="product-detail__size-bar-fill"></span>
                                                                                                                                                                                                                                                                                                    <span className="product-detail__size-bar-bg"></span>
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__probability">74%</p>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                            <div className="product-detail__size-score">
                                                                                                                                                                                                                                                                                                <p className="product-detail__size-value">조금 큼</p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__size-bar">
                                                                                                                                                                                                                                                                                                    <span className="product-detail__size-bar-fill"></span>
                                                                                                                                                                                                                                                                                                    <span className="product-detail__size-bar-bg"></span>
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__probability">9%</p>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                            <div className="product-detail__size-score">
                                                                                                                                                                                                                                                                                                <p className="product-detail__size-value">큼</p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__size-bar">
                                                                                                                                                                                                                                                                                                    <span className="product-detail__size-bar-fill"></span>
                                                                                                                                                                                                                                                                                                    <span className="product-detail__size-bar-bg"></span>
                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__probability">2%</p>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                        </div>



                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                            <div className="product-detail__review-list">
                                                                                                                                                                                                                                                                                <div className="product-detail__review-list-wrap product-detail__review-list-wrap_line-1">
                                                                                                                                                                                                                                                                                    <div className="product-detail__review-info-wrap">
                                                                                                                                                                                                                                                                                        <ul className="product-detail__review-info-list-warp">
                                                                                                                                                                                                                                                                                            <li class="title_start">
                                                                                                                                                                                                                                                                                                <p>★★★★☆</p>
                                                                                                                                                                                                                                                                                            </li>
                                                                                                                                                                                                                                                                                            <li class="title_name">
                                                                                                                                                                                                                                                                                                <p>김⭑우</p>
                                                                                                                                                                                                                                                                                            </li>
                                                                                                                                                                                                                                                                                            <li class="title_date">
                                                                                                                                                                                                                                                                                                <p>2025-11-23</p>
                                                                                                                                                                                                                                                                                            </li>
                                                                                                                                                                                                                                                                                        </ul>
                                                                                                                                                                                                                                                                                        <ul className="product-detail__recommend-wrap">
                                                                                                                                                                                                                                                                                            <li class="recommend-icon">
                                                                                                                                                                                                                                                                                                <a href="#">
                                                                                                                                                                                                                                                                                                    <p><img src="/images/ProductPage/icon-recommend.svg" alt="추천 아이콘" />
                                                                                                                                                                                                                                                                                                    </p>
                                                                                                                                                                                                                                                                                                </a>
                                                                                                                                                                                                                                                                                            </li>
                                                                                                                                                                                                                                                                                            <li class="recommend-text">
                                                                                                                                                                                                                                                                                                <a href="#">
                                                                                                                                                                                                                                                                                                    <p>리뷰추천</p>
                                                                                                                                                                                                                                                                                                </a>
                                                                                                                                                                                                                                                                                            </li>
                                                                                                                                                                                                                                                                                            <li class="recommend-count">
                                                                                                                                                                                                                                                                                                <a href="#">
                                                                                                                                                                                                                                                                                                    <p>120</p>
                                                                                                                                                                                                                                                                                                </a>
                                                                                                                                                                                                                                                                                            </li>
                                                                                                                                                                                                                                                                                        </ul>
                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                    <div className="product-detail__review-text-wrap">
                                                                                                                                                                                                                                                                                        <p className="product-detail__review-title">너무 마음에 들어요!!!!!!!</p>
                                                                                                                                                                                                                                                                                        <p className="product-detail__review-text">크록스 편하고 좋은건 말해모해요~~~<br />
                                                                                                                                                                                                                                                                                            일단 너무 편하고 좋네요~ 당연하게도 통풍도 잘 되고. 오랫동안 신어도 발아픈것도 없고 좋아요!<br>
                                                                                                                                                                                                                                                                                                디자인도 너무 예쁘고 색상도 다양해서 고르는 재미도 있네요. 추천 합니다!<br>
                                                                                                                                                                                                                                                                                                    선물용으로 구매했습니다 290이 매장에 잘 없어서 주문했어요</p>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                    <div className="product-detail__review-list-wrap
                            product-detail__review-list-wrap_line-1">
                                                                                                                                                                                                                                                                                        <div className="product-detail__review-info-wrap">
                                                                                                                                                                                                                                                                                            <ul className="product-detail__review-info-list-warp">
                                                                                                                                                                                                                                                                                                <li class="title_start">
                                                                                                                                                                                                                                                                                                    <p>★★★★☆</p>
                                                                                                                                                                                                                                                                                                </li>
                                                                                                                                                                                                                                                                                                <li class="title_name">
                                                                                                                                                                                                                                                                                                    <p>김⭑우</p>
                                                                                                                                                                                                                                                                                                </li>
                                                                                                                                                                                                                                                                                                <li class="title_date">
                                                                                                                                                                                                                                                                                                    <p>2025-11-23</p>
                                                                                                                                                                                                                                                                                                </li>
                                                                                                                                                                                                                                                                                            </ul>
                                                                                                                                                                                                                                                                                            <ul className="product-detail__recommend-wrap">
                                                                                                                                                                                                                                                                                                <li class="recommend-icon">
                                                                                                                                                                                                                                                                                                    <a href="#">
                                                                                                                                                                                                                                                                                                        <p><img src="/images/ProductPage/icon-recommend.svg" alt="추천 아이콘" />
                                                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                                                                    </a>
                                                                                                                                                                                                                                                                                                </li>
                                                                                                                                                                                                                                                                                                <li class="recommend-text">
                                                                                                                                                                                                                                                                                                    <a href="#">
                                                                                                                                                                                                                                                                                                        <p>리뷰추천</p>
                                                                                                                                                                                                                                                                                                    </a>
                                                                                                                                                                                                                                                                                                </li>
                                                                                                                                                                                                                                                                                                <li class="recommend-count">
                                                                                                                                                                                                                                                                                                    <a href="#">
                                                                                                                                                                                                                                                                                                        <p>120</p>
                                                                                                                                                                                                                                                                                                    </a>
                                                                                                                                                                                                                                                                                                </li>
                                                                                                                                                                                                                                                                                            </ul>
                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                        <div className="product-detail__review-text-wrap">
                                                                                                                                                                                                                                                                                            <p className="product-detail__review-title">너무 마음에 들어요!!!!!!!</p>
                                                                                                                                                                                                                                                                                            <p className="product-detail__review-text">크록스 편하고 좋은건 말해모해요~~~<br />
                                                                                                                                                                                                                                                                                                일단 너무 편하고 좋네요~ 당연하게도 통풍도 잘 되고. 오랫동안 신어도 발아픈것도 없고 좋아요!<br>
                                                                                                                                                                                                                                                                                                    디자인도 너무 예쁘고 색상도 다양해서 고르는 재미도 있네요. 추천 합니다!<br>
                                                                                                                                                                                                                                                                                                        선물용으로 구매했습니다 290이 매장에 잘 없어서 주문했어요</p>
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                        <div className="product-detail__review-list-wrap product-detail__review-list-wrap_line-2">
                                                                                                                                                                                                                                                                                            <div className="product-detail__review-info-wrap">
                                                                                                                                                                                                                                                                                                <ul className="product-detail__review-info-list-warp">
                                                                                                                                                                                                                                                                                                    <li class="title_start">
                                                                                                                                                                                                                                                                                                        <p>★★★★☆</p>
                                                                                                                                                                                                                                                                                                    </li>
                                                                                                                                                                                                                                                                                                    <li class="title_name">
                                                                                                                                                                                                                                                                                                        <p>김⭑우</p>
                                                                                                                                                                                                                                                                                                    </li>
                                                                                                                                                                                                                                                                                                    <li class="title_date">
                                                                                                                                                                                                                                                                                                        <p>2025-11-23</p>
                                                                                                                                                                                                                                                                                                    </li>
                                                                                                                                                                                                                                                                                                </ul>
                                                                                                                                                                                                                                                                                                <ul className="product-detail__recommend-wrap">
                                                                                                                                                                                                                                                                                                    <li class="recommend-icon">
                                                                                                                                                                                                                                                                                                        <a href="#">
                                                                                                                                                                                                                                                                                                            <p><img src="/images/ProductPage/icon-recommend.svg" alt="추천 아이콘" />
                                                                                                                                                                                                                                                                                                            </p>
                                                                                                                                                                                                                                                                                                        </a>
                                                                                                                                                                                                                                                                                                    </li>
                                                                                                                                                                                                                                                                                                    <li class="recommend-text">
                                                                                                                                                                                                                                                                                                        <a href="#">
                                                                                                                                                                                                                                                                                                            <p>리뷰추천</p>
                                                                                                                                                                                                                                                                                                        </a>
                                                                                                                                                                                                                                                                                                    </li>
                                                                                                                                                                                                                                                                                                    <li class="recommend-count">
                                                                                                                                                                                                                                                                                                        <a href="#">
                                                                                                                                                                                                                                                                                                            <p>120</p>
                                                                                                                                                                                                                                                                                                        </a>
                                                                                                                                                                                                                                                                                                    </li>
                                                                                                                                                                                                                                                                                                </ul>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                            <div className="product-detail__review-text-wrap">
                                                                                                                                                                                                                                                                                                <p className="product-detail__review-title">너무 마음에 들어요!!!!!!!</p>
                                                                                                                                                                                                                                                                                                <p className="product-detail__review-text">크록스 편하고 좋은건 말해모해요~~~<br />
                                                                                                                                                                                                                                                                                                    일단 너무 편하고 좋네요~ 당연하게도 통풍도 잘 되고. 오랫동안 신어도 발아픈것도 없고 좋아요!<br>
                                                                                                                                                                                                                                                                                                        디자인도 너무 예쁘고 색상도 다양해서 고르는 재미도 있네요. 추천 합니다!<br>
                                                                                                                                                                                                                                                                                                            선물용으로 구매했습니다 290이 매장에 잘 없어서 주문했어요</p>
                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                            <div className="product-detail__review-list-wrap 
                            product-detail__review-list-wrap_line-2">
                                                                                                                                                                                                                                                                                                <div className="product-detail__review-info-wrap">
                                                                                                                                                                                                                                                                                                    <ul className="product-detail__review-info-list-warp">
                                                                                                                                                                                                                                                                                                        <li class="title_start">
                                                                                                                                                                                                                                                                                                            <p>★★★★☆</p>
                                                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                                                                        <li class="title_name">
                                                                                                                                                                                                                                                                                                            <p>김⭑우</p>
                                                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                                                                        <li class="title_date">
                                                                                                                                                                                                                                                                                                            <p>2025-11-23</p>
                                                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                                                                    </ul>
                                                                                                                                                                                                                                                                                                    <ul className="product-detail__recommend-wrap">
                                                                                                                                                                                                                                                                                                        <li class="recommend-icon">
                                                                                                                                                                                                                                                                                                            <a href="#">
                                                                                                                                                                                                                                                                                                                <p><img src="/images/ProductPage/icon-recommend.svg" alt="추천 아이콘" />
                                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                            </a>
                                                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                                                                        <li class="recommend-text">
                                                                                                                                                                                                                                                                                                            <a href="#">
                                                                                                                                                                                                                                                                                                                <p>리뷰추천</p>
                                                                                                                                                                                                                                                                                                            </a>
                                                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                                                                        <li class="recommend-count">
                                                                                                                                                                                                                                                                                                            <a href="#">
                                                                                                                                                                                                                                                                                                                <p>120</p>
                                                                                                                                                                                                                                                                                                            </a>
                                                                                                                                                                                                                                                                                                        </li>
                                                                                                                                                                                                                                                                                                    </ul>
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                <div className="product-detail__review-text-wrap">
                                                                                                                                                                                                                                                                                                    <p className="product-detail__review-title">너무 마음에 들어요!!!!!!!</p>
                                                                                                                                                                                                                                                                                                    <p className="product-detail__review-text">크록스 편하고 좋은건 말해모해요~~~<br />
                                                                                                                                                                                                                                                                                                        일단 너무 편하고 좋네요~ 당연하게도 통풍도 잘 되고. 오랫동안 신어도 발아픈것도 없고 좋아요!<br>
                                                                                                                                                                                                                                                                                                            디자인도 너무 예쁘고 색상도 다양해서 고르는 재미도 있네요. 추천 합니다!<br>
                                                                                                                                                                                                                                                                                                                선물용으로 구매했습니다 290이 매장에 잘 없어서 주문했어요</p>
                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                            <div className="product-detail_review--more">리뷰 더보기</div>
                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                </section>

                                                                                                                                                                                                                                                                                {/* 구매하기 영역 */}
                                                                                                                                                                                                                                                                                <section className="select-buy">
                                                                                                                                                                                                                                                                                    <div className="select-buy__wrap">

                                                                                                                                                                                                                                                                                        {/* 타이틀 영역 */}
                                                                                                                                                                                                                                                                                        <div className="select-buy__title_wrap">
                                                                                                                                                                                                                                                                                            <p class="select-buy__subtitle">{CrocsProduct.product}</p>
                                                                                                                                                                                                                                                                                            <h2 class="select-buy__title">{CrocsProduct.product}</h2>
                                                                                                                                                                                                                                                                                            <div className="select-buy__price">
                                                                                                                                                                                                                                                                                                <span class="select-buy__price_dc_rate">{detailPrice ? detailPrice.toLocaleString() : '가격
                        없음'}</span>
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
}

                                                                                                                                                                                                                                                                            export default CrocsProductDetail

