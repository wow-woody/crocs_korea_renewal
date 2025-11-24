import React from 'react';
import { useRecentProductsStore } from '../store/recentProductsStore';
import './scss/RecentProducts.scss';

const RecentProducts = () => {
  const { recentProducts, removeProduct, clearAll } = useRecentProductsStore();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (date) => {
    const now = new Date();
    const viewed = new Date(date);
    const diffMs = now - viewed;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return viewed.toLocaleDateString('ko-KR');
  };

  if (recentProducts.length === 0) {
    return (
      <div className="recent-products">
        <div className="recent-products__header">
          <h1>최근 본 상품</h1>
        </div>
        <div className="recent-products__empty">
          <div className="empty-icon">👀</div>
          <p>최근 본 상품이 없습니다</p>
          <span>상품을 둘러보고 여기서 다시 확인해보세요</span>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-products">
      <div className="recent-products__header">
        <h1>최근 본 상품</h1>
        <div className="header-info">
          <span className="count">{recentProducts.length}개</span>
          <button className="clear-btn" onClick={clearAll}>
            전체 삭제
          </button>
        </div>
      </div>

      <div className="recent-products__list">
        {recentProducts.map((product) => (
          <div key={product.id} className="product-item">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <div className="product-price">
                <span className="price">{formatPrice(product.price)}원</span>
                {product.discount && (
                  <span className="discount">{product.discount}%</span>
                )}
              </div>
              <div className="product-meta">
                <span className="viewed-time">{formatDate(product.viewedAt)}</span>
                {product.rating && (
                  <span className="rating">
                    ⭐ {product.rating} ({product.reviewCount})
                  </span>
                )}
              </div>
            </div>

            <div className="product-actions">
              <button 
                className="remove-btn"
                onClick={() => removeProduct(product.id)}
                aria-label="삭제"
              >
                ✕
              </button>
              <button className="cart-btn">장바구니</button>
              <button className="buy-btn">구매하기</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProducts;