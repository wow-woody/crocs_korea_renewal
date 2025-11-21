import React from 'react';
import { Link } from 'react-router-dom';

const GnbRight = ({ onSearchClick, onCartClick }) => {
    return (
        <ul className="gnb_right">
            <li>
                <button onClick={onSearchClick}>
                    <img src="./images/search_icon.svg" alt="search_icon" />
                </button>
            </li>
            <li>
                <Link to="/login">
                    <img src="./images/user_icon.svg" alt="user_icon" />
                </Link>
            </li>
            <li>
                {/* <Link to="/cart">
                    <img src="./images/cart_icon.svg" alt="cart_icon" />
                </Link> */}
                <button onClick={onCartClick}>
                    <img src="./images/cart_icon.svg" alt="cart_icon" />
                </button>
            </li>
        </ul>
    );
};

export default GnbRight;
