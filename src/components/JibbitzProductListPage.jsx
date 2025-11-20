import React, { useState } from 'react';
import { collaboAuthStore } from '../store/collaboAuthStore';
import Breadcrumbs from './Breadcrumbs';
import FilterMenu from './FilterMenu';
import './scss/WomenComponents.scss';
import { useNavigate } from 'react-router-dom';

const JibbitzProductListPage = () => {
    const { jibbitzItems } = collaboAuthStore();
    const navigate = useNavigate();

    const onOpenProductDetail = (product) => {
        console.log('확인1', product.id);
        navigate(`/jibbitz/${product.id}`);
        // e.preventDefault();
    };

    const JibbitzLeftNavigation = {
        category: '지비츠',
        subcategory: '콜라보',
        filters: [],
    };

    // 페이징 처리
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPage = Math.ceil(jibbitzItems.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const currentItems = jibbitzItems.slice(start, start + itemsPerPage);

    const handleGoPage = (pageNum) => {
        if (pageNum < 1 || pageNum > totalPage) return;
        setCurrentPage(pageNum);
    };

    return (
        <div className="product_list_wrap">
            <div className="list_left">
                <div className="left_nav_section_wrap">
                    <Breadcrumbs
                        category={JibbitzLeftNavigation.category}
                        subcategory={JibbitzLeftNavigation.subcategory}
                    />
                    <nav className="left_nav">
                        <FilterMenu filters={JibbitzLeftNavigation.filters} />
                    </nav>
                </div>
            </div>
            <div className="list_right">
                <div className="product-card__section_wrap">
                    <ul className="product-card__item_list">
                        {currentItems.map((product) => (
                            <li
                                className="product-card"
                                onClick={() => onOpenProductDetail(product)}
                            >
                                <div className="product_card_imgbox" key={product.id}>
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="product-card__img"
                                    />
                                </div>
                                <div className="product-card__name--wrap">
                                    <p>{product.title}</p>
                                </div>
                                <div className="product-card__price_wrap">
                                    <span className="product-card__price">{product.price}</span>
                                </div>
                            </li>
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

export default JibbitzProductListPage;
