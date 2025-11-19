import React, { useState, useMemo } from 'react';
import { Prouducts } from "../data/CrocsProductsData.js";

function CartPage() {
  // 초기 상품 데이터
  const initialProducts = useMemo(() => [
    {
      id: 1,
      name: '클래식 클로그',
      color: '블랙',
      size: 'W7/W8',
      price: 59900,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=200&fit=crop',
      category: '여성'
    },
    {
      id: 2,
      name: '라이트라이드 클로그',
      color: '화이트',
      size: 'M9/M10',
      price: 79900,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=200&fit=crop',
      category: '남성'
    },
    {
      id: 3,
      name: '베이야 클로그',
      color: '핑크',
      size: 'W6/W7',
      price: 49900,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&h=200&fit=crop',
      category: '여성'
    }
  ], []);

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
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '30px',
        color: '#333'
      }}>Cart</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '30px',
        alignItems: 'start'
      }}>
        {/* 왼쪽: 상품 목록 */}
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '30px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={products.length > 0 && selectedProducts.size === products.length}
                  onChange={handleSelectAll}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', marginRight: '8px' }}
                />
                <span style={{ fontSize: '16px', fontWeight: '600' }}>
                  전체선택 ({selectedProducts.size}/{products.length})
                </span>
              </label>
            </div>
            <button
              onClick={handleRemoveSelected}
              style={{
                padding: '8px 16px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              선택삭제
            </button>
          </div>

          {/* 상품 목록 */}
          <div style={{ marginBottom: '25px' }}>
            {products.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#999'
              }}>
                <p style={{ fontSize: '16px', margin: 0 }}>장바구니에 담긴 상품이 없습니다.</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} style={{
                  display: 'flex',
                  gap: '15px',
                  padding: '20px 0',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '30px' }}
                  />
                  
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: '#333'
                    }}>{product.name}</h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#777',
                      margin: '4px 0'
                    }}>색상: {product.color}</p>
                    <p style={{
                      fontSize: '14px',
                      color: '#777',
                      margin: '4px 0'
                    }}>사이즈: {product.size}</p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '12px'
                    }}>
                      <button
                        onClick={() => handleDecreaseQuantity(product.id)}
                        disabled={product.quantity <= 1}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          backgroundColor: 'white',
                          cursor: product.quantity <= 1 ? 'not-allowed' : 'pointer',
                          fontSize: '16px',
                          opacity: product.quantity <= 1 ? 0.5 : 1
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '14px', minWidth: '50px', textAlign: 'center' }}>
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => handleIncreaseQuantity(product.id)}
                        style={{
                          width: '28px',
                          height: '28px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#333'
                    }}>
                      {formatPrice(product.price * product.quantity)}원
                    </span>
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      style={{
                        width: '28px',
                        height: '28px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: '#999'
                      }}
                      title="상품 삭제"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#666'
          }}>
            <p style={{ margin: 0 }}>
              💡 사용 가능한 테스트 쿠폰:<br />
              • WELCOME10 (10% 할인)<br />
              • SAVE5000 (5,000원 할인)
            </p>
          </div>
        </div>

        {/* 오른쪽: 주문 요약 */}
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '30px',
          position: 'sticky',
          top: '20px'
        }}>
          {/* 쿠폰 섹션 */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '15px',
              color: '#333'
            }}>쿠폰/할인코드</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#555'
              }}>할인쿠폰 적용</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="쿠폰번호 입력"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '13px'
                  }}
                />
                <button 
                  onClick={handleCouponApply}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  적용
                </button>
              </div>
              {couponApplied && (
                <p style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#2e7d32'
                }}>쿠폰이 적용되었습니다.</p>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#555' }}>적용금액</span>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#d32f2f' }}>
                -{formatPrice(discount)}원
              </span>
            </div>
          </div>

          {/* 가격 요약 */}
          <div style={{
            padding: '20px 0',
            borderTop: '2px solid #333',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              fontSize: '14px'
            }}>
              <span style={{ color: '#666' }}>주문상품</span>
              <span style={{ fontWeight: '500' }}>{formatPrice(subtotal)}원</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              fontSize: '14px'
            }}>
              <span style={{ color: '#666' }}>배송비</span>
              <span style={{ fontWeight: '500', color: shipping === 0 ? '#2e7d32' : '#333' }}>
                {shipping === 0 ? '무료배송' : `+${formatPrice(shipping)}원`}
              </span>
            </div>

            {shipping > 0 && (
              <p style={{
                fontSize: '12px',
                color: '#999',
                marginBottom: '12px'
              }}>
                {formatPrice(freeShippingThreshold)}원 이상 구매 시 무료배송
              </p>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              <span style={{ color: '#666' }}>할인/쿠폰</span>
              <span style={{ fontWeight: '500', color: '#d32f2f' }}>-{formatPrice(discount)}원</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '15px',
              borderTop: '1px solid #e0e0e0',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              <span>최종 결제 금액</span>
              <span style={{ fontSize: '20px', color: '#333' }}>{formatPrice(total)}원</span>
            </div>
          </div>

          {/* 안내문구 */}
          <div style={{
            padding: '15px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '12px',
            lineHeight: '1.6',
            color: '#666'
          }}>
            <p style={{ margin: 0 }}>
              장바구니 상품은 30일간 보관됩니다. 장기간 보관을 원하실 경우 좋아요 상품에 추가해주세요.<br />
              교차 및 복수 할인 프로모션 적용 주문 건의 경우 부분 취소 및 반품은 불가하며, 전체 취소/반품 후 재주문해주셔야합니다.
            </p>
          </div>

          {/* 주문 버튼들 */}
          {!isOrderComplete ? (
            <div>
              <button 
                onClick={handleOrderAll}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              >
                전체상품주문하기
              </button>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleOrderSelected}
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: 'white',
                    color: '#333',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  선택상품주문
                </button>
                
                <button 
                  onClick={handleGiftSelected}
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: 'white',
                    color: '#333',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  선택상품선물
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '30px',
              backgroundColor: '#f0f7f0',
              borderRadius: '4px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                margin: '0 auto 15px',
                backgroundColor: '#2e7d32',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                color: 'white'
              }}>✓</div>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#2e7d32',
                margin: 0
              }}>주문이 완료되었습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;