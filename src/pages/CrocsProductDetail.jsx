import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrocsProductStore } from '../store/useCrocsProductStore';
import { wishListStore } from '../store/wishListStore';
import WishAddPopup from '../components/WishAddPopup';
import { useCrocsSizeStore } from '../store/useCrocsSizeStore';
import { jibbitzs } from '../data/jibbitzs';
import AdultSize from '../components/AdultSize';
import KidSize from '../components/KidSize';
import './scss/CrocsProductDetail.scss';
import ProductReviews from '../components/ProductReviews';

const CrocsProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // ⭐ 추가
    const { crocsItems, onFetchItems } = useCrocsProductStore();
    const { crocsSizesByCategory, onFetchSize } = useCrocsSizeStore();
    const { onAddWishList, onProductAddCart } = wishListStore();

    const [CrocsProduct, setCrocsProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState('brown');
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);

    // 카테고리 기반 사이즈 자동 부여
    // -----------------------------------
    const normalizeCate = (cateString) => {
        if (!cateString) return null;
        const lower = cateString.toLowerCase();

        if (lower.includes('kid') || lower.includes('키즈')) return 'kids';
        if (lower.includes('women') || lower.includes('여성') || lower.includes('여'))
            return 'women';
        if (lower.includes('men') || lower.includes('남성') || lower.includes('남')) return 'men';

        return null;
    };

    // ⭐ 선택된 상품 리스트 (배열로 관리)
    const [selectedProducts, setSelectedProducts] = useState([]);

    // ⭐ localStorage에서 불러오기 (새로고침 시 복원)
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

    // ⭐ 사이즈표 모달 상태
    const [showSizeChart, setShowSizeChart] = useState(false);

    // ⭐ 랜덤 지비츠 상태
    const [randomJibbitz, setRandomJibbitz] = useState([]);

    // 가격 계산
    const getDetailPrice = (product) => {
        if (!product) return 0;
        if (product.price) {
            return Number(String(product.price).replace(/,/g, ''));
        }
        if (product.prices && product.prices.length > 0) {
            const sale = product.prices[1] || product.prices[0] || '0';
            return Number(String(sale).replace(/,/g, ''));
        }
        return 0;
    };

    const getOriginalPrice = (product) => {
        if (!product || !product.prices) return null;
        const origin = product.prices[0];
        if (!origin) return null;
        return Number(String(origin).replace(/,/g, ''));
    };

    const detailPrice = CrocsProduct ? getDetailPrice(CrocsProduct) : 0;
    const originalPrice = CrocsProduct ? getOriginalPrice(CrocsProduct) : null;
    const hasOriginal = originalPrice !== null && originalPrice > detailPrice;
    const discountPercent = hasOriginal
        ? Math.round(((originalPrice - detailPrice) / originalPrice) * 100)
        : null;

    // ⭐ 사이즈 선택 시 리스트에 추가
    const handleAddProduct = () => {
        if (!selectedSize) {
            alert('사이즈를 선택해주세요.');
            return;
        }

        // 같은 색상+사이즈 조합이 이미 있는지 확인
        const existingIndex = selectedProducts.findIndex(
            (p) => p.color === selectedColor && p.size === selectedSize
        );

        if (existingIndex !== -1) {
            // 이미 있으면 수량 증가
            const updated = [...selectedProducts];
            updated[existingIndex].quantity += 1;
            setSelectedProducts(updated);
        } else {
            // 없으면 새로 추가
            const newProduct = {
                id: Date.now(), // 고유 ID
                productId: CrocsProduct.id,
                name: CrocsProduct.product,
                color: selectedColor,
                size: selectedSize,
                quantity: 1,
                price: detailPrice,
            };
            setSelectedProducts([...selectedProducts, newProduct]);
        }

        // 사이즈 선택 초기화 (다른 사이즈 선택 가능하도록)
        setSelectedSize(null);
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

    const handleColorSelect = (c) => setSelectedColor(c);

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

    // ⭐ 랜덤 지비츠 선택 (페이지 로드 시 한 번)
    useEffect(() => {
        if (jibbitzs && jibbitzs.length > 0) {
            // 배열 복사 후 랜덤 정렬
            const shuffled = [...jibbitzs].sort(() => Math.random() - 0.5);
            // 앞에서 5개 선택
            const selected = shuffled.slice(0, 5);
            setRandomJibbitz(selected);
        }
    }, []);

    useEffect(() => {
        if (!id || crocsItems.length === 0) return;
        const findCrocsItem = crocsItems.find((item) => String(item.id) === String(id));
        setCrocsProduct(findCrocsItem);
    }, [id, crocsItems]);

    if (!CrocsProduct) {
        return (
            <div className="product-detail-container">
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    상품 정보를 불러오고 있습니다...
                </div>
            </div>
        );
    }

    const mainCate = normalizeCate(CrocsProduct.cate);
    const categorySizes = crocsSizesByCategory[mainCate] || [];

    // 이미지 배열 처리
    const images = Array.isArray(CrocsProduct.product_img)
        ? CrocsProduct.product_img
        : String(CrocsProduct.product_img)
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean);

    return (
        <div className="product-detail-container">
            {/* 메인 콘텐츠 */}
            <div className="product-detail-content">
                {/* 왼쪽: 이미지 영역 */}
                <div className="product-image-section">
                    {/* 메인 이미지 */}
                    <div className="main-image-wrapper">
                        <img src={images[selectedImageIdx]} alt={CrocsProduct.product} />
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
                        <p className="product-subtitle">클래식 컬렉션</p>
                        <h2 className="product-title">{CrocsProduct.product}</h2>
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

                    {/* 색상 선택 */}
                    <div className="color-section">
                        <h3 className="section-title">
                            색상
                            <span className="selected-value">
                                | {colorOptions.find((c) => c.key === selectedColor)?.label}
                            </span>
                        </h3>
                        <div className="color-options">
                            {colorOptions.map((color) => (
                                <div
                                    key={color.key}
                                    className={`color-badge ${color.key} ${
                                        selectedColor === color.key ? 'active' : ''
                                    }`}
                                    onClick={() => handleColorSelect(color.key)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 사이즈 선택 */}
                    <div className="size-section">
                        <div className="size-header">
                            <h3 className="section-title">
                                사이즈
                                <span className="guide-text">| 사이즈를 선택하세요</span>
                            </h3>
                            <button
                                className="size-chart-btn"
                                onClick={() => setShowSizeChart(true)}
                            >
                                📏 사이즈표 보기
                            </button>
                        </div>
                        <div className="size-grid">
                            {categorySizes.map((size) => (
                                <button
                                    key={size}
                                    className={`size-button ${
                                        selectedSize === size ? 'active' : ''
                                    }`}
                                    onClick={() => {
                                        setSelectedSize(size);
                                        // 사이즈 선택하면 바로 리스트에 추가
                                        setTimeout(() => {
                                            if (size) {
                                                // 같은 색상+사이즈 조합이 이미 있는지 확인
                                                const existingIndex = selectedProducts.findIndex(
                                                    (p) =>
                                                        p.color === selectedColor && p.size === size
                                                );

                                                if (existingIndex !== -1) {
                                                    // 이미 있으면 수량 증가
                                                    const updated = [...selectedProducts];
                                                    updated[existingIndex].quantity += 1;
                                                    setSelectedProducts(updated);
                                                } else {
                                                    // 없으면 새로 추가
                                                    const newProduct = {
                                                        id: Date.now(), // 고유 ID
                                                        productId: CrocsProduct.id,
                                                        name: CrocsProduct.product,
                                                        color: selectedColor,
                                                        size: size,
                                                        quantity: 1,
                                                        price: detailPrice,
                                                    };
                                                    setSelectedProducts([
                                                        ...selectedProducts,
                                                        newProduct,
                                                    ]);
                                                }
                                                setSelectedSize(null); // 선택 초기화
                                            }
                                        }, 100);
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 선택된 상품 목록 */}
                    {selectedProducts.length > 0 && (
                        <div className="selected-products">
                            {selectedProducts.map((product) => (
                                <div key={product.id} className="selected-item">
                                    <div className="item-info">
                                        <span className={`color-badge ${product.color}`}></span>
                                        <span className="item-name">{product.name}</span>
                                        <span className="item-size">| {product.size}</span>
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
                            onClick={() => onAddWishList(CrocsProduct)}
                        >
                            💚
                        </button>
                        <WishAddPopup />
                        <button
                            className="btn-cart"
                            onClick={() => {
                                if (selectedProducts.length === 0) {
                                    alert('사이즈를 선택해주세요.');
                                    return;
                                }
                                // 모든 선택된 상품을 장바구니에 추가
                                selectedProducts.forEach((product) => {
                                    onProductAddCart({
                                        id: product.productId,
                                        name: product.name,
                                        title: product.name,
                                        price: product.price,
                                        quantity: product.quantity,
                                        size: product.size,
                                        color: product.color,
                                        product_img: Array.isArray(CrocsProduct.product_img)
                                            ? CrocsProduct.product_img[0]
                                            : CrocsProduct.product_img,
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
                                    alert('사이즈를 선택해주세요.');
                                    return;
                                }

                                // ⭐ 1. Order에 전달할 상품 데이터 준비
                                const orderProducts = selectedProducts.map((product) => ({
                                    id: product.productId,
                                    name: product.name,
                                    product: product.name,
                                    price: product.price,
                                    quantity: product.quantity,
                                    size: product.size,
                                    color: product.color,
                                    product_img: Array.isArray(CrocsProduct.product_img)
                                        ? CrocsProduct.product_img[0]
                                        : CrocsProduct.product_img,
                                    cate: CrocsProduct.cate || '일반',
                                }));

                                // ⭐ 2. 장바구니에도 추가 (백업용)
                                selectedProducts.forEach((product) => {
                                    onProductAddCart({
                                        id: product.productId,
                                        name: product.name,
                                        title: product.name,
                                        price: product.price,
                                        quantity: product.quantity,
                                        size: product.size,
                                        color: product.color,
                                        product_img: Array.isArray(CrocsProduct.product_img)
                                            ? CrocsProduct.product_img[0]
                                            : CrocsProduct.product_img,
                                    });
                                });

                                // ⭐ 3. localStorage 클리어
                                localStorage.removeItem(`selectedProducts_${id}`);

                                // ⭐ 4. Order 페이지로 이동 (state 전달!)
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
                {/* 지비츠 */}
                <div className="tab-section">
                    <div
                        className={`tab-header ${openJibbitz ? 'active' : ''}`}
                        onClick={() => setOpenJibbitz(!openJibbitz)}
                    >
                        <h3 className="tab-title">
                            함께 구매하면 좋은 지비츠
                            <span className="tab-subtitle">나만의 크록스 꾸미기</span>
                        </h3>
                        <div className="tab-icon">
                            <img src="/images/Sub_Women_Images/icon-arrow-down.svg" alt="토글" />
                        </div>
                    </div>
                    <div className={`tab-content ${openJibbitz ? 'active' : ''}`}>
                        <div className="content-inner">
                            <div className="jibbitz-grid">
                                {randomJibbitz.map((jibbitz) => {
                                    const hasDiscount =
                                        jibbitz.discountPrice && jibbitz.discountPrice !== '';
                                    const displayPrice = hasDiscount
                                        ? jibbitz.discountPrice
                                        : jibbitz.price;

                                    return (
                                        <div
                                            key={jibbitz.id}
                                            className="jibbitz-card"
                                            onClick={() => navigate(`/jibbitz/${jibbitz.id}`)}
                                        >
                                            <div className="card-image">
                                                <img
                                                    src={jibbitz.imageUrl[0]}
                                                    alt={jibbitz.title}
                                                    onError={(e) => {
                                                        e.target.src = '/images/placeholder.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div className="card-info">
                                                <h4 className="card-title">{jibbitz.title}</h4>
                                                <div className="card-price">
                                                    <span className="price">{displayPrice}</span>
                                                    {hasDiscount && (
                                                        <>
                                                            <span className="discount">
                                                                {jibbitz.discountPercent}
                                                            </span>
                                                            <span className="original-price">
                                                                {jibbitz.price}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

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
                            {/* Easy to Clean */}
                            <div className="desc-section">
                                <h4 className="desc-title">Easy to Clean</h4>
                                <ul className="desc-list">
                                    <li>물과 비누로 세척해주세요.</li>
                                    <li>겉감 : 92% 폴리에스터, 8% 에틸렌비닐아세테이트</li>
                                    <li>안감 : 92% 폴리에스터, 8% 에틸렌비닐아세테이트</li>
                                    <li>수입자 : 크록스코리아</li>
                                </ul>
                            </div>

                            {/* 클래식 언퍼게터블 스웨이드 클로그 */}
                            <div className="desc-section">
                                <h4 className="desc-title">상품설명</h4>
                                <ul className="desc-list">
                                    <li>
                                        궁극의 편안함과 스타일을 원한다면 새로운 클래식 언퍼게터블
                                        클로그의 인조 스웨이드 버전을 만나보세요.
                                    </li>
                                    <li>
                                        클래식 라인드 클로그의 다용도성과 코지 슬리퍼의 온종일
                                        느끼는 편안함이 결합된 새로운 스타일을 만나보세요.
                                    </li>
                                    <li>
                                        비건 인조 스웨이드 어퍼에 슬리퍼의 편안함을 제공하는 인조 퍼
                                        라이너, 칼라 및 백스트랩을 더한 것이 특징입니다.
                                    </li>
                                    <li>
                                        Croslite™ 아웃솔의 다용도성 덕분에 어디에서든 하루를 함께할
                                        수 있습니다.
                                    </li>
                                    <li>
                                        발을 감싸주는 부드러움을 선사하는 풋베드가 편안함을
                                        더해주며, 인조 퍼 백스트랩에는 지비츠™ 구멍이 있어 개성을
                                        표현할 수 있습니다.
                                    </li>
                                    <li>
                                        편안함과 스타일을 극대화해주는 클래식 언퍼게터블 비건
                                        스웨이드 클로그를 신고 하루를 보내세요.
                                    </li>
                                </ul>
                            </div>

                            {/* 디테일 */}
                            <div className="desc-section">
                                <h4 className="desc-title">상품디테일</h4>
                                <ul className="desc-list">
                                    <li>비건 인조 스웨이드 어퍼</li>
                                    <li>아이코닉한 디자인과 클래식 라인드 클로그의 다용도성</li>
                                    <li>
                                        슬리퍼의 편안함을 제공하는 인조 퍼 라이너, 칼라 및 백스트랩
                                    </li>
                                    <li>편안함을 더해주는 풋베드의 발을 감싸주는 부드러움</li>
                                    <li>
                                        피보팅 인조 퍼 백스트랩과 개성을 표현할 수 있는 지비츠™ 구멍
                                    </li>
                                    <li>
                                        아웃도어용으로 어울리는 Croslite™ 아웃솔이 선사하는 다용도성
                                    </li>
                                    <li>믿기 힘들 정도의 가벼움과 착용의 편리함</li>
                                    <li>
                                        Dual Crocs Comfort™: 더없이 만족스러운 지지력, 부드러움,
                                        아늑한 편안함.
                                    </li>
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
                        <h3 className="tab-title">유의 사항 및 품질보증기간</h3>
                        <div className="tab-icon">
                            <img src="/images/Sub_Women_Images/icon-arrow-down.svg" alt="토글" />
                        </div>
                    </div>
                    <div className={`tab-content ${openNotes ? 'active' : ''}`}>
                        <div className="content-inner">
                            {/* 유의 사항 */}
                            <div className="desc-section">
                                <h4 className="desc-title">유의 사항</h4>
                                <ul className="desc-list">
                                    <li>
                                        에스컬레이터나 무빙워크에서 사고방지를 위한 안내 안전선 안에
                                        위치하시고, 접촉면 어디에도 닿지 않도록 하십시오. 아이들의
                                        손을 잡고 늘 살펴보세요.
                                    </li>
                                    <li>미끄러지기 쉬운 장소에서는 주의해 주십시오.</li>
                                    <li>
                                        발에 맞지 않는 신발 착용 시 찰과상이 발생될 수 있습니다.
                                    </li>
                                    <li>
                                        36개월미만 어린이는 부자재 장식을 삼킬 위험이 있으니 주의가
                                        필요합니다.
                                    </li>
                                </ul>

                                <h5 className="desc-subtitle">세척 및 보관</h5>
                                <ul className="desc-list">
                                    <li>
                                        세척시에는 중성세제, 부드러운 스폰지, 상온의 물을
                                        사용하십시오.(천, 가죽, 스웨이드 세척불가)
                                    </li>
                                    <li>표백제, 세탁기, 건조기, 탈수기는 사용하지 마십시오</li>
                                    <li>
                                        직사광선이 드는 곳 (차 안 등), 고온다습한 곳에 신발을
                                        보관하지 마십시오.
                                    </li>
                                    <li>
                                        물에 장시간 담그지 마시고, 통풍이 양호한 그늘에 완전
                                        건조하십시오.
                                    </li>
                                    <li>
                                        가죽, 스웨이드, 천은 물기 및 마찰에 의해 변형, 변색, 물빠짐
                                        현상이 나타날 수 있으며, 의복에 이염되는 경우가 있으니
                                        주의하십시오.
                                    </li>
                                    <li>
                                        미끄럼 방지 기능은 오랜기간 착화시 마모로 인해 기능이 저하될
                                        수 있습니다.
                                    </li>
                                </ul>
                            </div>

                            {/* 품질보증기간 */}
                            <div className="desc-section">
                                <h4 className="desc-title">품질보증기간 : 구입후 6개월</h4>
                                <p className="desc-text">
                                    저희 제품의 결함으로 확인된 제품에 대해서는 공정거래 위원회 고시
                                    소비자 분쟁 해결 기준에 의거 다음과 같이 교환 또는 보상 받을 수
                                    있습니다.
                                </p>

                                <h5 className="desc-subtitle">원자재/표면불량</h5>
                                <ul className="desc-list">
                                    <li>
                                        구입일로부터 6개월이내 동일한 가격 / 제품으로 교환을 원칙
                                    </li>
                                    <li>동일제품으로 교환 불가능할 시, 유사제품으로 교환</li>
                                </ul>

                                <h5 className="desc-subtitle">보상제외</h5>
                                <ul className="desc-list">
                                    <li>
                                        제품에 부착되어 있는 사용방법 및 취급시 주의사항에 따라
                                        제품을 관리해주시고, 소비자 부주의로 인한 품질 이상 변형에
                                        대해서는 책임을 지지 않습니다.
                                    </li>
                                    <li>
                                        소비자 과실 및 부주의로 인한 하자/ 착화로 인한 마모 및 파손/
                                        잘못된 세탁 및 품질보증기간 경과 / 잘못된 착화로 인한 변형
                                        및 품질이상.
                                    </li>
                                </ul>

                                <h5 className="desc-subtitle">보상절차</h5>
                                <ul className="desc-list">
                                    <li>
                                        주문번호와 제품사진, 제품의 증상을 이메일문의하기를 이용하여
                                        문의하여 주시기 바랍니다.
                                    </li>
                                </ul>

                                <div className="customer-center">
                                    <strong>크록스코리아 고객센터 : 1661-0677</strong>
                                </div>
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
                            <span className="tab-subtitle">(142)</span>
                        </h3>
                        <div className="tab-icon">
                            <img src="/images/Sub_Women_Images/icon-arrow-down.svg" alt="토글" />
                        </div>
                    </div>
                    <div className={`tab-content ${openReview ? 'active' : ''}`}>
                        <div className="content-inner">리뷰 목록이 여기에 표시됩니다.</div>
                    </div>
                </div> */}
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

            {/* ⭐ 사이즈표 모달 */}
            {showSizeChart && (
                <div className="size-chart-modal" onClick={() => setShowSizeChart(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {CrocsProduct.cate === 'Kids' ? (
                            <KidSize onClose={() => setShowSizeChart(false)} />
                        ) : (
                            <AdultSize onClose={() => setShowSizeChart(false)} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrocsProductDetail;

// import React, { useCallback, useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useCrocsProductStore } from "../store/useCrocsProductStore";
// import { wishListStore } from "../store/wishListStore";
// import { useRecentProductsStore } from "../store/recentProductsStore";
// import Title from "../components/Title";
// import WishAddPopup from "../components/WishAddPopup";
// import { useCrocsSizeStore } from "../store/useCrocsSizeStore";
// import { useCartStore } from "../store/useCartStore";
// import "./scss/CrocsProductDetail.scss";

// const CrocsProductDetail = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const { crocsItems, onFetchItems } = useCrocsProductStore();
//     const { crocsSizesByCategory, onFetchSize } = useCrocsSizeStore();
//     const { onAddWishList } = wishListStore();
//     // const { addProduct } = useRecentProductsStore();
//     const { addProductToCart } = useCartStore(); // ⭐ 추가
//     const [CrocsProduct, setCrocsProduct] = useState(null);
//     const [selectedSize, setSelectedSize] = useState(null);
//     const [selectedColor, setSelectedColor] = useState("brown"); // 기본 색상
//     const [quantity, setQuantity] = useState(1);
//     const [selectedImageIdx, setSelectedImageIdx] = useState(0);

//     // 가격 파싱 유틸 (문자열 내 숫자만 추출)
//     const parsePriceNumber = useCallback((p) => {
//         if (!p) return 0;
//         const num = String(p).replace(/[^0-9]/g, "");
//         return Number(num || 0);
//     }, []);

//     // CrocsProduct가 아직 로드되지 않았을 때 null 접근 방지
//     // const salePriceNumber = parsePriceNumber(CrocsProduct?.prices?.[0]);
//     // const originalPriceNumber = parsePriceNumber(CrocsProduct?.prices?.[1]);
//     // const hasOriginal = originalPriceNumber > 0 && originalPriceNumber > salePriceNumber;
//     // const discountPercent = hasOriginal
//     //     ? Math.round(((originalPriceNumber - salePriceNumber) / originalPriceNumber) * 100)
//     //     : null;
//     // ⭐ 장바구니 규칙과 동일한 가격 계산 함수
//     const getDetailPrice = (product) => {
//         if (!product) return 0; // ⭐ null 방어

//         if (product.price) {
//             return Number(String(product.price).replace(/,/g, ""));
//         }

//         if (product.prices && product.prices.length > 0) {
//             const sale = product.prices[1] || product.prices[0] || "0";
//             return Number(String(sale).replace(/,/g, ""));
//         }

//         return 0;
//     };

//     // ⭐ 원가 계산 (prices[0])
//     const getOriginalPrice = (product) => {
//         if (!product || !product.prices) return null; // ⭐ null 방어
//         const origin = product.prices[0];
//         if (!origin) return null;
//         return Number(String(origin).replace(/,/g, ""));
//     };

//     // ⭐ 할인율 계산
//     const detailPrice = CrocsProduct ? getDetailPrice(CrocsProduct) : 0;
//     const originalPrice = CrocsProduct ? getOriginalPrice(CrocsProduct) : null;
//     const hasOriginal = originalPrice !== null && originalPrice > detailPrice;
//     const discountPercent = hasOriginal
//         ? Math.round(((originalPrice - detailPrice) / originalPrice) * 100)
//         : null;

//     const totalPrice = detailPrice * quantity;

//     const increaseQty = () => setQuantity((q) => q + 1);
//     const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
//     const handleColorSelect = (c) => setSelectedColor(c);

//     // 토글 섹션 상태 (지비츠 / 설명 / 유의사항 / 리뷰)
//     const [openJibbitz, setOpenJibbitz] = useState(false);
//     const [openDesc, setOpenDesc] = useState(false);
//     const [openNotes, setOpenNotes] = useState(false);
//     const [openReview, setOpenReview] = useState(false);

//     // 더미 지비츠 데이터 (실제 연동 전 시각적 구조용)
//     // const jibbitzItems = [
//     //     {
//     //         id: 1,
//     //         name: "지비츠 참 A",
//     //         price: "₩4,900",
//     //         img: "/images/ProductPage/imgi_53_crocs.avif",
//     //     },
//     //     {
//     //         id: 2,
//     //         name: "지비츠 참 B",
//     //         price: "₩5,900",
//     //         img: "/images/ProductPage/imgi_54_crocs.avif",
//     //     },
//     //     {
//     //         id: 3,
//     //         name: "지비츠 참 C",
//     //         price: "₩6,900",
//     //         img: "/images/ProductPage/imgi_55_crocs.avif",
//     //     },
//     // ];

//     const colorOptions = [
//         { key: "black", label: "블랙" },
//         { key: "brown", label: "브라운" },
//         { key: "pink", label: "핑크" },
//         { key: "green", label: "그린" },
//         { key: "blue", label: "블루" },
//     ];

//     useEffect(() => {
//         onFetchItems();
//         onFetchSize();
//     }, []);

//     useEffect(() => {
//         if (!id || crocsItems.length === 0) return;
//         const findCrocsItem = crocsItems.find((item) => String(item.id) === String(id));
//         setCrocsProduct(findCrocsItem);
//     }, [id, crocsItems]);

//     if (!CrocsProduct) {
//         return <div>상품 정보를 불러오고 있으니 기다려주세요.</div>;
//     }

//     // ⭐ 상품 정보가 로드되면 최근 본 상품에 추가
//     // useEffect(() => {
//     //     if (!CrocsProduct) return;

//     //     // 이미지 배열 처리 (useEffect 안에서만)
//     //     let productImages = [];
//     //     if (Array.isArray(CrocsProduct.product_img)) {
//     //         productImages = CrocsProduct.product_img
//     //             .flatMap((item) => String(item).split(","))
//     //             .map((v) => v.trim())
//     //             .filter(Boolean);
//     //     } else {
//     //         productImages = String(CrocsProduct.product_img)
//     //             .split(",")
//     //             .map((v) => v.trim())
//     //             .filter(Boolean);
//     //     }

//     //     // 최근 본 상품에 추가
//     //     addProduct({
//     //         id: CrocsProduct.id,
//     //         name: CrocsProduct.product,
//     //         image: productImages[0] || "",
//     //         price: detailPrice.toLocaleString(),
//     //         discountPrice: hasOriginal ? detailPrice.toLocaleString() : "",
//     //         originPrice: hasOriginal ? originalPrice.toLocaleString() : "",
//     //         discount: discountPercent || "",
//     //     });

//     //     console.log("✅ 최근 본 상품에 추가:", CrocsProduct.product);
//     // }, [CrocsProduct]); // ⭐ 의존성 배열 수정: CrocsProduct만!

//     const normalizeCate = (cate) => {
//         if (!cate) return "women"; // 기본값
//         const c = cate.split(",")[0].trim().toLowerCase();
//         if (c.includes("men") || c.includes("남성") || c.includes("man")) return "men";
//         if (c.includes("women") || c.includes("여성") || c.includes("woman")) return "women";
//         if (c.includes("kid") || c.includes("아동") || c.includes("주니어")) return "kids";
//         return "women"; // fallback
//     };

//     // 카테고리 기반 사이즈 찾기
//     const mainCate = normalizeCate(CrocsProduct.cate);
//     const categorySizes = crocsSizesByCategory[mainCate] || [];

//     console.log("정규화된 mainCate:", mainCate);
//     console.log("sizes store:", crocsSizesByCategory);

//     // ⭐ 이미지 타입 관계없이 배열로 통일
//     const images = Array.isArray(CrocsProduct.product_img)
//         ? CrocsProduct.product_img
//         : String(CrocsProduct.product_img)
//               .split(",")
//               .map((v) => v.trim())
//               .filter(Boolean);
//     // ⭐ 이미지 배열 처리 (렌더링용 - 이 부분만 유지!)
//     // let images = [];
//     // if (Array.isArray(CrocsProduct.product_img)) {
//     //     images = CrocsProduct.product_img
//     //         .flatMap((item) => String(item).split(","))
//     //         .map((v) => v.trim())
//     //         .filter(Boolean);
//     // } else {
//     //     images = String(CrocsProduct.product_img)
//     //         .split(",")
//     //         .map((v) => v.trim())
//     //         .filter(Boolean);
//     // }

//     // 위시리스트에 담을 데이터 구성
//     const handleAddToWishList = () => {
//         const wishProduct = {
//             id: CrocsProduct.id,
//             title: CrocsProduct.product,
//             imageUrl: images[0],
//             price: detailPrice.toLocaleString(),
//             originPrice: hasOriginal ? originalPrice.toLocaleString() : "",
//             discountPrice: hasOriginal ? detailPrice.toLocaleString() : "",
//             discountPercent: discountPercent ? `${discountPercent}%` : "",
//             cate: CrocsProduct.cate,
//             selectedSize: selectedSize,
//             selectedColor: selectedColor,
//         };

//         console.log("위시리스트에 담을 상품:", wishProduct);
//         onAddWishList(wishProduct);
//     };

//     // 장바구니 담기 핸들러
//     const handleAddToCart = () => {
//         if (!selectedSize) {
//             alert("사이즈를 선택해주세요!");
//             return;
//         }

//         const productToAdd = {
//             id: CrocsProduct.id,
//             name: CrocsProduct.product,
//             title: CrocsProduct.product,
//             price: detailPrice,
//             product_img: Array.isArray(CrocsProduct.product_img)
//                 ? CrocsProduct.product_img[0]
//                 : CrocsProduct.product_img,
//             size: selectedSize,
//             // useCartStore의 addProductToCart에 필요한 데이터
//             discountPrice: hasOriginal ? detailPrice : null,
//             price_dc_rate: hasOriginal ? detailPrice : null,
//         };

//         console.log("🛒 장바구니 추가:", productToAdd);

//         const success = addProductToCart(productToAdd, quantity);

//         if (success) {
//             const goToCart = window.confirm(
//                 "장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?"
//             );
//             if (goToCart) {
//                 navigate("/cart");
//             }
//         }

//         // const cartProduct = {
//         //     id: CrocsProduct.id,
//         //     name: CrocsProduct.product,
//         //     title: CrocsProduct.product,
//         //     price: detailPrice,
//         //     quantity: quantity,
//         //     size: selectedSize,
//         //     color: selectedColor,
//         //     product_img: images[0],
//         //     cate: CrocsProduct.cate,
//         // };

//         // console.log("장바구니에 담을 상품:", cartProduct);
//         // onProductAddCart(cartProduct, quantity);
//     };

//     return (
//         <div className='sub_page'>
//             <div className='inner'>
//                 <Title title='ProductDetail' />
//                 <div className='product-img-info'>
//                     <div className='product-img-info__wrap'>
//                         {/* 이미지 + 썸네일 + 크럼브 영역 */}
//                         <div className='product-img'>
//                             <div className='product-img__crumbs-wrap'>
//                                 <ul className='product-img__crumbs'>
//                                     <li className='product-img__crumb product-img__crumb--home'>
//                                         <a href='/' className='product-img__link' aria-label='홈'>
//                                             <img
//                                                 className='product-img__icon'
//                                                 src='/images/Sub_Women_Images/icon-close_cross.svg'
//                                                 alt='홈'
//                                             />
//                                         </a>
//                                     </li>

//                                     <li className='product-img__sep'>
//                                         <span>:</span>
//                                     </li>

//                                     <li className='product-img__crumb product-img__crumb--category'>
//                                         <button
//                                             type='button'
//                                             className='product-img__link'
//                                             aria-label='카테고리'
//                                         >
//                                             <span className='product-img__text'>{mainCate}</span>
//                                         </button>
//                                     </li>

//                                     <li className='product-img__sep'>
//                                         <span>:</span>
//                                     </li>

//                                     <li className='product-img__crumb product-img__crumb--current'>
//                                         <button
//                                             type='button'
//                                             className='product-img__link'
//                                             aria-current='page'
//                                             aria-label='현재 상품'
//                                         >
//                                             <span className='product-img__text'>
//                                                 {CrocsProduct.product}
//                                             </span>
//                                             <img
//                                                 className='product-img__icon'
//                                                 src='/images/Sub_Women_Images/icon-close_cross.svg'
//                                                 alt='닫기'
//                                             />
//                                         </button>
//                                     </li>
//                                 </ul>
//                             </div>
//                             <div className='product-img__main-wrap'>
//                                 <ul className='product-img__list product-img__list--main'>
//                                     <li className='product-img__item'>
//                                         <img
//                                             className='product-img__img'
//                                             src={images[selectedImageIdx]}
//                                             alt={CrocsProduct.product}
//                                         />
//                                     </li>
//                                 </ul>
//                             </div>
//                             <div className='product-img__thumbs-wrap'>
//                                 {/* 상단 컨트롤 (비활성화 상태 유지) */}
//                                 <div className='thumbs__ctrl thumbs__ctrl--top' aria-hidden='true'>
//                                     <button
//                                         type='button'
//                                         className='thumbs__btn thumbs__btn--up'
//                                         tabIndex={-1}
//                                     >
//                                         <img
//                                             className='thumbs__icon'
//                                             src='/images/icon-arrow-up-hairline.svg'
//                                             alt=''
//                                         />
//                                     </button>
//                                     <button
//                                         type='button'
//                                         className='thumbs__btn thumbs__btn--active'
//                                         tabIndex={-1}
//                                     >
//                                         <img
//                                             className='thumbs__icon'
//                                             src='/images/icon-arrow-up-green.svg'
//                                             alt=''
//                                         />
//                                     </button>
//                                 </div>

//                                 {/* 썸네일 리스트 */}
//                                 <ul className='product-img__thumbs-list'>
//                                     {images.map((img, idx) => (
//                                         <li key={idx} className='product-img__thumbs-item'>
//                                             <button
//                                                 type='button'
//                                                 className='product-img__thumbs-link'
//                                                 aria-label={`이미지 ${idx + 1} 보기`}
//                                                 onClick={() => setSelectedImageIdx(idx)}
//                                             >
//                                                 <img
//                                                     className='product-img__thumbs-img'
//                                                     src={img}
//                                                     alt={`${CrocsProduct.product} 썸네일
//                                     ${idx + 1}`}
//                                                     style={
//                                                         selectedImageIdx === idx
//                                                             ? {
//                                                                   filter: "brightness(1.05)",
//                                                                   transform: "scale(1.05)",
//                                                               }
//                                                             : undefined
//                                                     }
//                                                 />
//                                             </button>
//                                         </li>
//                                     ))}
//                                 </ul>

//                                 {/* 상단 컨트롤 (비활성화 상태 유지) */}
//                                 <div
//                                     className='thumbs__ctrl thumbs__ctrl--bottom'
//                                     aria-hidden='true'
//                                 >
//                                     <button
//                                         type='button'
//                                         className='thumbs__btn thumbs__btn--down'
//                                         tabIndex={-1}
//                                     >
//                                         <img
//                                             className='thumbs__icon'
//                                             src='/images/icon-arrow-down-hairline.svg'
//                                             alt=''
//                                         />
//                                     </button>
//                                     <button
//                                         type='button'
//                                         className='thumbs__btn thumbs__btn--active'
//                                         tabIndex={-1}
//                                     >
//                                         <img
//                                             className='thumbs__icon'
//                                             src='/images/icon-arrow-down-green.svg'
//                                             alt=''
//                                         />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* 지비츠 참 */}
//                 </div>

//                 {/* 구매하기 영역 */}
//                 <div className='select-buy'>
//                     <div className='select-buy__wrap'>
//                         {/* 타이틀 영역 */}
//                         <div className='select-buy__title_wrap'>
//                             <p class='select-buy__subtitle'>{CrocsProduct.product}</p>
//                             <h2 class='select-buy__title'>{CrocsProduct.product}</h2>
//                             <div className='select-buy__price'>
//                                 <span class='select-buy__price_dc_rate'>
//                                     {detailPrice ? detailPrice.toLocaleString() : "가격 없음"}
//                                 </span>
//                                 <span class='select-buy__price_breadcrumbs__line'></span>
//                                 <span class='select-buy__price_sale'>{discountPercent}%</span>
//                                 <span class='select-buy__price_breadcrumbs__line'></span>
//                                 <span class='select-buy__price_cost'>
//                                     {originalPrice.toLocaleString()}
//                                 </span>
//                             </div>
//                         </div>

//                         {/* 구분선 */}
//                         <div className='select-buy__breadcrumbs'></div>

//                         {/* 색상 선택 영역 */}
//                         <div className='select-buy__color'>
//                             <div className='select-buy__color-title-wrap'>
//                                 <p className='select-buy__color-title'>색상</p>
//                                 <span className='select-buy__price_breadcrumbs__line'></span>
//                                 <p className='select-buy__color-select'>
//                                     {colorOptions.find((c) => c.key === selectedColor)?.label ||
//                                         "브라운"}
//                                 </p>
//                             </div>
//                             <div
//                                 className='select-buy__color-badge-wrap'
//                                 role='group'
//                                 aria-label='색상 선택'
//                             >
//                                 {colorOptions.map((c) => (
//                                     <button
//                                         key={c.key}
//                                         type='button'
//                                         className={`color-badge color-badge--${c.key} ${
//                                             selectedColor === c.key ? "active" : ""
//                                         }`}

//                                         onClick={() => handleColorSelect(c.key)}
//                                     />
//                                 ))}
//                             </div>
//                         </div>

//                         {/* 사이즈 선택 (BEM 구조 변환) */}
//                         <div className='select-buy__size'>
//                             <div className='select-buy__size-title-wrap'>
//                                 <p className='select-buy__size-title'>사이즈</p>
//                                 <span className='select-buy__size_breadcrumbs__line' />
//                                 <p className='select-buy__size-select'>
//                                     {selectedSize || "선택하세요"}
//                                 </p>
//                             </div>
//                             <div className='select-buy__size-btns-wrap'>
//                                 <ul
//                                     className=' select-buy__size-btns'
//                                     role='group'
//                                     aria-label='사이즈 선택'
//                                 >
//                                     {categorySizes.map((size) => (
//                                         <li key={size}>
//                                             <button
//                                                 type='button'
//                                                 className={selectedSize === size ? "active" : ""}
//                                                 onClick={() => setSelectedSize(size)}
//                                             >
//                                                 {size}
//                                             </button>
//                                         </li>
//                                     ))}
//                                 </ul>
//                                 <div className='select-buy__size-notice-wrap'>
//                                     <span>원하는 옵션이 없으신가요?</span>
//                                     <div>
//                                         <a href='#'>
//                                             <img
//                                                 src='/images/icon-bell.svg'
//                                                 alt='재입고 알림 아이콘'
//                                             />
//                                             <span>재입고 알림 신청하기</span>
//                                         </a>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* 구분선 */}
//                         <div className='select-buy__breadcrumbs'></div>

//                         {/* 구매 선택 수량 목록 */}
//                         <div className='select-buy__selected--wrap'>
//                             <div className='select-buy__select'>
//                                 <div className='select-buy__select-wrap'>
//                                     <div className='select-buy__select_chose-item'>
//                                         <span className='info__color-badge buy__color-badge--black'></span>
//                                         <span className='select-buy__select_chose-item-name'>
//                                             클래식 언퍼게터블 스웨이드 클로그
//                                         </span>
//                                     </div>
//                                     <span className='select-buy__price_breadcrumbs__line'></span>
//                                     <span className='select-buy__select_chose-item-option'>
//                                         220
//                                     </span>
//                                 </div>
//                                 <div className='select-buy__select__count-wrap'>
//                                     <div className='select-buy__select__count'>
//                                         <div className='select-buy__select__count-value-wrap'>
//                                             <p className=' select-buy__select__count-value'>
//                                                 <span>1</span>
//                                             </p>
//                                         </div>
//                                         {/* 카운타 버튼 */}
//                                         <div className='select-buy__select__wrap'>
//                                             {/* 증가 버튼 */}
//                                             <button className='select-buy__select__count-btn select-buy__select__count-btn--increase'>
//                                                 <a
//                                                     href='#'
//                                                     className='select-buy__select__count-link select-buy__select__count-link--disabled-1'
//                                                 >
//                                                     <img
//                                                         src='/images/icon-arrow-up_bold-1.svg'
//                                                         alt='수량 증가 버튼'
//                                                         className='count-btn__icon-1'
//                                                     />
//                                                 </a>
//                                                 <a
//                                                     href='#'
//                                                     className='select-buy__select__count-link select-buy__select__count-link--disabled-2'
//                                                 >
//                                                     <img
//                                                         src='/images/icon-arrow-up_bold-2.svg'
//                                                         alt='수량 증가 버튼 비활성화'
//                                                         className='count-btn__icon-2'
//                                                     />
//                                                 </a>
//                                             </button>
//                                             {/* 감소 버튼 */}
//                                             <button className='select-buy__select__count-btn select-buy__select__count-btn--decrease'>
//                                                 <a
//                                                     href='#'
//                                                     className='select-buy__select__count-link select-buy__select__count-link--disabled-1'
//                                                 >
//                                                     <img
//                                                         src='/images/icon-arrow-down_bold-1.svg'
//                                                         alt='수량 감소 버튼'
//                                                         className='count-btn__icon-1'
//                                                     />
//                                                 </a>
//                                                 <a
//                                                     href='#'
//                                                     className='select-buy__select__count-link select-buy__select__count-link--disabled-2'
//                                                 >
//                                                     <img
//                                                         src='/images/icon-arrow-down_bold-2.svg'
//                                                         alt='수량 감소 버튼 비활성화'
//                                                         className='count-btn__icon-2'
//                                                     />
//                                                 </a>
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className='select-buy__select__del'>
//                                     <button className='select-buy__select__del-btn '>
//                                         <img
//                                             src='/images/ProductPage/icon-delete.svg'
//                                             className='del-btn--normal'
//                                         />
//                                         <img
//                                             src='/images/ProductPage/icon-delete-hover.svg'
//                                             className='del-btn--hover'
//                                         />
//                                     </button>
//                                     {/*<!-- <button class="select-buy__select__del-btn del-btn--hover">
//                                     <img src="/images/ProductPage/icon-delete-hover.svg" />
//                                 </button> -->*/}
//                                 </div>
//                             </div>
//                             <div className='select-buy__select'>
//                                 <div className='select-buy__select-wrap'>
//                                     <div className='select-buy__select_chose-item'>
//                                         <span className='info__color-badge buy__color-badge--brown'></span>
//                                         <span className='select-buy__select_chose-item-name'>
//                                             클래식 언퍼게터블 스웨이드 클로그
//                                         </span>
//                                     </div>
//                                     <span className='select-buy__price_breadcrumbs__line'></span>
//                                     <span className='select-buy__select_chose-item-option'>
//                                         220
//                                     </span>
//                                 </div>
//                                 <div className='select-buy__select__count-wrap'>
//                                     <div className='select-buy__select__count'>
//                                         <div className='select-buy__select__count-value-wrap'>
//                                             <p className=' select-buy__select__count-value'>
//                                                 <span>1</span>
//                                             </p>

//                                             {/* 카운타 버튼 */}
//                                             <div className='select-buy__select__wrap'>
//                                                 {/* 증가 버튼 */}
//                                                 <button className='select-buy__select__count-btn select-buy__select__count-btn--increase'>
//                                                     <a
//                                                         href='#'
//                                                         className='select-buy__select__count-link select-buy__select__count-link--disabled-1'
//                                                     >
//                                                         <img
//                                                             src='/images/icon-arrow-up_bold-1.svg'
//                                                             alt='수량 증가 버튼'
//                                                             className='count-btn__icon-1'
//                                                         />
//                                                     </a>
//                                                     <a
//                                                         href='#'
//                                                         className='select-buy__select__count-link select-buy__select__count-link--disabled-2'
//                                                     >
//                                                         <img
//                                                             src='/images/icon-arrow-up_bold-2.svg'
//                                                             alt='수량 증가 버튼 비활성화'
//                                                             className='count-btn__icon-2'
//                                                         />
//                                                     </a>
//                                                 </button>
//                                                 {/* 감소 버튼 */}
//                                                 <button className='select-buy__select__count-btn select-buy__select__count-btn--decrease'>
//                                                     <a
//                                                         href='#'
//                                                         className='select-buy__select__count-link select-buy__select__count-link--disabled-1'
//                                                     >
//                                                         <img
//                                                             src='/images/icon-arrow-down_bold-1.svg'
//                                                             alt='수량 감소 버튼'
//                                                             className='count-btn__icon-1'
//                                                         />
//                                                     </a>
//                                                     <a
//                                                         href='#'
//                                                         className='select-buy__select__count-link select-buy__select__count-link--disabled-2'
//                                                     >
//                                                         <img
//                                                             src='/images/icon-arrow-down_bold-2.svg'
//                                                             alt='수량 감소 버튼 비활성화'
//                                                             className='count-btn__icon-2'
//                                                         />
//                                                     </a>
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className='select-buy__select__del'>
//                                         <button className='select-buy__select__del-btn '>
//                                             <img
//                                                 src='/images/ProductPage/icon-delete.svg'
//                                                 className='del-btn--normal'
//                                             />
//                                             <img
//                                                 src='/images/ProductPage/icon-delete-hover.svg'
//                                                 className='del-btn--hover'
//                                             />
//                                         </button>
//                                         {/*<!-- <button class="select-buy__select__del-btn del-btn--hover">
//                                     <img src="/images/ProductPage/icon-delete-hover.svg" />
//                                 </button> -->*/}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* 구분선 */}
//                         <div className='select-buy__breadcrumbs'></div>

//                         {/* 총 상품 금액 */}
//                         <div className='select-buy__total-wrap'>
//                             <div className='select-buy__total-title'>
//                                 <p>총 상품 금액</p>
//                             </div>
//                             <div className='select-buy__total-content'>
//                                 <div className='select-buy__total-number-wrap'>
//                                     <p className='total-number-text'>총 수량</p>
//                                     <p className='total-number'>2</p>
//                                     <p>개</p>
//                                 </div>
//                                 <div className='select-buy__total-price-wrap'>
//                                     <p className='total-price'>77,790</p>
//                                     <p className='total-price-text'>원</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className='select-buy__breadcrumbs'></div>

//                         {/* 구매 버튼 영역 */}
//                         <div className='select-buy__buy-btns-wrap'>
//                             <button
//                                 className='select-buy__buy-btns__btn-like'
//                                 onClick={() => onAddWishList(CrocsProduct)}
//                             >
//                                 💚
//                                 {/* <p className="select-buy__buy-btns__btn-like_line">
//                                 <img src="/images/ProductPage/icon-love_line.svg" alt="좋아요 비활성화" />
//                             </p>
//                             <p className="select-buy__buy-btns__btn-like_fill">
//                                 <img src="/images/ProductPage/icon-love_fill.svg" alt="좋아요 활성화" />
//                             </p> */}
//                             </button>
//                             <WishAddPopup />
//                             <button
//                                 className='select-buy__buy-btn select-buy__buy-btn--add-cart'
//                                 onClick={() =>
//                                     handleAddToCart({
//                                         id: CrocsProduct.id,

//                                         // ⭐ CartStore에서 name 사용하므로 반드시 넣기
//                                         name: CrocsProduct.product,
//                                         title: CrocsProduct.product, // 혹시 title도 찾을 수 있으므로 같이 넣기

//                                         // ⭐ 할인 가격 or 정상 가격 반영
//                                         price: detailPrice,

//                                         // ⭐ 장바구니 수량
//                                         quantity: quantity,

//                                         // ⭐ 선택한 사이즈
//                                         size: selectedSize || null,

//                                         // ⭐ 대표 이미지
//                                         product_img: Array.isArray(CrocsProduct.product_img)
//                                             ? CrocsProduct.product_img[0]
//                                             : CrocsProduct.product_img,
//                                     })
//                                 }
//                             >
//                                 장바구니
//                             </button>
//                             <WishAddPopup />
//                             <button className='select-buy__buy-btn select-buy__buy-btn--buy-now'>
//                                 구매하기
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CrocsProductDetail;
