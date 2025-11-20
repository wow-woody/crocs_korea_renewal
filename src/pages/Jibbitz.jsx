import React from 'react';
import Title from '../components/Title';
import ProductListPage from './ProductListPage';
import JibbitzProductListPage from '../components/JibbitzProductListPage';
import './scss/productListpage.scss';

const Jibbitz = () => {
    return (
        <div className="sub_page">
            <div className="inner">
                <Title title="jibbitz" />
                <JibbitzProductListPage />
            </div>
        </div>
    );
};

export default Jibbitz;
