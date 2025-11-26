import React, { useEffect, useState } from 'react';
import { collaboAuthStore } from '../store/collaboAuthStore';
import { useRecentProductsStore } from '../store/recentProductsStore';
import Breadcrumbs from '../components/Breadcrumbs';
import './scss/productListpage.scss';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Title from '../components/Title';
import { useCrocsProductStore } from '../store/useCrocsProductStore';
import { menuList } from '../store/menuList';

const JibbitzProductListPage = () => {
    // URL 파라미터 & 검색
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const { cate, subcategory, filter } = useParams();
    const navigate = useNavigate();

    // Store
    const {
        jibbitzItems,
        jibbitzFilterList,
        onFetchJibbitz,
        disneyItems,
        selectFilter,
        filteredList,
        onFilterBtn,
    } = collaboAuthStore();

    const { addProduct } = useRecentProductsStore();
    const { filterByMenu, searchWord, setSearchWord } = useCrocsProductStore();

    // 페이징 상태
    const [currentPage, setCurrentPage] = useState(1);

    // 상품 불러오기
    useEffect(() => {
        onFetchJibbitz();
    }, []);

    // URL → 검색 store 반영
    useEffect(() => {
        if (searchQuery) setSearchWord(searchQuery);
    }, [searchQuery, setSearchWord]);

    // 카테고리, 검색이 바뀌면 페이지 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [cate, subcategory, searchWord, selectFilter]);

    // 1) 카테고리 필터
    let filteredItems = filterByMenu(cate, subcategory);

    // 2) 검색 필터
    if (searchWord) {
        const lower = searchWord.toLowerCase();
        filteredItems = filteredItems.filter(
            (item) =>
                item.product?.toLowerCase().includes(lower) ||
                item.tags?.some((tag) => tag.toLowerCase().includes(lower))
        );
    }

    // 3) 지비츠 전용 필터 (전체 / 싱글 / 팩 / 콜라보)
    const displayList = () => {
        if (selectFilter === '') return jibbitzItems;
        if (selectFilter === '싱글' || selectFilter === '팩') return filteredList;
        if (selectFilter === '콜라보') return disneyItems;
        return jibbitzItems;
    };

    const list = displayList();

    // 4) 페이징 처리
    const itemsPerPage = 12;
    const totalPage = Math.max(1, Math.ceil(list.length / itemsPerPage));
    const start = (currentPage - 1) * itemsPerPage;
    const currentItems = list.slice(start, start + itemsPerPage);

    const handleGoPage = (pageNum) => {
        if (pageNum < 1 || pageNum > totalPage) return;
        setCurrentPage(pageNum);
    };

    const pageGroupSize = 5;
    const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
    const groupStart = currentGroup * pageGroupSize + 1;
    const groupEnd = Math.min(groupStart + pageGroupSize - 1, totalPage);

    const pagerButton = [];
    for (let i = groupStart; i <= groupEnd; i++) {
        pagerButton.push(
            <button
                key={i}
                className={currentPage === i ? 'active' : ''}
                onClick={() => handleGoPage(i)}
            >
                {i}
            </button>
        );
    }

    // 상품 클릭 핸들러
    const handleProductClick = (product) => {
        // 최근 본 상품에 추가
        addProduct({
            id: product.id,
            name: product.title,
            image: product.imageUrl,
            price: product.price,
            discountPrice: product.discountPrice || '',
            originPrice: product.originPrice || '',
            discount: product.discount || 0,
            category: 'jibbitz',
        });

        // 상세 페이지로 이동
        navigate(`/jibbitz/${product.id}`);
    };

    // UI 카테고리 설정
    const JibbitzLeftNavigation = {
        category: '지비츠',
        subcategory: '콜라보',
        filters: [],
    };

    return (
        <div className="sub_page">
            <div className="inner">
                <div className="product_list_page">
                    <Title title={'Jibbitz'} />

                    {/* 검색결과 */}
                    {searchWord && (
                        <div className="search_info_wrap">
                            <div className="search_info">
                                {`" ${searchWord} " 검색 결과 : `}
                                <p>
                                    <strong>{list.length}</strong>개
                                </p>
                            </div>
                            <button
                                className="clear_search_info_btn"
                                onClick={() => {
                                    setSearchWord('');
                                    navigate(`/${cate}`);
                                }}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* 서브 메뉴 */}
                    <div className="sub_menu_wrap">
                        <div className="btn_menu_item">
                            <button
                                className={`sub_menu_btn ${selectFilter === '' ? 'active' : ''}`}
                                onClick={() => onFilterBtn('')}
                            >
                                All
                            </button>
                        </div>

                        <div className="btn_menu_item">
                            <button
                                className={`sub_menu_btn ${
                                    selectFilter === '싱글' ? 'active' : ''
                                }`}
                                onClick={() => onFilterBtn('싱글')}
                            >
                                Single
                            </button>
                        </div>

                        <div className="btn_menu_item">
                            <button
                                className={`sub_menu_btn ${selectFilter === '팩' ? 'active' : ''}`}
                                onClick={() => onFilterBtn('팩')}
                            >
                                Pack
                            </button>
                        </div>

                        <div className="btn_menu_item">
                            <button
                                className={`sub_menu_btn ${
                                    selectFilter === '콜라보' ? 'active' : ''
                                }`}
                                onClick={() => onFilterBtn('콜라보')}
                            >
                                콜라보
                            </button>
                        </div>
                    </div>

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
                                                <h3 className="filter-menu__wrap--title title">
                                                    필터
                                                </h3>
                                            </div>
                                            <div className="filter_list_menu">
                                                {selectFilter && (
                                                    <button className="filter_menu_btn">
                                                        {selectFilter}
                                                        <img
                                                            src="/images/Sub_Women_Images/icon-close_cross.svg"
                                                            alt="필터 닫기 버튼"
                                                            className="close-btn"
                                                            onClick={() => onFilterBtn('')}
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="breadcrumbs__line"></div>
                                    <div className="filter-menu__wrap--title_wrap title--wrap">
                                        <h3 className="filter-menu__wrap--title title">메뉴</h3>
                                    </div>
                                    <ul className="jibbitz-menu__wrap">
                                        {jibbitzFilterList.map((filter, id) => (
                                            <li
                                                key={id}
                                                className="jibbitz-menu__item jibbitz_list_menu"
                                            >
                                                <button onClick={() => onFilterBtn(filter)}>
                                                    {filter} 지비츠 참
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </div>

                        {/* 우측 리스트 */}
                        <div className="list_right">
                            <div className="product_list_card_wrap">
                                {currentItems.length > 0 ? (
                                    <ul className="product_list_card_list">
                                        {currentItems.map((product) => (
                                            <li
                                                key={product.id}
                                                className="product_list_card"
                                                onClick={() => handleProductClick(product)}
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
                                                    <span className="product_list_card_price">
                                                        {product.price}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="empty_state">
                                        <p>
                                            {searchWord
                                                ? `"${searchWord}"에 대한 검색 결과가 없습니다.`
                                                : '해당 조건에 맞는 상품이 없습니다.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 페이징 버튼 */}
                    {totalPage > 1 && (
                        <div className="pager">
                            <button onClick={() => handleGoPage(currentPage - 1)}>이전</button>
                            {pagerButton}
                            <button onClick={() => handleGoPage(currentPage + 1)}>다음</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JibbitzProductListPage;