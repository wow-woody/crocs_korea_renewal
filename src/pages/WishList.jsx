'use no memo';

import React, { useState } from 'react';
import { wishListStore } from '../store/wishListStore';
import WishListCard from '../components/WishListCard';
import Title from '../components/Title';

const WishList = () => {
    const { wishLists, onRemoveWish } = wishListStore();

    return (
        <div className="sub_page">
            <div className="inner">
                <Title title="WishList" />
                위시리스트 목록 테스트여용
                <WishListCard />
            </div>
        </div>
    );
};

export default WishList;
