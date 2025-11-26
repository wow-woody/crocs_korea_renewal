import React, { useEffect } from "react";
import "./scss/Cart.scss";
import Title from "../components/Title";
import { Products } from "../data/CrocsProductsData.js";
import CartProgress from "../components/CartProgress";
import { useCartStore } from "../store/useCartStore";
import { wishListStore } from "../store/wishListStore";
import { useNavigate } from "react-router-dom";

function Cart() {
  const cartStore = useCartStore();
  // console.log('cartStore:', cartStore);
  const wishStore = wishListStore();
  const navigate = useNavigate();

  const {
    cartProducts,
    selectedProducts,
    isOrderComplete,
    freeShippingThreshold,
    initializeCart,
    addFromWishlist,
    getSubtotal,
    getSelectedSubtotal,
    getShipping,
    getTotal,
    getSelectedTotal,
    handleSelectAll,
    handleSelectProduct,
    handleRemoveProduct,
    handleRemoveSelected,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleOrderAll,
    handleOrderSelected,
    handleGiftSelected,
    // } = useCartStore();
  } = cartStore || {};

  // wishListStore에서 cartWishItems 가져오기
  const { cartWishItems = [] } = wishStore || {};

  // 장바구니 초기화
  useEffect(() => {
    initializeCart(Products, cartWishItems);
  }, []);

  // cartWishItems 체크
  useEffect(() => {
    if (addFromWishlist && cartWishItems && cartWishItems.length > 0) {
      addFromWishlist(Products, cartWishItems);
    }
  }, [cartWishItems]);

  // 가격 계산
  const subtotal = getSubtotal();
  const selectedSubtotal = getSelectedSubtotal();
  const shipping = getShipping();
  const total = getTotal();
  const selectedTotal = getSelectedTotal();

  // 금액 포맷팅
  const formatPrice = (price) => {
    return price.toLocaleString("ko-KR");
  };

  const handleToOrder = (type) => {
    let orderData;

    if (type === 'all') {
      if (cartProducts.length === 0) {
      alert("장바구니에 상품이 없습니다.");
      return;
    }
    orderData = handleOrderAll();
  } else {
    if (selectedProducts.size === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }
    orderData = handleOrderSelected();
  }

  // orderData가 null이면 멈추기
  if (!orderData) {
    return;
  }

    navigate('/order', {
      state: {
        orderProducts: orderData.products,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        total: orderData.total,
      },
    });
  }


  return (
    <div className='cart-container'>
      <div className='inner'>
        <Title title='Cart' />
        <CartProgress />
        <div className='cart-content'>
          {/* 왼쪽: 상품 목록 */}
          <div className='cart-left'>
            <div className='product-header'>
              <div className='select-all'>
                <label>
                  <input
                    type='checkbox'
                    checked={
                      cartProducts.length > 0 &&
                      selectedProducts.size === cartProducts.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <span>
                    전체선택 ({selectedProducts.size}/{cartProducts.length})
                  </span>
                </label>
              </div>
              <button
                className='btn-remove-selected'
                onClick={handleRemoveSelected}
              >
                선택삭제
              </button>
            </div>

            <div className='product-list'>
              {cartProducts.length === 0 ? (
                <div className='empty-cart'>
                  <p>장바구니에 담긴 상품이 없습니다.</p>
                </div>
              ) : (
                cartProducts.map((product) => (
                  <div key={product.id} className='product-item-wrap'>
                    <input
                      type='checkbox'
                      className='product-checkbox'
                      checked={selectedProducts.has(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                    <div className='product-item'>
                      <div className='product-image'>
                        <img src={product.product_img} alt={product.name} />
                      </div>

                      <div className='product-info'>
                        <h3 className='product-name'>{product.name}</h3>
                        {/* 지비츠 - 사이즈가 있을때만 표시 */}
                        {product.size && (
                          <p className='product-option'>
                            사이즈: {product.size}
                          </p>
                        )}
                        {/* <p className='product-color'>
                                                    컬러: {product.color}
                                                </p> */}

                        <div className='quantity-control'>
                          <button
                            className='quantity-btn'
                            onClick={() => handleDecreaseQuantity(product.id)}
                            disabled={product.quantity <= 1}
                          >
                            -
                          </button>
                          <span className='quantity-display'>
                            {product.quantity}
                          </span>
                          <button
                            className='quantity-btn'
                            onClick={() => handleIncreaseQuantity(product.id)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className='product-price'>
                        <span className='price'>
                          {formatPrice(product.price * product.quantity)}원
                        </span>
                        {/* <button
                          className='remove-btn'
                          onClick={() => handleRemoveProduct(product.id)}
                          title='상품 삭제'
                        >
                          ✕
                        </button> */}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 오른쪽: 주문 요약 */}
          <div className='cart-right'>
            {/* 가격 요약 */}
            <div className='price-summary'>
              <div className='price-row'>
                <span className='price-label'>주문상품</span>
                <span className='price-value'>{formatPrice(subtotal)}원</span>
              </div>
              {cartProducts.length > 0 && (
                <>
                  <div className='price-row'>
                    <span className='price-label'>배송비</span>
                    <span
                      className={`price-value ${shipping === 0 ? "free-shipping" : ""
                        }`}
                    >
                      {shipping === 0
                        ? "무료배송"
                        : `+${formatPrice(shipping)}원`}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <p className='shipping-notice'>
                      {formatPrice(freeShippingThreshold)}원 이상 구매 시
                      무료배송
                    </p>
                  )}
                </>
              )}

              <div className='price-row total-row'>
                <span className='price-label total-label'>최종 결제 금액</span>
                <span className='price-value total-value'>
                  {formatPrice(total)}원
                </span>
              </div>
            </div>

            {/* 안내문구 */}
            <div className='terms-content'>
              <p className='terms-description'>
                장바구니 상품은 30일간 보관됩니다. 장기간 보관을 원하실 경우
                위시리스트에 추가해주세요. <br />
                교차 및 복수 할인 프로모션 적용 주문 건의 경우 부분 취소 및
                반품은 불가하며, 전체 취소/반품 후 재주문해주셔야합니다.
              </p>
            </div>

            {/* 주문 버튼들 */}
            {!isOrderComplete ? (
              <div className='order-buttons'>
                <button className='btn-order-all' onClick={() => handleToOrder('all')}>
                  전체상품주문하기
                </button>

                <div className='btn-group'>
                  <button
                    className='btn-order-selected' onClick={() => handleToOrder('selected')}>
                    선택상품주문
                  </button>

                  <button
                    className='btn-gift-selected' onClick={handleGiftSelected}
                  >
                    선택상품선물
                  </button>
                </div>
              </div>
            ) : (
              <div className='order-complete'>
                <div className='complete-icon'>✓</div>
                <p className='complete-text'>주문이 완료되었습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}

export default Cart;
