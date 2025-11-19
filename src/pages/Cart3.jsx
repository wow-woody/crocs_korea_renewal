import React, { useState, useMemo } from 'react';
import './scss/Cart.scss';
import Title from "../components/Title";
import { Prouducts } from "../data/CrocsProductsData.js";

function Cart() {
  // 초기 상품 데이터
  // 초기 상품 데이터 생성 (useMemo로 한 번만 생성)
  const initialProducts = useMemo(() => {
    const result = [];

    // 여성 상품 1개 선택
    const womenItems = Prouducts.filter((product) => {
      if (!product.cate) return false;
      // cate 속성비교
      const cateLower = product.cate.toLowerCase();
      return cateLower.includes("여성");
    });
    const randomWomen = getRandomItems(womenItems, 1);

    randomWomen.forEach((item) => {
      result.push({
        id: result.length + 1,
        name: item.product || "상품명 없음",
        color: parseColor(item.color),
        size: "W7/W8",
        quantity: 1,
        price: parsePrice(item.price_dc_rate || item.price),
        image: Array.isArray(item.product_img)
          ? item.product_img[0]
          : item.product_img,
        category: "여성",
      });
    });

    // 남성 상품 1개 추가
    const menItems = Prouducts.filter((product) => {
      if (!product.cate) return false;
      // cate 속성비교
      const cateLower = product.cate.toLowerCase();
      return cateLower.includes("남성");
    });
    const randomMen = getRandomItems(menItems, 1);

    randomMen.forEach((item) => {
      result.push({
        id: result.length + 1,
        name: item.product || "상품명 없음",
        color: parseColor(item.color),
        size: "M9/M10",
        quantity: 1,
        price: parsePrice(item.price_dc_rate || item.price),
        image: Array.isArray(item.product_img)
          ? item.product_img[0]
          : item.product_img,
        category: "남성",
      });
    });
    return result;
    
  }, []);

  const [products, setProducts] = useState(initialProducts);
  const [selectedProducts, setSelectedProducts] = useState(new Set(initialProducts.map(p => p.id)));
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  // 배송비 설정
  const freeShippingThreshold = 30000;
  const shippingFee = 2500;

  // 금액 계산
  const subtotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  const selectedSubtotal = products
    .filter(p => selectedProducts.has(p.id))
    .reduce((sum, product) => sum + product.price * product.quantity, 0);
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const total = subtotal + shipping - discount;
  const selectedTotal = selectedSubtotal + (selectedSubtotal >= freeShippingThreshold ? 0 : shippingFee) - discount;

  // 금액 포맷팅
  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  // 전체 선택/해제
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(new Set(products.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  // 개별 선택
  const handleSelectProduct = (id) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  // 상품 제거
  const handleRemoveProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
    const newSelected = new Set(selectedProducts);
    newSelected.delete(id);
    setSelectedProducts(newSelected);
  };

  // 선택 상품 삭제
  const handleRemoveSelected = () => {
    if (selectedProducts.size === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }
    if (window.confirm(`선택한 ${selectedProducts.size}개 상품을 삭제하시겠습니까?`)) {
      setProducts(products.filter(product => !selectedProducts.has(product.id)));
      setSelectedProducts(new Set());
    }
  };

  // 수량 증가
  const handleIncreaseQuantity = (id) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, quantity: product.quantity + 1 } : product
    ));
  };

  // 수량 감소
  const handleDecreaseQuantity = (id) => {
    setProducts(products.map(product =>
      product.id === id && product.quantity > 1
        ? { ...product, quantity: product.quantity - 1 }
        : product
    ));
  };

  // 쿠폰 적용
  const handleCouponApply = () => {
    if (couponCode.trim()) {
      if (couponCode === 'WELCOME10') {
        setDiscount(Math.floor(subtotal * 0.1));
        setCouponApplied(true);
        alert('10% 할인 쿠폰이 적용되었습니다.');
      } else if (couponCode === 'SAVE5000') {
        setDiscount(5000);
        setCouponApplied(true);
        alert('5,000원 할인 쿠폰이 적용되었습니다.');
      } else {
        alert('유효하지 않은 쿠폰번호입니다.');
      }
    } else {
      alert('쿠폰번호를 입력해주세요.');
    }
  };

  // 전체 상품 주문
  const handleOrderAll = () => {
    if (products.length === 0) {
      alert('장바구니에 상품이 없습니다.');
      return;
    }
    setIsOrderComplete(true);
    setTimeout(() => {
      alert(`전체 ${products.length}개 상품 주문이 완료되었습니다!`);
    }, 100);
  };

  // 선택 상품 주문
  const handleOrderSelected = () => {
    if (selectedProducts.size === 0) {
      alert('주문할 상품을 선택해주세요.');
      return;
    }
    setIsOrderComplete(true);
    setTimeout(() => {
      alert(`선택한 ${selectedProducts.size}개 상품 주문이 완료되었습니다!`);
    }, 100);
  };

  // 선택 상품 선물
  const handleGiftSelected = () => {
    if (selectedProducts.size === 0) {
      alert('선물할 상품을 선택해주세요.');
      return;
    }
    alert(`선택한 ${selectedProducts.size}개 상품을 선물하기 페이지로 이동합니다.`);
  };

  return (
    <div className="cart-container">
      <div className="inner">
        <Title title="Cart" />
        <div className="cart-content">
          {/* 왼쪽: 상품 목록 */}
          <div className="cart-left">
            <div className="product-header">
              <div className="select-all">
                <label>
                  <input
                    type="checkbox"
                    checked={products.length > 0 && selectedProducts.size === products.length}
                    onChange={handleSelectAll}
                  />
                  <span>전체선택 ({selectedProducts.size}/{products.length})</span>
                </label>
              </div>
              <button className="btn-remove-selected" onClick={handleRemoveSelected}>
                선택삭제
              </button>
            </div>

            <div className="product-list">
              {products.length === 0 ? (
                <div className="empty-cart">
                  <p>장바구니에 담긴 상품이 없습니다.</p>
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="product-item">
                    <input
                      type="checkbox"
                      className="product-checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                    
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                    </div>

                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-option">색상: {product.color}</p>
                      <p className="product-option">사이즈: {product.size}</p>

                      <div className="quantity-control">
                        <button
                          className="quantity-btn"
                          onClick={() => handleDecreaseQuantity(product.id)}
                          disabled={product.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity-display">{product.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleIncreaseQuantity(product.id)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="product-price">
                      <span className="price">
                        {formatPrice(product.price * product.quantity)}원
                      </span>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveProduct(product.id)}
                        title="상품 삭제"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="coupon-info">
              <p>
                💡 사용 가능한 테스트 쿠폰:<br />
                • WELCOME10 (10% 할인)<br />
                • SAVE5000 (5,000원 할인)
              </p>
            </div>
          </div>

          {/* 오른쪽: 주문 요약 */}
          <div className="cart-right">
            {/* 쿠폰 섹션 */}
            <div className="coupon-section">
              <h2 className="section-title">쿠폰/할인코드</h2>
              
              <div className="coupon-form">
                <label className="form-label">할인쿠폰 적용</label>
                <div className="coupon-input-group">
                  <input 
                    type="text" 
                    className="coupon-input"
                    placeholder="쿠폰번호 입력"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="btn-coupon" onClick={handleCouponApply}>
                    적용
                  </button>
                </div>
                {couponApplied && (
                  <p className="coupon-message">쿠폰이 적용되었습니다.</p>
                )}
              </div>

              <div className="discount-amount">
                <span className="discount-label">적용금액</span>
                <span className="discount-value">-{formatPrice(discount)}원</span>
              </div>
            </div>

            {/* 가격 요약 */}
            <div className="price-summary">
              <div className="price-row">
                <span className="price-label">주문상품</span>
                <span className="price-value">{formatPrice(subtotal)}원</span>
              </div>

              <div className="price-row">
                <span className="price-label">배송비</span>
                <span className={`price-value ${shipping === 0 ? 'free-shipping' : ''}`}>
                  {shipping === 0 ? '무료배송' : `+${formatPrice(shipping)}원`}
                </span>
              </div>

              {shipping > 0 && (
                <p className="shipping-notice">
                  {formatPrice(freeShippingThreshold)}원 이상 구매 시 무료배송
                </p>
              )}

              <div className="price-row">
                <span className="price-label">할인/쿠폰</span>
                <span className="price-value discount">-{formatPrice(discount)}원</span>
              </div>

              <div className="price-row total-row">
                <span className="price-label total-label">최종 결제 금액</span>
                <span className="price-value total-value">{formatPrice(total)}원</span>
              </div>
            </div>

            {/* 안내문구 */}
            <div className="terms-content">
              <p className="terms-description">
                장바구니 상품은 30일간 보관됩니다. 장기간 보관을 원하실 경우 좋아요 상품에 추가해주세요.<br />
                교차 및 복수 할인 프로모션 적용 주문 건의 경우 부분 취소 및 반품은 불가하며, 전체 취소/반품 후 재주문해주셔야합니다.
              </p>
            </div>

            {/* 주문 버튼들 */}
            {!isOrderComplete ? (
              <div className="order-buttons">
                <button className="btn-order-all" onClick={handleOrderAll}>
                  전체상품주문하기
                </button>
                
                <div className="btn-group">
                  <button className="btn-order-selected" onClick={handleOrderSelected}>
                    선택상품주문
                  </button>
                  
                  <button className="btn-gift-selected" onClick={handleGiftSelected}>
                    선택상품선물
                  </button>
                </div>
              </div>
            ) : (
              <div className="order-complete">
                <div className="complete-icon">✓</div>
                <p className="complete-text">주문이 완료되었습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 배열에서 랜덤하게 아이템 선택
function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}


// 가격
function parsePrice(priceStr) {
  if (!priceStr) return 0;

  let price = String(priceStr).replace(/₩|,/g, "").trim();
  price = price.replace(/\([^)]*\)/g, "").trim();

  const numbers = price.match(/\d+/);
  return numbers ? parseInt(numbers[0]) : 0;
}

// 색상
function parseColor(colorArray) {
  if (!colorArray || colorArray.length === 0) return "기본색상";

  const firstColor = String(colorArray[0]);

  if (firstColor.toLowerCase().includes("rgb")) {
    if (firstColor.includes("0, 0, 0")) return "블랙";
    if (firstColor.includes("249, 249, 249")) return "화이트";
    if (firstColor.includes("150, 105, 74")) return "브라운";
    return "컬러";
  }

  return firstColor;
}

export default Cart;