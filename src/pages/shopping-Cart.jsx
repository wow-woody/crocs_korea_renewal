import React from 'react'
import Title from '../components/Title'
import { useProductStore } from '../store/useProductStore'
import "./scss/cart.scss"
import { Link } from 'react-router-dom'

const Cart = () => {
    const { cartItems, onRemoveCart, onPlusCount, onMinusCount, totalPrice, onAddWishList } = useProductStore();
    return (
        <div className="sub-pasge">
            <div className="content-inner">
                <Title />
                <div className="cart-wrap">
                    <div className="cart-title">
                        <div className="cart-left">상품정보</div>
                        <div className="cart-right">
                            <p>주문금액</p>
                            <p>수량</p>
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
                                            <p className="cart-size">사이즈: {item.size}</p>
                                        </div>
                                        <div className="cart-selected">
                                            <button>선택한 상품 삭제</button>
                                        </div>
                                    </div>
                                    <div className="cart-right">
                                        <p>{item.price}</p>
                                        <p>{item.price * item.count}</p>
                                        <div className="cart-count">
                                            {/* 클릭한 id값을 매개값으로 전달 */}
                                            <button
                                                onClick={() => onMinusCount(item.id, item.size)}>-</button>
                                            <span>{item.count}</span>
                                            <button
                                                onClick={() => onPlusCount(item.id, item.size)}>+</button>
                                            <button
                                                onClick={() => onRemoveCart(item.id, item.size)}>삭제</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="cart-bottom">
                        <p>총금액: {totalPrice}</p>
                        <Link to={`/payment`}>모두 구매하기</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart