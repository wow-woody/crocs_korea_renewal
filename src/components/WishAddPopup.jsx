'use no memo';

import React, { useEffect } from 'react';
import { wishListStore } from '../store/wishListStore';
import { Link, useLocation } from 'react-router-dom';
import './scss/wishAddPopup.scss';

const WishAddPopup = () => {
    const { popUp, hidePopup } = wishListStore();
    const location = useLocation();

    useEffect(() => {
        hidePopup();
    }, [location.pathname, hidePopup]);

    if (!popUp.show) return null;

    return (
        <div className="wish_popup_bg">
            <div className="wish_popup_wrap">
                <div className="popup_text">{popUp.message}</div>
                <div className="popup_btn_wrap">
                    <button onClick={hidePopup}>쇼핑 계속하기</button>
                    <Link to="/wishlist">
                        <button>위시리스트 이동</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WishAddPopup;
