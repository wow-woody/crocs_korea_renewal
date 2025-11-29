// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import OrderForm from './OrderForm.jsx';
// import OrderSummary from './OrderSummary.jsx';
// import OrderProgress from './OrderProgress.jsx';
// import Title from '../Title.jsx';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { loginAuthStore } from '../../store/loginStore';
// import { db } from '../../firebase/firebase';
// import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';

// import './styles/Order.scss';

// function Order() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [isOrderComplete, setIsOrderComplete] = useState(false);
//     const [completedOrderData, setCompletedOrderData] = useState(null);
//     const orderFormRef = useRef(null);

//     // 로그인 사용자 정보 가져오기
//     const { user } = loginAuthStore();

//     // 장바구니에서 받은 주문데이터
//     const cartOrderData = location.state || null;

//     // Cart에서 받은 데이터가 없으면 즉시 Cart로 리다이렉트
//     useEffect(() => {
//         if (
//             !cartOrderData ||
//             !cartOrderData.orderProducts ||
//             cartOrderData.orderProducts.length === 0
//         ) {
//             alert('주문할 상품이 없습니다. 장바구니로 이동합니다.');
//             navigate('/cart', { replace: true });
//         }
//     }, [cartOrderData, navigate]);

//     // 초기 상품 데이터 생성 (useMemo로 한 번만 생성)
//     const initialProducts = useMemo(() => {
//         if (cartOrderData && cartOrderData.orderProducts) {
//             return cartOrderData.orderProducts.map((item, index) => ({
//                 id: item.id || index + 1,
//                 name: item.name || item.product,
//                 color: parseColor(item.color),
//                 size: item.size || 'ONE SIZE',
//                 quantity: item.quantity || 1,
//                 price: item.price,
//                 image: Array.isArray(item.product_img) ? item.product_img[0] : item.product_img,
//                 category: item.cate || '일반',
//             }));
//         }

//         return [];
//     }, [cartOrderData]);

//     // 상품 목록을 state로 관리 (동적 변경 가능)
//     const [products, setProducts] = useState(initialProducts);

//     const shippingInfo = {
//         freeShippingThreshold: 30000,
//         shippingFee: 2500,
//     };

//     // 총 상품 금액 계산
//     const calculateSubtotal = () => {
//         if (!products || products.length === 0) return 0;
//         return products.reduce((sum, product) => sum + product.price * product.quantity, 0);
//     };

//     // 배송비 계산
//     const calculateShipping = () => {
//         const subtotal = calculateSubtotal();
//         return subtotal >= shippingInfo.freeShippingThreshold ? 0 : shippingInfo.shippingFee;
//     };

//     // 최종 결제 금액
//     const calculateTotal = () => {
//         return calculateSubtotal() + calculateShipping();
//     };

//     // 상품 삭제
//     const handleRemoveProduct = (productId) => {
//         if (!products) return;

//         if (products.length === 1) {
//             const confirmed = window.confirm(
//                 '모든 상품을 삭제하면 주문이 취소됩니다.\n장바구니로 이동하시겠습니까?'
//             );

//             if (confirmed) {
//                 navigate('/cart', { replace: true });
//             }
//             return;
//         }

//         setProducts(products.filter((product) => product.id !== productId));
//     };

//     // 수량 증가
//     const handleIncreaseQuantity = (productId) => {
//         setProducts(
//             products.map((product) =>
//                 product.id === productId ? { ...product, quantity: product.quantity + 1 } : product
//             )
//         );
//     };

//     // 수량 감소
//     const handleDecreaseQuantity = (productId) => {
//         setProducts(
//             products.map((product) =>
//                 product.id === productId && product.quantity > 1
//                     ? { ...product, quantity: product.quantity - 1 }
//                     : product
//             )
//         );
//     };

//     // 날짜 포맷팅
//     const formatDate = (date) => {
//         const d = new Date(date);
//         return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
//             d.getDate()
//         ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(
//             d.getMinutes()
//         ).padStart(2, '0')}`;
//     };

//     // 금액 포맷팅
//     const formatPrice = (price) => {
//         return price.toLocaleString('ko-KR');
//     };

//     // 주문 완료
//     const handleOrderComplete = async () => {
//         if (orderFormRef.current && !orderFormRef.current.validateForm()) {
//             return;
//         }

//         // 페이지 최상단으로 스크롤
//         window.scrollTo({ top: 0, behavior: 'smooth' });

//         try {
//             // 주문 폼 데이터 가져오기
//             const formData = orderFormRef.current.getOrderFormData();

