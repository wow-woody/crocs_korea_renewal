import React from 'react';
import WomenBreadcrumbs from './WomenBreadcrumbs';
import WomenSizeMenu from './WomenSizeMenu';
import WomenFilterMenu from './WomenFilterMenu';
import WomenColorMenu from './WomenColorMenu';
import WomenPriceMenu from './WomenPriceMenu';
import './scss/WomenLeftNavigation.scss';

export default function WomenLeftNavigation({ 
    category = '여성',
    subcategory = '털안감 라인드 클로그',
    sizes = [],
    filters = [],
    priceRanges = []
}) {
    return (
        <section className="left_nav__section_wrap">
            <WomenBreadcrumbs category={category} subcategory={subcategory} />
            <nav className="left_nav">
                <WomenSizeMenu sizes={sizes} />
                <div className="breadcrumbs__line"></div>
                <WomenFilterMenu filters={filters} />
                <div className="breadcrumbs__line"></div>
                <WomenColorMenu />
                <div className="breadcrumbs__line"></div>
                <WomenPriceMenu priceRanges={priceRanges} />
            </nav>
        </section>
    );
}
