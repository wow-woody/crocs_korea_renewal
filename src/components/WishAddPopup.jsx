import React from 'react';
import { wishListStore } from '../store/wishListStore';

const WishAddPopup = () => {
    const { popUp, hidePopup } = wishListStore();

    if (!popUp.show) return null;

    return (
        <div className="wish_popup_wrap">
            <div className="popup">{popUp.message}</div>
            <button onClick={hidePopup}>쇼핑 계속하기</button>
            <button>위시리스트 이동</button>
        </div>
    );
};

export default WishAddPopup;
