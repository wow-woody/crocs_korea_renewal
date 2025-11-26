import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCrocsProductStore } from "../store/useCrocsProductStore";
import { wishListStore } from "../store/wishListStore";
import { useRecentProductsStore } from "../store/recentProductsStore";
import Title from "../components/Title";
import WishAddPopup from "../components/WishAddPopup";
import { useCrocsSizeStore } from "../store/useCrocsSizeStore";

const CrocsProductDetail = () => {
  const { id } = useParams();
  const { crocsItems, onFetchItems } = useCrocsProductStore();
  const { crocsSizesByCategory, onFetchSize } = useCrocsSizeStore();
  const { onAddWishList, onProductAddCart } = wishListStore();
  const { addProduct } = useRecentProductsStore();

  const [CrocsProduct, setCrocsProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState("brown");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

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

  const totalPrice = detailPrice * quantity;

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const handleColorSelect = (c) => setSelectedColor(c);

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
    const findCrocsItem = crocsItems.find(
      (item) => String(item.id) === String(id)
    );
    setCrocsProduct(findCrocsItem);
  }, [id, crocsItems]);

  // ⭐ 상품 정보가 로드되면 최근 본 상품에 추가
  useEffect(() => {
    if (!CrocsProduct) return;

    // 이미지 배열 처리 (useEffect 안에서만)
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

    // 최근 본 상품에 추가
    addProduct({
      id: CrocsProduct.id,
      name: CrocsProduct.product,
      image: productImages[0] || "",
      price: detailPrice.toLocaleString(),
      discountPrice: hasOriginal ? detailPrice.toLocaleString() : "",
      originPrice: hasOriginal ? originalPrice.toLocaleString() : "",
      discount: discountPercent || ""
    });

    console.log('✅ 최근 본 상품에 추가:', CrocsProduct.product);
  }, [CrocsProduct]); // ⭐ 의존성 배열 수정: CrocsProduct만!

  if (!CrocsProduct) {
    return <div>상품 정보를 불러오고 있으니 기다려주세요.</div>;
  }

  const normalizeCate = (cate) => {
    if (!cate) return "women";
    const c = cate.split(",")[0].trim().toLowerCase();
    if (c.includes("men") || c.includes("남성") || c.includes("man"))
      return "men";
    if (c.includes("women") || c.includes("여성") || c.includes("woman"))
      return "women";
    if (c.includes("kid") || c.includes("아동") || c.includes("주니어"))
      return "kids";
    return "women";
  };

  const mainCate = normalizeCate(CrocsProduct.cate);
  const categorySizes = crocsSizesByCategory[mainCate] || [];

  // ⭐ 이미지 배열 처리 (렌더링용 - 이 부분만 유지!)
  let images = [];
  if (Array.isArray(CrocsProduct.product_img)) {
    images = CrocsProduct.product_img
      .flatMap((item) => String(item).split(","))
      .map((v) => v.trim())
      .filter(Boolean);
  } else {
    images = String(CrocsProduct.product_img)
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  // 위시리스트에 담을 데이터 구성
  const handleAddToWishList = () => {
    const wishProduct = {
      id: CrocsProduct.id,
      title: CrocsProduct.product,
      imageUrl: images[0],
      price: detailPrice.toLocaleString(),
      originPrice: hasOriginal ? originalPrice.toLocaleString() : "",
      discountPrice: hasOriginal ? detailPrice.toLocaleString() : "",
      discountPercent: discountPercent ? `${discountPercent}%` : "",
      cate: CrocsProduct.cate,
      selectedSize: selectedSize,
      selectedColor: selectedColor,
    };

    console.log('위시리스트에 담을 상품:', wishProduct);
    onAddWishList(wishProduct);
  };

  // 장바구니 담기 핸들러
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('사이즈를 선택해주세요!');
      return;
    }

    const cartProduct = {
      id: CrocsProduct.id,
      name: CrocsProduct.product,
      title: CrocsProduct.product,
      price: detailPrice,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      product_img: images[0],
      cate: CrocsProduct.cate,
    };

    console.log('장바구니에 담을 상품:', cartProduct);
    onProductAddCart(cartProduct, quantity);
  };

  return (
    <div className="sub_page">
      <div className="inner">
        <Title title="ProductDetail" />
        <div className="product-detail-wrap">
          {/* 이미지 영역 */}
          <div className="product-img">
            <div className="product-img__crumbs-wrap">
              <ul className="product-img__crumbs">
                <li className="product-img__crumb product-img__crumb--home">
                  <a href="/" className="product-img__link" aria-label="홈">
                    <img
                      className="product-img__icon"
                      src="/images/Sub_Women_Images/icon-close_cross.svg"
                      alt="홈"
                    />
                  </a>
                </li>
                <li className="product-img__sep">
                  <span>:</span>
                </li>
                <li className="product-img__crumb product-img__crumb--category">
                  <button
                    type="button"
                    className="product-img__link"
                    aria-label="카테고리"
                  >
                    <span className="product-img__text">{mainCate}</span>
                  </button>
                </li>
                <li className="product-img__sep">
                  <span>:</span>
                </li>
                <li className="product-img__crumb product-img__crumb--current">
                  <button
                    type="button"
                    className="product-img__link"
                    aria-current="page"
                    aria-label="현재 상품"
                  >
                    <span className="product-img__text">
                      {CrocsProduct.product}
                    </span>
                    <img
                      className="product-img__icon"
                      src="/images/Sub_Women_Images/icon-close_cross.svg"
                      alt="닫기"
                    />
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
              <div className="thumbs__ctrl thumbs__ctrl--top" aria-hidden="true">
                <button
                  type="button"
                  className="thumbs__btn thumbs__btn--up"
                  tabIndex={-1}
                >
                  <img
                    className="thumbs__icon"
                    src="/images/icon-arrow-up-hairline.svg"
                    alt=""
                  />
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
                        style={
                          selectedImageIdx === idx
                            ? {
                                filter: "brightness(1.05)",
                                transform: "scale(1.05)",
                              }
                            : undefined
                        }
                      />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="thumbs__ctrl thumbs__ctrl--bottom" aria-hidden="true">
                <button
                  type="button"
                  className="thumbs__btn thumbs__btn--down"
                  tabIndex={-1}
                >
                  <img
                    className="thumbs__icon"
                    src="/images/icon-arrow-down-hairline.svg"
                    alt=""
                  />
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
                  <span className="product-info__price_dc_rate">
                    ₩{detailPrice ? detailPrice.toLocaleString() : "가격 없음"}
                  </span>

                  {hasOriginal && (
                    <>
                      <span className="product-info__price_breadcrumbs__line" />
                      <span className="product-info__price_sale">
                        {discountPercent}%
                      </span>
                      <span className="product-info__price_breadcrumbs__line" />
                      <span className="product-info__price_cost">
                        ₩{originalPrice.toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="product-info_breadcrumbs" />
              
              {/* 색상 선택 */}
              <div className="product-info_color">
                <div className="product-info__color-title-wrap">
                  <p className="product-info__color-title">색상</p>
                  <span className="product-info__price_breadcrumbs__line" />
                  <p className="product-info__color-select">
                    {colorOptions.find((c) => c.key === selectedColor)?.label ||
                      "브라운"}
                  </p>
                </div>
                <div
                  className="product-info__color-badge-wrap"
                  role="group"
                  aria-label="색상 선택"
                >
                  {colorOptions.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      className={`color-badge color-badge--${c.key} ${
                        selectedColor === c.key ? "active" : ""
                      }`}
                      aria-label={`${c.label} 선택`}
                      aria-pressed={selectedColor === c.key}
                      onClick={() => handleColorSelect(c.key)}
                    />
                  ))}
                </div>
              </div>
              
              {/* 사이즈 선택 */}
              <div className="product-info_size">
                <div className="product-info_size-title-wrap">
                  <p className="product-info_size-title">사이즈</p>
                  <span className="product-info_size_breadcrumbs__line" />
                  <p className="product-info_size-select">
                    {selectedSize || "선택하세요"}
                  </p>
                </div>
                <div className="product-info_size-btns-wrap">
                  <ul
                    className="product-info_size-btns"
                    role="group"
                    aria-label="사이즈 선택"
                  >
                    {categorySizes.map((size) => (
                      <li key={size}>
                        <button
                          type="button"
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

              {/* 수량 선택 */}
              <div className="product-info_quantity">
                <p className="product-info_quantity-title">수량</p>
                <div className="product-info_quantity-controls">
                  <button 
                    type="button" 
                    onClick={decreaseQty}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button 
                    type="button" 
                    onClick={increaseQty}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 총 가격 */}
              <div className="product-info_total">
                <p className="product-info_total-label">총 상품금액</p>
                <p className="product-info_total-price">
                  ₩{totalPrice.toLocaleString()}
                </p>
              </div>

              {/* 버튼 영역 */}
              <div className="product-info_buttons">
                <button 
                  className="product-btn-wish"
                  onClick={handleAddToWishList}
                >
                  위시리스트 💚
                </button>
                <button
                  className="product-btn-cart"
                  onClick={handleAddToCart}
                >
                  장바구니 담기
                </button>
              </div>
              
              <WishAddPopup />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrocsProductDetail;