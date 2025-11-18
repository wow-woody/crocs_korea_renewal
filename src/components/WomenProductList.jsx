import React from 'react';
import WomenProductCard from './WomenProductCard';
import './scss/WomenProductList.scss';

export default function WomenProductList({ products = [] }) {
    return (
        <section className="product-card__section_wrap">
            <div className="product-card__wrap">
                <ul className="product-card__item_list">
                    {products.map((product) => (
                        <WomenProductCard key={product.id} product={product} />
                    ))}
                </ul>
            </div>
        </section>
    );
}
