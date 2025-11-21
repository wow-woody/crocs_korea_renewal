import React, { useEffect, useState } from 'react';
import { collaboAuthStore } from '../store/collaboAuthStore';
import './scss/JibbitzProductListPage.scss';
import { useNavigate } from 'react-router-dom';

const JibbitzProductListPage = () => {
    const {
        jibbitzItems,
        jibbitzFilterList,
        onFetchJibbitz,
        disneyItems,
        selectFilter,
        filteredList,
        onFilterBtn,
    } = collaboAuthStore();
    const navigate = useNavigate();

    // 상품 불러오기
    useEffect(() => {
        onFetchJibbitz();
    }, []);

    const onOpenProductDetail = (product) => {
        console.log('확인1', product.id);
        navigate(`/jibbitz/${product.id}`);
        // e.preventDefault();
    };

    const JibbitzLeftNavigation = {
        category: '지비츠',
        subcategory: '',
        filters: [],
    };

    // 필터 선택 여부에 따라 표시할 리스트
    const displayList = () => {
        if (selectFilter === '') {
            // 전체 리스트
            return jibbitzItems;
        }
        if (selectFilter === '싱글' || selectFilter === '팩') {
            // 싱글/팩 필터
            return filteredList;
        }
        if (selectFilter === '콜라보') {
            // 콜라보 필터
            return disneyItems;
        }
        return jibbitzItems;
    };

    // 페이징 처리
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const list = displayList(selectFilter);
    const totalPage = Math.ceil(displayList.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const currentItems = list.slice(start, start + itemsPerPage);

    const handleGoPage = (pageNum) => {
        if (pageNum < 1 || pageNum > totalPage) return;
        setCurrentPage(pageNum);
    };

    return (
        <div className="product_list_wrap">
            <div className="list_left">
                <div className="left_nav_wrap">
                    <div className="breadcrumbs--section">
                        <ul className="breadcrumbs__list">
                            <li className="breadcrumbs__list--home">
                                <a href="/" className="breadcrumbs__list--home_link">
                                    <img
                                        src="/images/Sub_Women_Images/icon-home.svg"
                                        alt="홈 버튼"
                                    />
                                </a>
                            </li>
                            <li className="breadcrumbs__list--section">
                                <span>:</span>
                            </li>
                            <li className="breadcrumbs__list--women">
                                <a href="/jibbitz" className="breadcrumbs__list--women_link">
                                    <span>지비츠</span>
                                </a>
                            </li>
                        </ul>
                        <div className="breadcrumbs__title">
                            <h2>지비츠</h2>
                        </div>
                    </div>
                    <nav className="left_nav">
                        <div className="filter-menu">
                            <div className="filter-menu__wrap menu_wrap-style">
                                <div className="filter-menu__wrap--title_wrap title--wrap">
                                    <h3 className="filter-menu__wrap--title title">필터</h3>
                                </div>
                                <div className="filter_list_menu">
                                    <button className="filter_menu_btn">
                                        {selectFilter}
                                        <img
                                            src="/images/Sub_Women_Images/icon-close_cross.svg"
                                            alt="필터 닫기 버튼"
                                            className="close-btn"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="breadcrumbs__line"></div>
                        <div className="filter-menu__wrap--title_wrap title--wrap">
                            <h3 className="filter-menu__wrap--title title">메뉴</h3>
                        </div>
                        <ul className="jibbitz-menu__wrap">
                            {jibbitzFilterList.map((filter, id) => (
                                <li key={id} className="jibbitz-menu__item jibbitz_list_menu">
                                    <button onClick={() => onFilterBtn(filter)}>
                                        {filter} 지비츠 참
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="list_right">
                <div className="product_list_card_wrap">
                    <ul className="product_list_card_list">
                        {currentItems.map((product) => (
                            <li
                                className="product_list_card"
                                onClick={() => onOpenProductDetail(product)}
                            >
                                <div className="product_list_card_imgbox" key={product.id}>
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="product_list_card_img"
                                    />
                                </div>
                                <div className="product_list_card_name_wrap">
                                    <p>{product.title}</p>
                                </div>
                                <div className="product_list_card_price_wrap">
                                    <span className="product_list_card_price">{product.price}</span>
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
