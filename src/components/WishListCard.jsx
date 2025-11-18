'use no memo';

import React from 'react';
import { wishListStore } from '../store/wishListStore';
import './scss/wishlistcard.scss';

const WishListCard = () => {
    const { wishLists, onRemoveWish } = wishListStore();
    return (
        <ul className="wish_card_wrap">
            {wishLists.map((item) => (
                <li key={item.id}>
                    <div className="wish_card">
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
                    </div>
                    {/* <button>장바구니 추가</button>
                    <button onClick={() => onRemoveWish(item)}>삭제</button> */}
                </li>
            ))}
        </ul>
    );
};

export default WishListCard;
