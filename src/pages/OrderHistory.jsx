// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import OrderState from '../components/OrderState';
// import { loginAuthStore } from '../store/loginStore';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase/firebase';
// import './scss/orderhistory.scss';
// import OrderHistoryCard from '../components/OrderHistoryCard';

// const OrderHistory = () => {
//     const navigate = useNavigate();
//     const { user } = loginAuthStore();
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchOrders = async () => {
//             if (!user) {
//                 alert('로그인이 필요합니다.');
//                 navigate('/login');
//                 return;
//             }

//             try {
//                 const userRef = doc(db, 'users', user.uid);
//                 const userDoc = await getDoc(userRef);

//                 if (userDoc.exists()) {
//                     const userData = userDoc.data();
//                     // orders 배열을 최신순으로 정렬
//                     const userOrders = userData.orders || [];
//                     const sortedOrders = userOrders.sort((a, b) => {
//                         const dateA = a.orderDate?.toDate
//                             ? a.orderDate.toDate()
//                             : new Date(a.orderDate);
//                         const dateB = b.orderDate?.toDate
//                             ? b.orderDate.toDate()
//                             : new Date(b.orderDate);
//                         return dateB - dateA; // 최신순
//                     });
//                     setOrders(sortedOrders);
//                 }
//             } catch (error) {
//                 console.error('주문 내역 불러오기 실패:', error);
//                 alert('주문 내역을 불러오는 중 오류가 발생했습니다.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, [user, navigate]);

//     // 날짜 포맷팅
//     const formatDate = (date) => {
//         if (!date) return '';
//         const d = date.toDate ? date.toDate() : new Date(date);
//         return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
//             d.getDate()
//         ).padStart(2, '0')}`;
//     };

//     // 금액 포맷팅
//     const formatPrice = (price) => {
//         return price.toLocaleString('ko-KR');
//     };

//     // 주문 상태 한글 변환
//     const getStatusText = (status) => {
//         const statusMap = {
//             pending: '주문접수',
//             processing: '상품준비중',
//             shipped: '배송중',
//             delivered: '배송완료',
//             cancelled: '주문취소',
//         };
//         return statusMap[status] || status;
//     };

//     if (loading) {
//         return (
//             <div className="sub_page">
//                 <div className="inner">
//                     <p>주문 내역을 불러오는 중...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="sub_page">
//             <div className="inner">
//                 {/* <UserInfoTop /> */}
//                 <div className="user_btn_wrap">
//                     <button className="user_home_btn" onClick={() => navigate('/userinfo')}>
//                         <img src="" alt="" />
//                         <span>마이페이지 홈으로 이동하기</span>
//                     </button>
//                     {/* 마이 페이지 탭 버튼
//                 나의 정보 / 주문 정보 / 1:1 문의 /  */}
//                     {/* <button>나의 정보</button>
//                     <button>주문 정보</button>
//                     <button>혜택 정보</button>
//                     <button>1 : 1 문의</button> */}
//                 </div>
//                 <div className="userinfo_current_order_wrap">
//                     <div className="user_menu_top">
//                         {/* 주문 처리 현황 */}
//                         <h4>주문 처리 현황</h4>
//                     </div>
//                     <hr />
//                     <div className="user_menu_bottom">
//                         <OrderState />
//                     </div>
//                 </div>
//                 <div className="order_history_top">
//                     <div className="user_menu_top">
//                         {/* 주문 처리 현황 */}
//                         <h4>주문 내역</h4>
//                     </div>
//                     <hr />
//                 </div>
//                 <OrderHistoryCard />
//             </div>
//         </div>
//     );
// };

// export default OrderHistory;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderState from '../components/OrderState';
import OrderHistoryCard from '../components/OrderHistoryCard';
import { loginAuthStore } from '../store/loginStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import './scss/orderhistory.scss';

const OrderHistory = () => {
    const navigate = useNavigate();
    const { user } = loginAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                alert('로그인이 필요합니다.');
                navigate('/login');
                return;
            }

            try {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log('사용자 데이터:', userData);

                    // orders 배열을 최신순으로 정렬
                    const userOrders = userData.orders || [];
                    console.log('주문 데이터:', userOrders);

                    const sortedOrders = userOrders.sort((a, b) => {
                        const dateA = a.orderDate?.toDate
                            ? a.orderDate.toDate()
                            : new Date(a.orderDate);
                        const dateB = b.orderDate?.toDate
                            ? b.orderDate.toDate()
                            : new Date(b.orderDate);
                        return dateB - dateA; // 최신순
                    });

                    setOrders(sortedOrders);
                    console.log('정렬된 주문:', sortedOrders);
                } else {
                    console.log('사용자 문서가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error('주문 내역 불러오기 실패:', error);
                alert('주문 내역을 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="sub_page">
                <div className="inner">
                    <p>주문 내역을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="sub_page">
            <div className="inner">
                <div className="user_btn_wrap">
                    <button className="user_home_btn" onClick={() => navigate('/userinfo')}>
                        <img src="" alt="" />
                        <span>마이페이지 홈으로 이동하기</span>
                    </button>
                </div>

                <div className="userinfo_current_order_wrap">
                    <div className="user_menu_top">
                        <h4>주문 처리 현황</h4>
                    </div>
                    <hr />
                    <div className="user_menu_bottom">
                        <OrderState orders={orders} />
                    </div>
                </div>

                <div className="order_history_top">
                    <div className="user_menu_top">
                        <h4>주문 내역 ({orders.length})</h4>
                    </div>
                    <hr />
                </div>

                {orders.length === 0 ? (
                    <div className="empty_orders">
                        <p>주문 내역이 없습니다.</p>
                        <button onClick={() => navigate('/all')}>쇼핑하러 가기</button>
                    </div>
                ) : (
                    <div className="order_history_list">
                        {orders.map((order, index) => (
                            <OrderHistoryCard key={order.orderId || index} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
