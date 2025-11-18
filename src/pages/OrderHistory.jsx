import React from 'react';
import OrderHistoryCard from '../components/OrderHistoryCard';
import Title from '../components/Title';
import UserInfoTop from '../components/UserInfoTop';

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
                <div className="order-history-top">주문배송조회</div>
                <OrderHistoryCard />
            </div>
        </div>
    );
};

export default OrderHistory;