//             // 주문 데이터 생성
//             const orderData = {
//                 orderId: `ORDER_${Date.now()}`,
//                 orderDate: new Date(),
//                 status: 'pending',
//                 products: products.map((p) => ({
//                     id: p.id,
//                     name: p.name,
//                     color: p.color,
//                     size: p.size,
//                     quantity: p.quantity,
//                     price: p.price,
//                     image: p.image,
//                 })),
//                 subtotal: calculateSubtotal(),
//                 shipping: calculateShipping(),
//                 total: calculateTotal(),
//                 userId: user?.uid || null,
//                 userEmail: user?.email || formData.email,
//                 userName: user?.name || formData.ordererName,
//                 // 비회원 주문인 경우 추가 정보 저장
//                 ...(user
//                     ? {}
//                     : {
//                           password: formData.password, // 비회원 비밀번호
//                           phone: formData.phone,
//                           receiverName: formData.receiverName,
//                           address: `${formData.postcode} ${formData.address} ${formData.detailAddress}`,
//                           deliveryPhone: formData.deliveryPhone,
//                       }),
//             };

//             if (user) {
//                 // 로그인 사용자: users 컬렉션에 주문 내역 추가
//                 const userRef = doc(db, 'users', user.uid);
//                 await updateDoc(userRef, {
//                     orders: arrayUnion(orderData),
//                 });
//                 console.log('주문 내역이 사용자 정보에 저장되었습니다.');
//             } else {
//                 // 비회원: orders 컬렉션에 별도 저장
//                 await addDoc(collection(db, 'orders'), orderData);
//                 console.log('비회원 주문 내역이 저장되었습니다.');
//             }

//             // 주문 완료 데이터 저장
//             setCompletedOrderData(orderData);
//             setIsOrderComplete(true);

//             // 주문 완료 후 장바구니 비우기
//             if (cartOrderData) {
//                 localStorage.setItem('cartIds', JSON.stringify([]));
//             }

//             // 회원/비회원에 따라 다른 페이지로 이동
//             setTimeout(() => {
//                 if (user) {
//                     navigate('/userinfo', { replace: true });
//                 } else {
//                     navigate('/', { replace: true });
//                 }
//             }, 5000);
//         } catch (error) {
//             console.error('주문 저장 실패:', error);
//             alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
//         }
//     };

//     return (
//         <div className="order-container">
//             <div className="main-title">
//                 <Title title="Order" />
//             </div>
//             <OrderProgress isOrderComplete={isOrderComplete} />

//             {!isOrderComplete ? (
//                 <div className="order-content">
//                     <div className="order-left">
//                         <OrderForm ref={orderFormRef} />
//                     </div>

//                     <div className="order-right">
//                         <OrderSummary
//                             products={products}
//                             subtotal={calculateSubtotal()}
//                             shipping={calculateShipping()}
//                             total={calculateTotal()}
//                             freeShippingThreshold={shippingInfo.freeShippingThreshold}
//                             isOrderComplete={isOrderComplete}
//                             onOrderComplete={handleOrderComplete}
//                             onRemoveProduct={handleRemoveProduct}
//                             onIncreaseQuantity={handleIncreaseQuantity}
//                             onDecreaseQuantity={handleDecreaseQuantity}
//                         />
//                     </div>
//                 </div>
//             ) : (
//                 <div className="order-complete-wrapper">
//                     <div className="order-complete-message">
//                         <div className="success-icon">✓</div>
//                         <h3 className="success-title">주문이 완료되었습니다!</h3>

//                         {completedOrderData && (
//                             <div className="order-info-box">
//                                 <div className="order-info-row">
//                                     <span className="info-label">주문번호</span>
//                                     <span className="info-value">{completedOrderData.orderId}</span>
//                                 </div>
//                                 <div className="order-info-row">
//                                     <span className="info-label">주문자</span>
//                                     <span className="info-value">
//                                         {completedOrderData.userName}
//                                     </span>
//                                 </div>
//                                 <div className="order-info-row">
//                                     <span className="info-label">주문일시</span>
//                                     <span className="info-value">
//                                         {formatDate(completedOrderData.orderDate)}
//                                     </span>
//                                 </div>
//                                 <div className="order-info-row">
//                                     <span className="info-label">결제금액</span>
//                                     <span className="info-value total">
//                                         {formatPrice(completedOrderData.total)}원
//                                     </span>
//                                 </div>
//                             </div>
//                         )}

//                         <p className="success-message">
//                             빠른 시일 내에 배송해드리겠습니다.
//                             <br />
//                             감사합니다.
//                         </p>

