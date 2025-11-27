import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collaboAuthStore } from '../store/collaboAuthStore';
import { wishListStore } from '../store/wishListStore';
import WishAddPopup from '../components/WishAddPopup';
import './scss/CrocsProductDetail.scss';
import ProductReviews from '../components/ProductReviews';

const JibbitzProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { jibbitzItems, onFetchJibbitz } = collaboAuthStore();
    const { onAddWishList, onProductAddCart } = wishListStore();

    const [JibbitzProduct, setJibbitzProduct] = useState(null);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);

    // ⭐ 선택된 상품 리스트 (배열로 관리)
    const [selectedProducts, setSelectedProducts] = useState([]);

    // ⭐ localStorage에서 불러오기 또는 기본 상품 추가
    useEffect(() => {
        const savedProducts = localStorage.getItem(`selectedProducts_${id}`);
        if (savedProducts) {
            try {
                const parsed = JSON.parse(savedProducts);
                setSelectedProducts(parsed);
            } catch (error) {
                console.error('Failed to parse saved products:', error);
            }
        }
    }, [id]);

    // ⭐ 상품 정보 로드 시 기본 수량 1개 자동 추가
    useEffect(() => {
        if (!JibbitzProduct) return;

        // localStorage에 저장된 것이 없고, selectedProducts가 비어있을 때만 자동 추가
        const savedProducts = localStorage.getItem(`selectedProducts_${id}`);
        if (!savedProducts && selectedProducts.length === 0) {
            const defaultProduct = {
                id: Date.now(),
                productId: JibbitzProduct.id,
                name: JibbitzProduct.title,
                quantity: 1,
                price: getDetailPrice(JibbitzProduct),
            };
            setSelectedProducts([defaultProduct]);
        }
    }, [JibbitzProduct, id]);

    // ⭐ selectedProducts 변경 시 localStorage에 저장
    useEffect(() => {
        if (selectedProducts.length > 0) {
            localStorage.setItem(`selectedProducts_${id}`, JSON.stringify(selectedProducts));
        } else {
            localStorage.removeItem(`selectedProducts_${id}`);
        }
    }, [selectedProducts, id]);

    // 토글 상태
    const [openJibbitz, setOpenJibbitz] = useState(false);
    const [openDesc, setOpenDesc] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);
    const [openReview, setOpenReview] = useState(false);

    // 가격 계산
    const getDetailPrice = (product) => {
        if (!product) return 0;

        // discountPrice가 있으면 우선 사용
        if (product.discountPrice) {
            return Number(String(product.discountPrice).replace(/[^0-9]/g, ''));
        }

        // 없으면 price 사용
        if (product.price) {
            return Number(String(product.price).replace(/[^0-9]/g, ''));
        }

        return 0;
    };

    const getOriginalPrice = (product) => {
        if (!product) return null;

        // discountPrice가 있을 때만 원가 표시
        if (product.discountPrice && product.price) {
            return Number(String(product.price).replace(/[^0-9]/g, ''));
        }

        return null;
    };

    const detailPrice = JibbitzProduct ? getDetailPrice(JibbitzProduct) : 0;
    const originalPrice = JibbitzProduct ? getOriginalPrice(JibbitzProduct) : null;
    const hasOriginal = originalPrice !== null && originalPrice > detailPrice;
    const discountPercent = hasOriginal
        ? Math.round(((originalPrice - detailPrice) / originalPrice) * 100)
        : null;

    // ⭐ 상품 추가 (지비츠는 사이즈/색상 없음)
    const handleAddProduct = () => {
        // 이미 추가된 상품이 있는지 확인
        const existingIndex = selectedProducts.findIndex((p) => p.productId === JibbitzProduct.id);

        if (existingIndex !== -1) {
            // 이미 있으면 수량 증가
            const updated = [...selectedProducts];
            updated[existingIndex].quantity += 1;
            setSelectedProducts(updated);
        } else {
            // 없으면 새로 추가
            const newProduct = {
                id: Date.now(),
                productId: JibbitzProduct.id,
                name: JibbitzProduct.title,
                quantity: 1,
                price: detailPrice,
            };
            setSelectedProducts([...selectedProducts, newProduct]);
        }
    };

    // ⭐ 수량 증가
    const increaseQty = (productId) => {
        setSelectedProducts(
            selectedProducts.map((p) =>
                p.id === productId ? { ...p, quantity: p.quantity + 1 } : p
            )
        );
    };

    // ⭐ 수량 감소
    const decreaseQty = (productId) => {
        setSelectedProducts(
            selectedProducts.map((p) =>
                p.id === productId && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p
            )
        );
    };

    // ⭐ 상품 삭제
    const removeProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
    };

    // ⭐ 총 수량 계산
    const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);

    // ⭐ 총 가격 계산
    const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // 상품 불러오기
    useEffect(() => {
        onFetchJibbitz();
    }, []);

    useEffect(() => {
        if (!id || jibbitzItems.length === 0) return;
        const findJibbitzItem = jibbitzItems.find((item) => String(item.id) === String(id));
        setJibbitzProduct(findJibbitzItem);
    }, [id, jibbitzItems]);

    if (!JibbitzProduct) {
        return (
            <div className="product-detail-container">
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    상품 정보를 불러오고 있습니다...
                </div>
            </div>
        );
    }

    // 이미지 배열 처리
    const images = Array.isArray(JibbitzProduct.imageUrl)
        ? JibbitzProduct.imageUrl
        : [JibbitzProduct.imageUrl];

    return (
        <div className="product-detail-container">
            {/* 메인 콘텐츠 */}
            <div className="product-detail-content">
                {/* 왼쪽: 이미지 영역 */}
                <div className="product-image-section">
                    {/* 메인 이미지 */}
                    <div className="main-image-wrapper">
                        <img src={images[selectedImageIdx]} alt={JibbitzProduct.title} />
                    </div>

                    {/* 썸네일 */}
                    {images.length > 1 && (
                        <div className="thumbnail-list">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`thumbnail-item ${
                                        idx === selectedImageIdx ? 'active' : ''
                                    }`}
                                    onClick={() => setSelectedImageIdx(idx)}
                                >
                                    <img src={img} alt={`썸네일 ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 오른쪽: 상품 정보 */}
                <div className="product-info-section">
                    {/* 상품 헤더 */}
                    <div className="product-header">
                        <p className="product-subtitle">Jibbitz™ 참</p>
                        <h2 className="product-title">{JibbitzProduct.title}</h2>
                        <div className="product-price">
                            {hasOriginal && discountPercent && (
                                <span className="discount-rate">{discountPercent}%</span>
                            )}
                            <span className="sale-price">₩{detailPrice.toLocaleString()}</span>
                            {hasOriginal && (
                                <span className="original-price">
                                    ₩{originalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 선택된 상품 목록 */}
                    {selectedProducts.length > 0 && (
                        <div className="selected-products">
                            {selectedProducts.map((product) => (
                                <div key={product.id} className="selected-item">
                                    <div className="item-info">
                                        <span className="item-name">{product.name}</span>
                                    </div>
                                    <div className="quantity-controls">
                                        <button
                                            className="quantity-btn"
                                            onClick={() => decreaseQty(product.id)}
                                            disabled={product.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="quantity">{product.quantity}</span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => increaseQty(product.id)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeProduct(product.id)}
                                        title="상품 삭제"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 총 상품 금액 */}
                    <div className="total-price-section">
                        <h3 className="total-header">총 상품 금액</h3>
                        <div className="total-content">
                            <div className="total-quantity">
                                총 수량 <span className="quantity">{totalQuantity}</span>개
                            </div>
                            <div className="total-price">
                                <span className="price">{totalPrice.toLocaleString()}</span>
                                <span className="unit">원</span>
                            </div>
                        </div>
                    </div>

                    {/* 구매 버튼 */}
                    <div className="action-buttons">
                        <button
                            className="btn-wishlist"
                            onClick={() => onAddWishList(JibbitzProduct)}
                        >
                            💚
                        </button>
                        <WishAddPopup />
                        <button
                            className="btn-cart"
                            onClick={() => {
                                if (selectedProducts.length === 0) {
                                    alert('상품을 추가해주세요.');
                                    return;
                                }
                                selectedProducts.forEach((product) => {
                                    onProductAddCart({
                                        id: product.productId,
                                        name: product.name,
                                        title: product.name,
                                        price: product.price,
                                        quantity: product.quantity,
                                        product_img: images[0],
                                    });
                                });
                            }}
                        >
                            장바구니
                        </button>
                        <WishAddPopup />
                        <button
                            className="btn-buy"
                            onClick={() => {
                                if (selectedProducts.length === 0) {
                                    alert('상품을 추가해주세요.');
                                    return;
                                }

                                const orderProducts = selectedProducts.map((product) => ({
                                    id: product.productId,
                                    name: product.name,
                                    product: product.name,
                                    price: product.price,
                                    quantity: product.quantity,
                                    product_img: images[0],
                                    cate: 'Jibbitz',
                                }));

                                selectedProducts.forEach((product) => {
                                    onProductAddCart({
                                        id: product.productId,
                                        name: product.name,
                                        title: product.name,
                                        price: product.price,
                                        quantity: product.quantity,
                                        product_img: images[0],
                                    });
                                });

                                localStorage.removeItem(`selectedProducts_${id}`);

                                navigate('/order', {
                                    state: {
                                        orderProducts: orderProducts,
                                    },
                                });
                            }}
                        >
                            구매하기
                        </button>
                    </div>
                </div>
            </div>

            {/* 하단: 상세 정보 탭 */}
            <div className="product-details-tabs">
                {/* 상품 설명 */}
                <div className="tab-section">
                    <div
                        className={`tab-header ${openDesc ? 'active' : ''}`}
                        onClick={() => setOpenDesc(!openDesc)}
                    >
                        <h3 className="tab-title">상품 상세 설명</h3>
                        <div className="tab-icon">
                            <img src="/images/Sub_Women_Images/icon-arrow-down.svg" alt="토글" />
                        </div>
                    </div>
                    <div className={`tab-content ${openDesc ? 'active' : ''}`}>
                        <div className="content-inner">
                            <div className="desc-section">
                                <h4 className="desc-title">Jibbitz™ 참</h4>
                                <ul className="desc-list">
                                    <li>크록스만의 개성을 표현할 수 있는 Jibbitz™ 참</li>
                                    <li>다양한 디자인으로 나만의 크록스를 꾸며보세요</li>
                                    <li>크록스 구멍에 간편하게 착탈 가능</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 유의사항 */}
                <div className="tab-section">
                    <div
                        className={`tab-header ${openNotes ? 'active' : ''}`}
                        onClick={() => setOpenNotes(!openNotes)}
                    >
                        <h3 className="tab-title">유의 사항</h3>
                        <div className="tab-icon">
                            <img src="/images/Sub_Women_Images/icon-arrow-down.svg" alt="토글" />
                        </div>
                    </div>
                    <div className={`tab-content ${openNotes ? 'active' : ''}`}>
                        <div className="content-inner">
                            <div className="desc-section">
                                <h4 className="desc-title">사용 시 주의사항</h4>
                                <ul className="desc-list">
                                    <li>
                                        36개월 미만 어린이는 삼킬 위험이 있으니 주의가 필요합니다.
                                    </li>
                                    <li>강한 충격이나 무리한 힘을 가하면 파손될 수 있습니다.</li>
                                    <li>불에 가까이 하지 마십시오.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 리뷰 */}
                {/* <div className="tab-section">
                    <div
                        className={`tab-header ${openReview ? 'active' : ''}`}
                        onClick={() => setOpenReview(!openReview)}
                    >
                        <h3 className="tab-title">
                            리뷰
                            <span className="tab-subtitle">(0)</span>
                        </h3>
                        <div className="tab-icon">
                            <img src="/images/Sub_Women_Images/icon-arrow-down.svg" alt="토글" />
                        </div>
                    </div>
                    <div className={`tab-content ${openReview ? 'active' : ''}`}>
                        <div className="content-inner">리뷰 목록이 여기에 표시됩니다.</div>
                    </div>
                </div> */}
                {/* 리뷰 */}
                <div className="tab-section">
                    <div
                        className={`tab-header ${openReview ? 'active' : ''}`}
                        onClick={() => setOpenReview(!openReview)}
                    >
                        <h3 className="tab-title">
                            리뷰
                            <span className="tab-subtitle">(1,747)</span>
                        </h3>
                        <div className="tab-icon">
                            <img src="/images/Sub_Women_Images/icon-arrow-down.svg" alt="토글" />
                        </div>
                    </div>
                    <div className={`tab-content ${openReview ? 'active' : ''}`}>
                        <div className="content-inner">
                            <ProductReviews productId="205089" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JibbitzProductDetail;
