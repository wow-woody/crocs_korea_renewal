import React, { useEffect } from 'react';
import Breadcrumbs from './Breadcrumbs';
import SizeMenu from './SizeMenu';
import FilterMenu from './FilterMenu';
import ColorMenu from './ColorMenu';
import PriceMenu from './PriceMenu';
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
    );
}