//                         <p className="redirect-notice">
//                             {user
//                                 ? '잠시 후 마이페이지로 이동합니다.'
//                                 : '잠시 후 메인페이지로 이동합니다.'}
//                         </p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// // 색상 파싱
// function parseColor(colorArray) {
//     if (!colorArray || colorArray.length === 0) return '기본색상';

//     const firstColor = String(colorArray[0]);

//     if (firstColor.toLowerCase().includes('rgb')) {
//         if (firstColor.includes('0, 0, 0')) return '블랙';
//         if (firstColor.includes('249, 249, 249')) return '화이트';
//         if (firstColor.includes('150, 105, 74')) return '브라운';
//         return '컬러';
//     }

//     return firstColor;
// }

// export default Order;

import React, { useState, useMemo, useRef, useEffect } from 'react';
import OrderForm from './OrderForm.jsx';
import OrderSummary from './OrderSummary.jsx';
import OrderProgress from './OrderProgress.jsx';
import Title from '../Title.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginAuthStore } from '../../store/loginStore';
import { db } from '../../firebase/firebase';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import './styles/Order.scss';
import './styles/OrderComplete.scss';

function Order() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOrderComplete, setIsOrderComplete] = useState(false);
    const [completedOrderData, setCompletedOrderData] = useState(null);
    const orderFormRef = useRef(null);

    // 로그인 사용자 정보 가져오기
    const { user } = loginAuthStore();

    // 장바구니에서 받은 주문데이터
    const cartOrderData = location.state || null;

    // Cart에서 받은 데이터가 없으면 즉시 Cart로 리다이렉트
    useEffect(() => {
        if (
            !cartOrderData ||
            !cartOrderData.orderProducts ||
            cartOrderData.orderProducts.length === 0
        ) {
            alert('주문할 상품이 없습니다. 장바구니로 이동합니다.');
            navigate('/cart', { replace: true });
        }
    }, [cartOrderData, navigate]);

    // 초기 상품 데이터 생성 (useMemo로 한 번만 생성)
    const initialProducts = useMemo(() => {
        if (cartOrderData && cartOrderData.orderProducts) {
            return cartOrderData.orderProducts.map((item, index) => ({
                id: item.id || index + 1,
                name: item.name || item.product,
                color: parseColor(item.color),
                size: item.size || 'ONE SIZE',
                quantity: item.quantity || 1,
                price: item.price,
                image: Array.isArray(item.product_img) ? item.product_img[0] : item.product_img,
                category: item.cate || '일반',
            }));
        }

        return [];
    }, [cartOrderData]);

    // 상품 목록을 state로 관리 (동적 변경 가능)
    const [products, setProducts] = useState(initialProducts);

    const shippingInfo = {
        freeShippingThreshold: 30000,
        shippingFee: 2500,
    };

    // 총 상품 금액 계산
    const calculateSubtotal = () => {
        if (!products || products.length === 0) return 0;
        return products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    };

    // 배송비 계산
    const calculateShipping = () => {
        const subtotal = calculateSubtotal();
        return subtotal >= shippingInfo.freeShippingThreshold ? 0 : shippingInfo.shippingFee;
    };

    // 최종 결제 금액
    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping();
    };

    // 상품 삭제
    const handleRemoveProduct = (productId) => {
        if (!products) return;

        if (products.length === 1) {
            const confirmed = window.confirm(
                '모든 상품을 삭제하면 주문이 취소됩니다.\n장바구니로 이동하시겠습니까?'
            );

            if (confirmed) {
                navigate('/cart', { replace: true });
            }
            return;
        }

        setProducts(products.filter((product) => product.id !== productId));
    };

    // 수량 증가
    const handleIncreaseQuantity = (productId) => {
        setProducts(
            products.map((product) =>
                product.id === productId ? { ...product, quantity: product.quantity + 1 } : product
            )
        );
    };

    // 수량 감소
    const handleDecreaseQuantity = (productId) => {
        setProducts(
            products.map((product) =>
                product.id === productId && product.quantity > 1
                    ? { ...product, quantity: product.quantity - 1 }
                    : product
            )
        );
    };

    // 날짜 포맷팅
    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
            d.getDate()
        ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(
            d.getMinutes()
        ).padStart(2, '0')}`;
    };

    // 금액 포맷팅
    const formatPrice = (price) => {
        return price.toLocaleString('ko-KR');
    };

    // 주문 완료
    const handleOrderComplete = async () => {
        if (orderFormRef.current && !orderFormRef.current.validateForm()) {
            return;
        }

        // 페이지 최상단으로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });

        try {
            // 주문 폼 데이터 가져오기
            const formData = orderFormRef.current.getOrderFormData();

            // 주문 데이터 생성
            const orderData = {
                orderId: `ORDER_${Date.now()}`,
                orderDate: new Date(),
                status: 'pending',
                products: products.map((p) => ({
                    id: p.id,
                    name: p.name,
                    color: p.color,
                    size: p.size,
                    quantity: p.quantity,
                    price: p.price,
                    image: p.image,
                })),
                subtotal: calculateSubtotal(),
                shipping: calculateShipping(),
                total: calculateTotal(),
                userId: user?.uid || null,
                userEmail: user?.email || formData.email,
                userName: user?.name || formData.ordererName,
                // 비회원 주문인 경우 추가 정보 저장
                ...(user
                    ? {}
                    : {
                          password: formData.password, // 비회원 비밀번호
                          phone: formData.phone,
                          receiverName: formData.receiverName,
                          address: `${formData.postcode} ${formData.address} ${formData.detailAddress}`,
                          deliveryPhone: formData.deliveryPhone,
                      }),
            };

            if (user) {
                // 로그인 사용자: users 컬렉션에 주문 내역 추가
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    orders: arrayUnion(orderData),
                });
                console.log('주문 내역이 사용자 정보에 저장되었습니다.');
            } else {
                // 비회원: orders 컬렉션에 별도 저장
                await addDoc(collection(db, 'orders'), orderData);
                console.log('비회원 주문 내역이 저장되었습니다.');
            }

            // 주문 완료 데이터 저장
            setCompletedOrderData(orderData);
            setIsOrderComplete(true);

            // 주문 완료 후 장바구니 비우기
            if (cartOrderData) {
                localStorage.setItem('cartIds', JSON.stringify([]));
            }

            // 자동 리다이렉트 제거 - 사용자가 직접 페이지를 떠날 수 있도록 함
        } catch (error) {
            console.error('주문 저장 실패:', error);
            alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="order-container">
            <div className="main-title">
                <Title title="Order" />
            </div>
            <OrderProgress isOrderComplete={isOrderComplete} />

            {!isOrderComplete ? (
                <div className="order-content">
                    <div className="order-left">
                        <OrderForm ref={orderFormRef} />
                    </div>

                    <div className="order-right">
                        <OrderSummary
                            products={products}
                            subtotal={calculateSubtotal()}
                            shipping={calculateShipping()}
                            total={calculateTotal()}
                            freeShippingThreshold={shippingInfo.freeShippingThreshold}
                            isOrderComplete={isOrderComplete}
                            onOrderComplete={handleOrderComplete}
                            onRemoveProduct={handleRemoveProduct}
                            onIncreaseQuantity={handleIncreaseQuantity}
                            onDecreaseQuantity={handleDecreaseQuantity}
                        />
                    </div>
                </div>
            ) : (
                <div className="order-complete-wrapper">
                    <div className="order-complete-message">
                        <div className="success-icon">✓</div>
                        <h3 className="success-title">주문이 완료되었습니다!</h3>

                        {completedOrderData && (
                            <div className="order-info-box">
                                <div className="order-info-row">
                                    <span className="info-label">주문번호</span>
                                    <span className="info-value">{completedOrderData.orderId}</span>
                                </div>
                                <div className="order-info-row">
                                    <span className="info-label">주문자</span>
                                    <span className="info-value">
                                        {completedOrderData.userName}
                                    </span>
                                </div>
                                <div className="order-info-row">
                                    <span className="info-label">주문일시</span>
                                    <span className="info-value">
                                        {formatDate(completedOrderData.orderDate)}
                                    </span>
                                </div>
                                <div className="order-info-row">
                                    <span className="info-label">결제금액</span>
                                    <span className="info-value total">
                                        {formatPrice(completedOrderData.total)}원
                                    </span>
                                </div>
                            </div>
                        )}

                        <p className="success-message">
                            빠른 시일 내에 배송해드리겠습니다.
                            <br />
                            감사합니다.
                        </p>

                        <div className="action-buttons">
                            {user ? (
                                <button
                                    className="btn-goto-mypage"
                                    onClick={() => navigate('/userinfo')}
                                >
                                    마이페이지로 이동
                                </button>
                            ) : (
                                <button className="btn-goto-home" onClick={() => navigate('/')}>
                                    메인으로 이동
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// 색상 파싱
function parseColor(colorArray) {
    if (!colorArray || colorArray.length === 0) return '기본색상';

    const firstColor = String(colorArray[0]);

    if (firstColor.toLowerCase().includes('rgb')) {
        if (firstColor.includes('0, 0, 0')) return '블랙';
        if (firstColor.includes('249, 249, 249')) return '화이트';
        if (firstColor.includes('150, 105, 74')) return '브라운';
        return '컬러';
    }

    return firstColor;
}

export default Order;
