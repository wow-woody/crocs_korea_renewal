import React from 'react';
import JibbitzProductCard from './JibbitzProductCard';
import { collaboAuthStore } from '../store/collaboAuthStore';

const JibbitzCollaboSlide = () => {
    const { disneyItems } = collaboAuthStore();
    return (
        <div>
            {disneyItems.map((item) => (
                <JibbitzProductCard sendItem={item} />
            ))}
        </div>
    );
};

export default JibbitzCollaboSlide;
