import React, { useEffect, useState } from 'react';
import { collaboAuthStore } from '../store/collaboAuthStore';
import Breadcrumbs from '../components/Breadcrumbs';
import './scss/JibbitzProductListPage.scss';
import { useNavigate } from 'react-router-dom';
import { useRecentProductsStore } from '../store/recentProductsStore'; // 추가!

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
    const { addProduct } = useRecentProductsStore(); // 추가!

    // 상품 불러오기
    useEffect(() => {
        onFetchJibbitz();
    }, []);

    // 상품 클릭 시 최근 본 상품에 추가
    const onOpenProductDetail = (product) => {
        console.log('확인1', product.id);
        
        // 최근 본 상품에 추가
        addProduct({
            id: product.id,
            name: product.title,
            image: product.imageUrl,
            price: product.price,
            discountPrice: product.discountPrice || "",
            originPrice: product.originPrice || "",
            discount: product.discount || ""
        });
        
        navigate(`/jibbitz/${product.id}`);
    };

    const JibbitzLeftNavigation = {
        category: '지비츠',
        subcategory: '콜라보',
        filters: [],
    };

    // 필터 선택 여부에 따라 표시할 리스트
    const displayList = () => {
        if (selectFilter === '') {
            return jibbitzItems;
        }
        if (selectFilter === '싱글' || selectFilter === '팩') {
            return filteredList;
        }
        if (selectFilter === '콜라보') {
            return disneyItems;
        }
        return jibbitzItems;
    };

    // 페이징 처리
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const list = displayList();
    const totalPage = Math.ceil(list.length / itemsPerPage); // 수정!
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
                    <Breadcrumbs
                        category={JibbitzLeftNavigation.category}
                        subcategory={JibbitzLeftNavigation.subcategory}
                    />
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
                                key={product.id} // key를 li로 이동!
                                className="product_list_card"
                                onClick={() => onOpenProductDetail(product)}
                            >
                                <div className="product_list_card_imgbox">
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