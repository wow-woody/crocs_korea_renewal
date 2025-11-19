import React from 'react';
import ProductCard from './ProductCard';
import './scss/WomenComponents.scss';

export default function WomenProductList({ products = [] }) {
    return (
        <section className="product-card__section_wrap">
            <div className="product-card__wrap">
                <ul className="product-card__item_list">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </ul>
            </div>
        </section>
    );
}
