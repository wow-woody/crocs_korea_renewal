import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCrocsProductStore } from "../store/useCrocsProductStore";
import { wishListStore } from "../store/wishListStore";
import { useRecentProductsStore } from "../store/recentProductsStore";
import WishAddPopup from "../components/WishAddPopup";
import { useCrocsSizeStore } from "../store/useCrocsSizeStore";
import { jibbitzs } from "../data/jibbitzs";
import AdultSize from "../components/AdultSize";
import KidSize from "../components/KidSize";
import ProductReviews from "../components/ProductReviews";
import "./scss/CrocsProductDetail.scss";

const CrocsProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { crocsItems, onFetchItems } = useCrocsProductStore();
  const { crocsSizesByCategory, onFetchSize } = useCrocsSizeStore();
  const { onAddWishList, onProductAddCart } = wishListStore();
  const { addProduct } = useRecentProductsStore();

  const [CrocsProduct, setCrocsProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [randomJibbitz, setRandomJibbitz] = useState([]);

  // 토글 상태
  const [openJibbitz, setOpenJibbitz] = useState(false);
  const [openDesc, setOpenDesc] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const colorOptions = [
    { key: "black", label: "블랙" },
    { key: "brown", label: "브라운" },
    { key: "pink", label: "핑크" },
    { key: "green", label: "그린" },
    { key: "blue", label: "블루" },
  ];

  // 카테고리 정규화
  const normalizeCate = (cateString) => {
    if (!cateString) return null;
    const lower = cateString.toLowerCase();
    if (lower.includes("kid") || lower.includes("키즈")) return "kids";
    if (
      lower.includes("women") ||
      lower.includes("여성") ||
      lower.includes("여")
    )
      return "women";
    if (lower.includes("men") || lower.includes("남성") || lower.includes("남"))
      return "men";
    return null;
  };

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

  const getOriginalPrice = (product) => {
    if (!product || !product.prices) return null;
    const origin = product.prices[0];
    if (!origin) return null;
    return Number(String(origin).replace(/,/g, ""));
  };

  const detailPrice = CrocsProduct ? getDetailPrice(CrocsProduct) : 0;
  const originalPrice = CrocsProduct ? getOriginalPrice(CrocsProduct) : null;
  const hasOriginal = originalPrice !== null && originalPrice > detailPrice;
  const discountPercent = hasOriginal
    ? Math.round(((originalPrice - detailPrice) / originalPrice) * 100)
    : null;

  // 총 수량 및 가격 계산
  const totalQuantity = selectedProducts.reduce(
    (sum, p) => sum + p.quantity,
    0
  );
  const totalPrice = selectedProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  // ⭐ 상품 ID가 변경되면 localStorage 초기화 (다른 상품으로 이동 시)
  useEffect(() => {
    // 이전 상품의 localStorage 정리 (선택사항)
    setSelectedProducts([]);

    // 현재 상품의 localStorage 불러오기
    const savedProducts = localStorage.getItem(`selectedProducts_${id}`);
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        setSelectedProducts(parsed);
      } catch (error) {
        console.error("Failed to parse saved products:", error);
        localStorage.removeItem(`selectedProducts_${id}`);
      }
    }
  }, [id]);

  // localStorage에 저장
  useEffect(() => {
    if (selectedProducts.length > 0) {
      localStorage.setItem(
        `selectedProducts_${id}`,
        JSON.stringify(selectedProducts)
      );
    } else {
      localStorage.removeItem(`selectedProducts_${id}`);
    }
  }, [selectedProducts, id]);

  // ⭐ 컴포넌트 언마운트 시 localStorage 정리 (페이지를 떠날 때)
  useEffect(() => {
    return () => {
      // 페이지를 떠날 때 localStorage 정리
      localStorage.removeItem(`selectedProducts_${id}`);
    };
  }, [id]);

  // 초기 데이터 로드
  useEffect(() => {
    onFetchItems();
    onFetchSize();
  }, []);

  // 랜덤 지비츠 선택
  useEffect(() => {
    if (jibbitzs && jibbitzs.length > 0) {
      const shuffled = [...jibbitzs].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 5);
      setRandomJibbitz(selected);
    }
  }, []);

  // 상품 찾기
  useEffect(() => {
    if (!id || crocsItems.length === 0) return;
    const findCrocsItem = crocsItems.find(
      (item) => String(item.id) === String(id)
    );
    setCrocsProduct(findCrocsItem);
  }, [id, crocsItems]);

  // 최근 본 상품에 추가
  useEffect(() => {
    if (!CrocsProduct) return;

    let productImages = [];
    if (Array.isArray(CrocsProduct.product_img)) {
      productImages = CrocsProduct.product_img
        .flatMap((item) => String(item).split(","))
        .map((v) => v.trim())
        .filter(Boolean);
    } else {
      productImages = String(CrocsProduct.product_img)
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }

    addProduct({
      id: CrocsProduct.id,
      name: CrocsProduct.product,
      image: productImages[0] || "",
      price: detailPrice.toLocaleString(),
      discountPrice: hasOriginal ? detailPrice.toLocaleString() : "",
      originPrice: hasOriginal ? originalPrice.toLocaleString() : "",
      discount: discountPercent || "",
    });

    console.log("✅ 최근 본 상품에 추가:", CrocsProduct.product);
  }, [CrocsProduct]);

  if (!CrocsProduct) {
    return (
      <div className="product-detail-container">
        <div style={{ textAlign: "center", padding: "4rem" }}>
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
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

  // 색상 선택
  const handleColorSelect = (c) => setSelectedColor(c);

  // 수량 증가
  const increaseQty = (productId) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity + 1 } : p
      )
    );
  };

  // 수량 감소
  const decreaseQty = (productId) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.id === productId && p.quantity > 1
          ? { ...p, quantity: p.quantity - 1 }
          : p
      )
    );
  };

  // 상품 삭제
  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  // 위시리스트에 담기
  const handleAddToWishList = () => {
    // 최소한 하나의 상품이라도 선택되어 있어야 함
    if (selectedProducts.length === 0) {
      alert("사이즈를 선택해주세요.");
      return;
    }

    // 첫 번째 선택된 상품 기준으로 위시리스트에 추가
    const firstProduct = selectedProducts[0];

    const wishProduct = {
      id: CrocsProduct.id,
      title: CrocsProduct.product,
      imageUrl: images[0],
      price: detailPrice.toLocaleString(),
      originPrice: hasOriginal ? originalPrice.toLocaleString() : "",
      discountPrice: hasOriginal ? detailPrice.toLocaleString() : "",
      discountPercent: discountPercent ? `${discountPercent}%` : "",
      cate: CrocsProduct.cate,
      selectedSize: firstProduct.size,
      selectedColor: firstProduct.color,
    };

    console.log("✅ 위시리스트에 담을 상품:", wishProduct);
    onAddWishList(wishProduct);
  };

  // ⭐ 장바구니에 담기 (기존 코드 유지 + 초기화 추가)
  const handleAddToCart = () => {
    if (selectedProducts.length === 0) {
      alert("사이즈를 선택해주세요.");
      return;
    }

    selectedProducts.forEach((product) => {
      onProductAddCart({
        id: product.productId,
        name: product.name,
        title: product.name,
        price: product.price,
        quantity: product.quantity,
        size: product.size,
        color: product.color,
        product_img: images[0],
        cate: CrocsProduct.cate,
      });
    });

    // ⭐ 장바구니 담기 후 선택 상품 초기화
    setSelectedProducts([]);
    localStorage.removeItem(`selectedProducts_${id}`);
    // alert는 제거 (onProductAddCart에서 처리할 수 있음)
  };

  // ⭐ 바로 구매하기 (기존 코드 유지)
  const handleBuyNow = () => {
    if (selectedProducts.length === 0) {
      alert("사이즈를 선택해주세요.");
      return;
    }

    const orderProducts = selectedProducts.map((product) => ({
      id: product.productId,
      name: product.name,
      product: product.name,
      price: product.price,
      quantity: product.quantity,
      size: product.size,
      color: product.color,
      product_img: images[0],
      cate: CrocsProduct.cate || "일반",
    }));

    // 장바구니에도 추가 (백업용) - 기존 코드 유지
    selectedProducts.forEach((product) => {
      onProductAddCart(
        {
          id: product.productId,
          name: product.name,
          title: product.name,
          price: product.price,
          size: product.size,
          color: product.color,
          product_img: images[0],
          cate: CrocsProduct.cate,
        },
        product.quantity
      );
    });

    // ⭐ 구매 페이지로 이동하기 전 localStorage 정리
    localStorage.removeItem(`selectedProducts_${id}`);

    navigate("/order", {
      state: { orderProducts: orderProducts },
    });
  };

  return (
    <div className="product-detail-container">
      <div className="inner">
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
                      idx === selectedImageIdx ? "active" : ""
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
              <h2 className="product-title">{CrocsProduct.product}</h2>
              <div className="product-price">
                {hasOriginal && discountPercent && (
                  <span className="discount-rate">{discountPercent}%</span>
                )}
                <span className="sale-price">
                  ₩{detailPrice.toLocaleString()}
                </span>
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
                      selectedColor === color.key ? "active" : ""
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
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedSize(size);
                      setTimeout(() => {
                        if (size) {
                          const existingIndex = selectedProducts.findIndex(
                            (p) => p.color === selectedColor && p.size === size
                          );

                          if (existingIndex !== -1) {
                            const updated = [...selectedProducts];
                            updated[existingIndex].quantity += 1;
                            setSelectedProducts(updated);
                          } else {
                            const newProduct = {
                              id: Date.now(),
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
                          setSelectedSize(null);
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
              <button className="btn-wishlist" onClick={handleAddToWishList}>
                💚
              </button>
              <button className="btn-cart" onClick={handleAddToCart}>
                장바구니
              </button>
              <button className="btn-buy" onClick={handleBuyNow}>
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
              className={`tab-header ${openJibbitz ? "active" : ""}`}
              onClick={() => setOpenJibbitz(!openJibbitz)}
            >
              <h3 className="tab-title">
                함께 구매하면 좋은 지비츠
                <span className="tab-subtitle">나만의 크록스 꾸미기</span>
              </h3>
              <div className="tab-icon">
                <img
                  src="/images/Sub_Women_Images/icon-arrow-down.svg"
                  alt="토글"
                />
              </div>
            </div>
            <div className={`tab-content ${openJibbitz ? "active" : ""}`}>
              <div className="content-inner">
                <div className="jibbitz-grid">
                  {randomJibbitz.map((jibbitz) => {
                    const hasDiscount =
                      jibbitz.discountPrice && jibbitz.discountPrice !== "";
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
                              e.target.src = "/images/placeholder.jpg";
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
              className={`tab-header ${openDesc ? "active" : ""}`}
              onClick={() => setOpenDesc(!openDesc)}
            >
              <h3 className="tab-title">상품 상세 설명</h3>
              <div className="tab-icon">
                <img
                  src="/images/Sub_Women_Images/icon-arrow-down.svg"
                  alt="토글"
                />
              </div>
            </div>
            <div className={`tab-content ${openDesc ? "active" : ""}`}>
              <div className="content-inner">
                <div className="desc-section">
                  <h4 className="desc-title">Easy to Clean</h4>
                  <ul className="desc-list">
                    <li>물과 비누로 세척해주세요.</li>
                    <li>겉감 : 92% 폴리에스터, 8% 에틸렌비닐아세테이트</li>
                    <li>안감 : 92% 폴리에스터, 8% 에틸렌비닐아세테이트</li>
                    <li>수입자 : 크록스코리아</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 유의사항 */}
          <div className="tab-section">
            <div
              className={`tab-header ${openNotes ? "active" : ""}`}
              onClick={() => setOpenNotes(!openNotes)}
            >
              <h3 className="tab-title">유의 사항 및 품질보증기간</h3>
              <div className="tab-icon">
                <img
                  src="/images/Sub_Women_Images/icon-arrow-down.svg"
                  alt="토글"
                />
              </div>
            </div>
            <div className={`tab-content ${openNotes ? "active" : ""}`}>
              <div className="content-inner">
                <div className="desc-section">
                  <h4 className="desc-title">유의 사항</h4>
                  <ul className="desc-list">
                    <li>
                      에스컬레이터나 무빙워크에서 사고방지를 위한 안전선 안에
                      위치하시고, 접촉면 어디에도 닿지 않도록 하십시오.
                    </li>
                    <li>미끄러지기 쉬운 장소에서는 주의해 주십시오.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 리뷰 */}
          <div className="tab-section">
            <div
              className={`tab-header ${openReview ? "active" : ""}`}
              onClick={() => setOpenReview(!openReview)}
            >
              <h3 className="tab-title">
                리뷰
                <span className="tab-subtitle">(1,747)</span>
              </h3>
              <div className="tab-icon">
                <img
                  src="/images/Sub_Women_Images/icon-arrow-down.svg"
                  alt="토글"
                />
              </div>
            </div>
            <div className={`tab-content ${openReview ? "active" : ""}`}>
              <div className="content-inner">
                <ProductReviews productId="205089" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 사이즈표 모달 */}
      {showSizeChart && (
        <div
          className="size-chart-modal"
          onClick={() => setShowSizeChart(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {CrocsProduct?.cate?.toLowerCase().includes("kid") ||
            CrocsProduct?.cate?.includes("키즈") ? (
              <KidSize onClose={() => setShowSizeChart(false)} />
            ) : (
              <AdultSize onClose={() => setShowSizeChart(false)} />
            )}
          </div>
        </div>
      )}

      <WishAddPopup />
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
