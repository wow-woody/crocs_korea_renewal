import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import SizeMenu from './SizeMenu';
import FilterMenu from './FilterMenu';
import ColorMenu from './ColorMenu';
import PriceMenu from './PriceMenu';
import './scss/WomenComponents.scss';

export default function WomenLeftNavigation({ 
    category = '여성',
    subcategory = '털안감 라인드 클로그',
    sizes = [],
    filters = [],
    priceRanges = []
}) {
    return (
        <section className="left_nav__section_wrap">
            <Breadcrumbs category={category} subcategory={subcategory} />
            <nav className="left_nav">
                <SizeMenu sizes={sizes} />
                <div className="breadcrumbs__line"></div>
                <FilterMenu filters={filters} />
                <div className="breadcrumbs__line"></div>
                <ColorMenu />
                <div className="breadcrumbs__line"></div>
                <PriceMenu priceRanges={priceRanges} />
            </nav>
        </section>
    );
}
