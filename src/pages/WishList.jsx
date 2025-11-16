import React, { useState } from 'react';
import { wishListStore } from '../store/wishListStore';

const WishList = () => {
    const { wishLists, onAddWishList } = wishListStore();

    return (
        <div className="sub_page">
            <div className="inner">위시리스트 목록 테스트여용</div>
            <ul>
                {wishLists.map((item) => (
                    <li key={item.id}>
                        {item.title} <span>{item.price}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WishList;
