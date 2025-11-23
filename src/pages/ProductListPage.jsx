import React, { useEffect, useState } from 'react';
import { useCrocsProductStore } from '../store/useCrocsProductStore';
import ProductCard from '../components/ProductCard';
import '../components/scss/WomenComponents.scss';
import FilterMenu from '../components/FilterMenu';
import LeftNavigation from '../components/LeftNavigation';
import './scss/productListpage.scss';

const ProductListPage = ({ cate }) => {
    const { crocsItems, onFetchItems, onItemsCategory, searchWord } = useCrocsProductStore();

    useEffect(() => {
        onFetchItems();
    }, [onFetchItems]);

    // 카테고리 필터
    let categoryItems = onItemsCategory(cate);

    // 검색어 필터
    if (searchWord) {
        const lowerWord = searchWord.toLowerCase();
        categoryItems = categoryItems.filter((item) =>
            item.product.toLowerCase().includes(lowerWord)
        );
    }

    // 페이징 처리
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPage = Math.ceil(categoryItems.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const currentItems = categoryItems.slice(start, start + itemsPerPage);

    const handleGoPage = (pageNum) => {
        if (pageNum < 1 || pageNum > totalPage) return;
        setCurrentPage(pageNum);
    };

    return (
        <div className="product_list_wrap">
            <div className="list_left">
                <LeftNavigation />
            </div>
            <div className="list_right">
                <div className="product-card__section_wrap">
                    <ul className="product-card__item_list">
                        {currentItems.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </ul>

                    {/* 페이징 버튼 */}
                    <div className="pager">
                        <button onClick={() => handleGoPage(currentPage - 1)}>이전</button>
                        <span>
                            {currentPage} / {totalPage}
                        </span>
                        <button onClick={() => handleGoPage(currentPage + 1)}>다음</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
