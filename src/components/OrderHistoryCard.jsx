import React from 'react';
import './scss/orderhistory.scss';

const OrderHistoryCard = () => {
    return (
        <div className="order_list_card">
            {/* map 돌릴 것 */}
            <div className="order_list_top">
                <div className="order_list_top_left">
                    <p>주문날짜</p>
                    <p>주문번호</p>
                </div>
                <div className="order_list_top_right">
                    <button>상세보기</button>
                </div>
            </div>
            {/* map 돌릴 것 */}
            <div className="order_list_middle">
                <div className="order_list_imgbox">
                    <img src="/images/Category-list__items_01.png" alt="" />
                </div>
                <div className="order_list_textbox">
                    <p>상품명</p>
                    <p>가격 / 개수</p>
                </div>
            </div>
            <div className="order_list_bottom">
                <div>주문상태 </div>
            </div>
        </div>
    );
};

export default OrderHistoryCard;
