import React from 'react';
import Title from '../components/Title';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';

const Cart = () => {
    const { cartItems, onRemoveCart, onPlusCount, onMinusCount, totalPrice, onAddWishList } = useProductStore();
    return (
        <div className="sub_page">
            <div className="inner">
                <Title title="cart" />
                <div className="cart-wrap">
                    <div className="cart-title">
                        <div className="cart-top">
                            <div className="checked">
                                <Title subTitle={`장바구니`} />
                                <span>총 n개의 상품</span>
                                <div className="select_remove"></div>
                                <button>장바구니 비우기</button>
                            </div>
                        </div>
                        <div className="cart-list-wrap">
                            <ul className="cart-list">
                                {cartItems.map((item) => (
                                    <li>
                                        <div className="cart-left">
                                            <img src={item.image} alt={item.title} />
                                            <div className="cart-info">
                                                <p className="cart-title">{item.title}</p>
                                                {/* 컬러생략가능 */}
                                                <p className="cart-item-color">컬러: {item.color}</p>
                                                <p className="cart-item-price">가격: {item.price}</p>
                                                <div className="cart-item-count"><input type="button" value="" /></div>
                                            </div>
                                            <button>X</button>
                                        </div>
                                        <div className="cart-right">
                                            <p>총 상품금액 : {item.price * item.count}</p>
                                            <p>배송비 : {3000}</p>
                                            <div className="cart-order">
                                                <Link to={`/payment`}>전체상품주문</Link>
                                                <Link to={`/payment`}>선택상품주문</Link>
                                                <Link to={`/payment`}>선택상품선물</Link>
                                            </div>
                                            <p> 장바구니 상품은 30일간 보관됩니다. 장기간 보관을 원하실 경우 좋아요 상품에 추가해주세요.</p>
                                            <p>해외배송 가능 상품의 경우 국내배송 장바구니에 담았다가 해외배송 장바구니로 이동하여 결제하실 수 있습니다.</p>
                                            <p>교차 및 복수 할인 프로모션 적용 주문 건의 경우 부분 취소 및 반품은 불가하며, 전체 취소/반품 후 재주문해주셔야합니다.</p>
                                            <div className="cart-count">
                                                {/* 클릭한 id값을 매개값으로 전달 */}
                                                <button
                                                    onClick={() => onMinusCount(item.id, item.color)}>-</button>
                                                <span>{item.count}</span>
                                                <button
                                                    onClick={() => onPlusCount(item.id, item.color)}>+</button>
                                                <button
                                                    onClick={() => onRemoveCart(item.id, item.color)}>삭제</button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Cart;
