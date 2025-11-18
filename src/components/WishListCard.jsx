'use no memo';

import React from 'react';
import { wishListStore } from '../store/wishListStore';
import './scss/wishlistcard.scss';

const WishListCard = () => {
    const { wishLists, onRemoveWish } = wishListStore();
    return (
        <div className="inner_wrap">
            <div className="wish_card_wrap">
                {wishLists.map((item) => (
                    <div key={item.id} className="wish_card">
                        <div className="wish_card_imgbox">
                            <img src={item.imageUrl} alt={item.title} />
                        </div>
                        <div className="wish_card_textbox">
                            <p>{item.title}</p>
                            <div className="wish_card_price">
                                <p>
                                    <span>{item.price}</span>
                                    <span>{item.price}</span>
                                </p>
                                <p className="price_bottom">
                                    {((Number(item.price) / Number(item.price)) * 100).toFixed(0)}%
                                </p>
                            </div>
                        </div>
                        {/* <button>장바구니 추가</button>
                    <button onClick={() => onRemoveWish(item)}>삭제</button> */}
                    </div>
                ))}
                <div className="wish_select">
                    <button className="wish_remove_btn">선택상품 삭제</button>
                    <button className="wish_add_btn">장바구니 추가</button>
                </div>
            </div>
        </div>
    );
};

export default WishListCard;
