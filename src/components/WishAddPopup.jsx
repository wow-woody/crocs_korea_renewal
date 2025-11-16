import React from 'react';
import { wishListStore } from '../store/wishListStore';
import { Link } from 'react-router-dom';

const WishAddPopup = () => {
    const { popUp, hidePopup } = wishListStore();

    if (!popUp.show) return null;

    return (
        <div className="wish_popup_wrap">
            <div className="popup">{popUp.message}</div>
            <button onClick={hidePopup}>쇼핑 계속하기</button>
            <Link to="/wishlist">위시리스트 이동</Link>
        </div>
    );
};

export default WishAddPopup;
