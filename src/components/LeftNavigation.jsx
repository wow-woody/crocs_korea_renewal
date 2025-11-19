<<<<<<< HEAD
import React, { useEffect } from 'react';
=======
import React from 'react';
>>>>>>> a61aa1d (2025-11-19(수) 여성 페이지 파일명 변경 및 scss 파일 한개의 파일로 통합 -  v01)
import Breadcrumbs from './Breadcrumbs';
import SizeMenu from './SizeMenu';
import FilterMenu from './FilterMenu';
import ColorMenu from './ColorMenu';
import PriceMenu from './PriceMenu';
<<<<<<< HEAD
import './scss/leftNavigation.scss';
import { useCrocsSizeStore } from '../store/useCrocsSizeStore';
import { useParams } from 'react-router-dom';

export default function LeftNavigation({
    category,
    subcategory,
    selectedSize,
    onSizeSelect,
    filters = [],
    priceRanges = [],
    colors = [],
    selectedColors = [],
    onColorSelect,
}) {
    const { crocsSizes, onFetchSize } = useCrocsSizeStore();
    const params = useParams();

    // ⭐ 최종적으로 사용할 category, subcategory
    const finalCategory = category || params.cate || 'new';
    const finalSubcategory = subcategory || params.subcategory || null;

    useEffect(() => {
        onFetchSize();
    }, []);

    return (
        <div className="left_nav__section_wrap">
            <Breadcrumbs category={finalCategory} subcategory={finalSubcategory} />
            <div className="left_nav">
                <SizeMenu
                    sizes={crocsSizes}
                    selectedSize={selectedSize}
                    onSizeSelect={onSizeSelect}
                />
                <div className="breadcrumbs__line" />
                <FilterMenu filters={filters} />
                <div className="breadcrumbs__line" />
                <ColorMenu selectedColors={selectedColors} onColorSelect={onColorSelect} />
                <div className="breadcrumbs__line" />
                <PriceMenu priceRanges={priceRanges} />
            </div>
        </div>
=======
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
>>>>>>> a61aa1d (2025-11-19(수) 여성 페이지 파일명 변경 및 scss 파일 한개의 파일로 통합 -  v01)
    );
}
