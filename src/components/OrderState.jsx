import React from 'react';
import { Link } from 'react-router-dom';
import './scss/orderstate.scss';

const OrderState = () => {
    return (
        <div className="state_wrap">
            <ul className="order_state_left">
                <li>
                    <Link>
                        <span>0</span>
                    </Link>
                    <span>입금대기</span>
                </li>
                <li>
                    <Link>
                        <span>0</span>
                    </Link>
                    <span>상품&배송 준비중</span>
                </li>
                <li>
                    <Link>
                        <span>0</span>
                    </Link>
                    <span>배송중</span>
                </li>
                <li>
                    <Link>
                        <span>0</span>
                    </Link>
                    <span>배송완료</span>
                </li>
            </ul>
            <ul className="order_state_right">
                <li>
                    <strong>
                        취소<span>주문건</span>
                    </strong>
                    <Link>
                        <span>0</span>건
                    </Link>
                </li>
                <li>
                    <strong>
                        교환<span>주문건</span>
                    </strong>
                    <Link>
                        <span>0</span>건
                    </Link>
                </li>
                <li>
                    <strong>
                        반품<span>주문건</span>
                    </strong>
                    <Link>
                        <span>0</span>건
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default OrderState;
