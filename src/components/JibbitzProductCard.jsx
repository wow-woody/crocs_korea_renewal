import React from 'react';
import { collaboAuthStore } from '../store/authStore';

const JibbitzProductCard = ({ sendItem }) => {
    return (
        <div className="product_card">
            <div className="img-box">
                <img src={sendItem.imageUrl} alt={sendItem.title} />
            </div>
            <div className="text-box">
                <div className="text-title">
                    <p>{sendItem.title}</p>
                </div>
                <div className="text-price">{sendItem.price}</div>
            </div>
        </div>
    );
};

export default JibbitzProductCard;
