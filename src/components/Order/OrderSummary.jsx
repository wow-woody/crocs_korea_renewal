import React from 'react';

function OrderSummary({
    products,
    subtotal,
    shipping,
    discount = 0,
    total,
    freeShippingThreshold,
    isOrderComplete,
    onOrderComplete,
    onRemoveProduct,
    onIncreaseQuantity,
    onDecreaseQuantity,
}) {
    // 금액 포맷팅
    const formatPrice = (price) => {
        return price.toLocaleString('ko-KR');
    };

    return (
        <div className="order-summary">
            <h2 className="summary-title">주문내역 ({products.length})</h2>

            {/* 상품 목록 */}
            <div className="product-list">
                {products.map((product) => (
                    <div key={product.id} className="product-item">
                        <div className="product-image">
                            <img src={product.image} alt={product.name} />
                        </div>

                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-option">색상: {product.color}</p>
                            <p className="product-option">사이즈: {product.size}</p>

                            {/* 수량 조절 버튼 */}
                            <div className="quantity-control">
                                <button
                                    className="quantity-btn"
                                    onClick={() => onDecreaseQuantity(product.id)}
                                    disabled={product.quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="quantity-display">{product.quantity}</span>
                                <button
                                    className="quantity-btn"
                                    onClick={() => onIncreaseQuantity(product.id)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* 삭제 버튼과 가격 (세로 배치) */}
                        <div className="product-price">
                            <button
                                className="remove-btn"
                                onClick={() => onRemoveProduct(product.id)}
                                title="상품 삭제"
                            >
                                ✕
                            </button>
                            <span className="price">
                                {formatPrice(product.price * product.quantity)}원
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 가격 요약 */}
            <div className="price-summary">
                <div className="price-row">
                    <span className="price-label">주문상품</span>
                    <span className="price-value">{formatPrice(subtotal)}원</span>
                </div>

                <div className="price-row">
                    <span className="price-label">배송비</span>
                    <span className="price-value shipping-fee">
                        {shipping === 0 ? (
                            <span className="free-shipping">무료배송</span>
                        ) : (
                            `+${formatPrice(shipping)}원`
                        )}
                    </span>
                </div>

                {shipping > 0 && (
                    <p className="shipping-notice">
                        {formatPrice(freeShippingThreshold)}원 이상 구매 시 무료배송
                    </p>
                )}

                {/* 할인 금액 표시 - 할인이 있을 때만 */}
                {discount > 0 && (
                    <div className="price-row">
                        <span className="price-label">할인/쿠폰</span>
                        <span className="price-value discount">-{formatPrice(discount)}원</span>
                    </div>
                )}

                <div className="price-row total-row">
                    <span className="price-label total-label">최종 결제 금액</span>
                    <span className="price-value total-value">{formatPrice(total)}원</span>
                </div>
            </div>

            {/* 결제 버튼 */}
            {!isOrderComplete ? (
                <button className="btn-checkout" onClick={onOrderComplete}>
                    {formatPrice(total)}원 결제하기
                </button>
            ) : (
                <div className="order-complete-message">
                    <div className="success-icon">✓</div>
                    <h3 className="success-title">주문이 완료되었습니다!</h3>
                    <p className="success-message">
                        빠른 시일 내에 배송해드리겠습니다.
                        <br />
                        감사합니다.
                        <br />
                        <br />
                        <span className="redirect-notice">잠시 후 마이페이지로 이동합니다.</span>
                    </p>
                </div>
            )}
        </div>
    );
}

export default OrderSummary;