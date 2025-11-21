import React from 'react';

const JibbitzCollaboProductDetailCard = ({ product }) => {
    return (
        <div>
            <p>
                <img src={product.imageUrl} alt={product.title} />
            </p>
            <p>{product.title}</p>
            <p>{product.price}</p>
        </div>
    );
};

export default JibbitzCollaboProductDetailCard;
