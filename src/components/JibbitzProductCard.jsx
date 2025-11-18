import React, { use, useEffect } from 'react';
import { collaboAuthStore } from '../store/authStore';
import { CursorEffect } from './CursorEffect';
import './CursorEffect.scss';

const JibbitzProductCard = ({ sendItem }) => {
    useEffect(() => {
        const cleanup = CursorEffect();
        return () => {
            if (cleanup) cleanup();
        };
    })
    return (
        <div className="product_card">
            <div className="img-box">
                <img src={sendItem.imageUrl} alt={sendItem.title} className="imgSize" />
            </div>
            <div className="text-box">
                <div className="text-title">
                    <p>{sendItem.title}</p>
                    <p>5 Pack Jibbitz</p>
                </div>
                <div className="text-price">
                    <p>{sendItem.price}</p>
                </div>
            </div>
            <div className="text-badge">
                <span>Collabs</span>
                <span>ZIBBITZ</span>
            </div>
        </div>
    );
};

export default JibbitzProductCard;
