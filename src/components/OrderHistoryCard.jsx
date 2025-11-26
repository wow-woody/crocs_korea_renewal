import React from 'react';
import './scss/orderhistory.scss';

const OrderHistoryCard = () => {
    return (
        <div className="order_list_card">
            {/* map 돌릴 것 */}
            <div className="order_list_top">
                <div className="order_list_top_left">
                    <p>2025-11-18</p>
                    <p>(20251118-0000302)</p>
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
                <div className="order_list_pricebox">
                    <p>주문상태</p>
                    <p>
                        상품구매금액 35,000 + 배송비 3,000 - 총 할인금액 5,250 = 총 결제금액 32,750
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryCard;
