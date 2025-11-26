import React, { useEffect, useState } from 'react';
import { collaboAuthStore } from '../store/collaboAuthStore';
import Breadcrumbs from '../components/Breadcrumbs';
import './scss/productListpage.scss';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Title from '../components/Title';
import { useCrocsProductStore } from '../store/useCrocsProductStore';
import { menuList } from '../store/menuList';

const JibbitzProductListPage = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');

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
    const { cate, subcategory } = useParams();
    const { filter } = useParams();

    // Crocs store
    const { filterByMenu, searchWord, setSearchWord } = useCrocsProductStore();

    // ⭐ 페이징 상태
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

    // -----------------------------------
    // 1) 카테고리 필터
    // -----------------------------------
    let filteredItems = filterByMenu(cate, subcategory);

    // -----------------------------------
    // 2) 검색 필터
    // -----------------------------------
    if (searchWord) {
        const lower = searchWord.toLowerCase();
        filteredItems = filteredItems.filter(
            (item) =>
                item.product.toLowerCase().includes(lower) ||
                item.tags?.some((tag) => tag.toLowerCase().includes(lower))
        );
    }

    // -----------------------------------
    // 3) 지비츠 전용 필터 (전체 / 싱글 / 팩 / 콜라보)
    // -----------------------------------
    const displayList = () => {
        if (selectFilter === '') {
            filteredItems = jibbitzItems;
        }
        if (selectFilter === '싱글' || selectFilter === '팩') return filteredList;
        if (selectFilter === '콜라보') return disneyItems;
        return filteredItems;
    };

    const list = displayList();

    // -----------------------------------
    // 4) 페이징 처리
    // -----------------------------------
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

    // -----------------------------------
    // UI 카테고리 설정
    // -----------------------------------
    const currentMenu = menuList.find((m) => m.key === cate);

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
                                    <strong>{filteredItems.length}</strong>개
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
                            <Breadcrumbs
                                category={JibbitzLeftNavigation.category}
                                subcategory={JibbitzLeftNavigation.subcategory}
                            />
                        </div>

                        {/* 우측 리스트 */}
                        <div className="list_right">
                            {currentItems.length > 0 ? (
                                <ul className="product-card__item_list">
                                    {currentItems.map((product) => (
                                        <li
                                            className="product-card"
                                            onClick={() => navigate(`/jibbitz/${product.id}`)}
                                        >
                                            <div
                                                className="product-card__img_wrap"
                                                key={product.id}
                                            >
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.title}
                                                    className="product-card__img"
                                                />
                                            </div>

                                            <div className="product-card_name_wrap">
                                                <p>{product.title}</p>
                                            </div>

                                            <div className="product-card_price_wrap">
                                                <span className="orginal-price">
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
                {/* 페이징 */}
                {totalPage > 1 && (
                    <div className="page_pager">
                        <button onClick={() => handleGoPage(currentPage - 1)}>이전</button>
                        {pagerButton}
                        <button onClick={() => handleGoPage(currentPage + 1)}>다음</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JibbitzProductListPage;
