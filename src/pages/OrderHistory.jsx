import React from 'react';
import OrderHistoryCard from '../components/OrderHistoryCard';
import UserInfoTop from '../components/UserInfoTop';
import { Link } from 'react-router-dom';
import OrderState from '../components/OrderState';

const OrderHistory = () => {
    return (
        <div className="sub_page">
            <div className="inner">
                <UserInfoTop />
                <div className="user_btn_wrap">
                    {/* 마이 페이지 탭 버튼
                나의 정보 / 주문 정보 / 1:1 문의 /  */}
                    <button>나의 정보</button>
                    <button>주문 정보</button>
                    <button>혜택 정보</button>
                    <button>1 : 1 문의</button>
                </div>
                <div className="userinfo_current_order_wrap">
                    <div className="user_menu_top">
                        {/* 주문 처리 현황 */}
                        <h4>주문 처리 현황</h4>
                        <Link to="/orderhistory">더보기</Link>
                    </div>
                    <hr />
                    <div className="user_menu_bottom">
                        <OrderState />
                    </div>
                </div>
                <div className="order-history-top">
                    <h2>주문배송조회</h2>
                </div>
                <OrderHistoryCard />
            </div>
        </div>
    );
};

export default OrderHistory;
