import React from 'react';
import ProductImage from '../components/ProductImage';
import ProductInfo from '../components/ProductInfo';
import '../components/scss/ProductDetail.scss';

const ProductDetail = () => {
    return (
        <main className="product-detail-page">
            <section className="product-img-info__wrap">
                <ProductImage />
                <ProductInfo />
            </section>
        </main>
    );
};

export default ProductDetail;
