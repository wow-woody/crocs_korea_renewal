import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCrocsProductStore } from "../store/useCrocsProductStore";
import { wishListStore } from "../store/wishListStore";
import { useCartStore } from "../store/useCartStore"; // ⭐ 추가
import Title from "../components/Title";
import WishAddPopup from "../components/WishAddPopup";
import { useCrocsSizeStore } from "../store/useCrocsSizeStore";

const CrocsProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { crocsItems, onFetchItems } = useCrocsProductStore();
    const { crocsSizesByCategory, onFetchSize } = useCrocsSizeStore();
    const { onAddWishList } = wishListStore(); // ⭐ onProductAddCart 제거
    const { addProductToCart } = useCartStore(); // ⭐ 추가

    const [CrocsProduct, setCrocsProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState("brown");
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);

    // 가격 파싱 유틸
    const parsePriceNumber = useCallback((p) => {
        if (!p) return 0;
        const num = String(p).replace(/[^0-9]/g, "");
        return Number(num || 0);
    }, []);

    // 가격 계산 함수
    const getDetailPrice = (product) => {
        if (!product) return 0;

        if (product.price) {
            return Number(String(product.price).replace(/,/g, ""));
        }

        if (product.prices && product.prices.length > 0) {
            const sale = product.prices[1] || product.prices[0] || "0";
            return Number(String(sale).replace(/,/g, ""));
        }

        return 0;
    };

    // 원가 계산
    const getOriginalPrice = (product) => {
        if (!product || !product.prices) return null;
        const origin = product.prices[0];
        if (!origin) return null;
        return Number(String(origin).replace(/,/g, ""));
    };

    // 할인율 계산
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

    // 토글 섹션 상태
    const [openJibbitz, setOpenJibbitz] = useState(false);
    const [openDesc, setOpenDesc] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);
    const [openReview, setOpenReview] = useState(false);

    const jibbitzItems = [
        { id: 1, name: "지비츠 참 A", price: "₩4,900", img: "/images/ProductPage/imgi_53_crocs.avif" },
        { id: 2, name: "지비츠 참 B", price: "₩5,900", img: "/images/ProductPage/imgi_54_crocs.avif" },
        { id: 3, name: "지비츠 참 C", price: "₩6,900", img: "/images/ProductPage/imgi_55_crocs.avif" },
    ];

    const colorOptions = [
        { key: "black", label: "블랙" },
        { key: "brown", label: "브라운" },
        { key: "pink", label: "핑크" },
        { key: "green", label: "그린" },
        { key: "blue", label: "블루" },
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
        if (!cate) return "women";
        const c = cate.split(",")[0].trim().toLowerCase();
        if (c.includes("men") || c.includes("남성") || c.includes("man")) return "men";
        if (c.includes("women") || c.includes("여성") || c.includes("woman")) return "women";
        if (c.includes("kid") || c.includes("아동") || c.includes("주니어")) return "kids";
        return "women";
    };

    const mainCate = normalizeCate(CrocsProduct.cate);
    const categorySizes = crocsSizesByCategory[mainCate] || [];

    // 이미지 배열 통일
    const images = Array.isArray(CrocsProduct.product_img)
        ? CrocsProduct.product_img
        : String(CrocsProduct.product_img).split(",").map((v) => v.trim()).filter(Boolean);

    // ⭐ 장바구니 추가 핸들러
    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("사이즈를 선택해주세요!");
            return;
        }

        const productToAdd = {
            id: CrocsProduct.id,
            name: CrocsProduct.product,
            title: CrocsProduct.product,
            price: detailPrice,
            product_img: Array.isArray(CrocsProduct.product_img)
                ? CrocsProduct.product_img[0]
                : CrocsProduct.product_img,
            size: selectedSize,
            // useCartStore의 addProductToCart에 필요한 데이터
            discountPrice: hasOriginal ? detailPrice : null,
            price_dc_rate: hasOriginal ? detailPrice : null,
        };

        console.log("🛒 장바구니 추가:", productToAdd);

        const success = addProductToCart(productToAdd, quantity);

        if (success) {
            const goToCart = window.confirm("장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?");
            if (goToCart) {
                navigate("/cart");
            }
        }
    };

    return (
        <div className='sub_page'>
            <div className='inner'>
                <Title title='ProductDetail' />
                <div className='product-detail-wrap'>
                    {/* 이미지 영역 */}
                    <div className='product-img'>
                        <div className='product-img__crumbs-wrap'>
                            <ul className='product-img__crumbs'>
                                <li className='product-img__crumb product-img__crumb--home'>
                                    <a href='/' className='product-img__link' aria-label='홈'>
                                        <img
                                            className='product-img__icon'
                                            src='/images/Sub_Women_Images/icon-close_cross.svg'
                                            alt='홈'
                                        />
                                    </a>
                                </li>
                                <li className='product-img__sep'><span>:</span></li>
                                <li className='product-img__crumb product-img__crumb--category'>
                                    <button type='button' className='product-img__link'>
                                        <span className='product-img__text'>{mainCate}</span>
                                    </button>
                                </li>
                                <li className='product-img__sep'><span>:</span></li>
                                <li className='product-img__crumb product-img__crumb--current'>
                                    <button type='button' className='product-img__link' aria-current='page'>
                                        <span className='product-img__text'>{CrocsProduct.product}</span>
                                        <img
                                            className='product-img__icon'
                                            src='/images/Sub_Women_Images/icon-close_cross.svg'
                                            alt='닫기'
                                        />
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className='product-img__main-wrap'>
                            <ul className='product-img__list product-img__list--main'>
                                <li className='product-img__item'>
                                    <img
                                        className='product-img__img'
                                        src={images[selectedImageIdx]}
                                        alt={CrocsProduct.product}
                                    />
                                </li>
                            </ul>
                        </div>
                        <div className='product-img__thumbs-wrap'>
                            <div className='thumbs__ctrl thumbs__ctrl--top' aria-hidden='true'>
                                <button type='button' className='thumbs__btn thumbs__btn--up' tabIndex={-1}>
                                    <img className='thumbs__icon' src='/images/icon-arrow-up-hairline.svg' alt='' />
                                </button>
                                <button type='button' className='thumbs__btn thumbs__btn--active' tabIndex={-1}>
                                    <img className='thumbs__icon' src='/images/icon-arrow-up-green.svg' alt='' />
                                </button>
                            </div>
                            <ul className='product-img__thumbs-list'>
                                {images.map((img, idx) => (
                                    <li key={idx} className='product-img__thumbs-item'>
                                        <button
                                            type='button'
                                            className='product-img__thumbs-link'
                                            onClick={() => setSelectedImageIdx(idx)}
                                        >
                                            <img
                                                className='product-img__thumbs-img'
                                                src={img}
                                                alt={`${CrocsProduct.product} 썸네일 ${idx + 1}`}
                                                style={
                                                    selectedImageIdx === idx
                                                        ? { filter: "brightness(1.05)", transform: "scale(1.05)" }
                                                        : undefined
                                                }
                                            />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className='thumbs__ctrl thumbs__ctrl--bottom' aria-hidden='true'>
                                <button type='button' className='thumbs__btn thumbs__btn--down' tabIndex={-1}>
                                    <img className='thumbs__icon' src='/images/icon-arrow-down-hairline.svg' alt='' />
                                </button>
                                <button type='button' className='thumbs__btn thumbs__btn--active' tabIndex={-1}>
                                    <img className='thumbs__icon' src='/images/icon-arrow-down-green.svg' alt='' />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 상품 정보 영역 */}
                    <div className='product-info__wrap'>
                        <div className='product-info'>
                            <div className='product-info__title_wrap'>
                                <p className='product-info__subtitle'>{CrocsProduct.product}</p>
                                <h2 className='product-info__title'>{CrocsProduct.product}</h2>
                                <div className='product-info__price'>
                                    <span className='product-info__price_dc_rate'>
                                        {detailPrice ? detailPrice.toLocaleString() : "가격 없음"}
                                    </span>
                                    {hasOriginal && (
                                        <>
                                            <span className='product-info__price_breadcrumbs__line' />
                                            <span className='product-info__price_sale'>{discountPercent}%</span>
                                            <span className='product-info__price_breadcrumbs__line' />
                                            <span className='product-info__price_cost'>
                                                {originalPrice.toLocaleString()}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className='product-info_breadcrumbs' />

                            {/* 색상 선택 */}
                            <div className='product-info_color'>
                                <div className='product-info__color-title-wrap'>
                                    <p className='product-info__color-title'>색상</p>
                                    <span className='product-info__price_breadcrumbs__line' />
                                    <p className='product-info__color-select'>
                                        {colorOptions.find((c) => c.key === selectedColor)?.label || "브라운"}
                                    </p>
                                </div>
                                <div className='product-info__color-badge-wrap' role='group' aria-label='색상 선택'>
                                    {colorOptions.map((c) => (
                                        <button
                                            key={c.key}
                                            type='button'
                                            className={`color-badge color-badge--${c.key} ${selectedColor === c.key ? "active" : ""}`}
                                            onClick={() => handleColorSelect(c.key)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* 사이즈 선택 */}
                            <div className='product-info_size'>
                                <div className='product-info_size-title-wrap'>
                                    <p className='product-info_size-title'>사이즈</p>
                                    <span className='product-info_size_breadcrumbs__line' />
                                    <p className='product-info_size-select'>{selectedSize || "선택하세요"}</p>
                                </div>
                                <div className='product-info_size-btns-wrap'>
                                    <ul className='product-info_size-btns' role='group' aria-label='사이즈 선택'>
                                        {categorySizes.map((size) => (
                                            <li key={size}>
                                                <button
                                                    type='button'
                                                    className={selectedSize === size ? "active" : ""}
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

                            {/* ⭐ 수정된 장바구니 버튼 */}
                            <button className='product-btn-cart' onClick={handleAddToCart}>
                                장바구니
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrocsProductDetail;