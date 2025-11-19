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
                <WishListCard />
            </div>
        </div>
    );
};

export default WishList;
