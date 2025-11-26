<<<<<<< HEAD
<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useCrocsProductStore } from '../store/useCrocsProductStore';
import LeftNavigation from '../components/LeftNavigation';
import ProductCard from '../components/ProductCard';
import './scss/productListpage.scss';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { menuList } from '../store/menuList';
import Title from '../components/Title';
import { useCrocsSizeStore } from '../store/useCrocsSizeStore';

const ProductListPage = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');

    // --- size store: sizes by category + onFetchSize ---
    const { crocsSizesByCategory, onFetchSize } = useCrocsSizeStore();

    // --- product store ---
    const { onFetchItems, filterByMenu, searchWord, setSearchWord } = useCrocsProductStore();

    const navigate = useNavigate();
    const { cate, subcategory } = useParams();

    const [selectedSize, setSelectedSize] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedColors, setSelectedColors] = useState([]);

    // 최초 데이터 로드
    useEffect(() => {
        onFetchItems();
        onFetchSize(); // 반드시 사이즈 데이터도 로드
    }, [onFetchItems, onFetchSize]);

    // URL 검색어 -> store
    useEffect(() => {
        if (searchQuery) setSearchWord(searchQuery);
    }, [searchQuery, setSearchWord]);

    // 카테고리/서브/검색 바뀌면 페이지 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [cate, subcategory, searchWord]);

    // -------------------------
    // 1) 카테고리 + 서브카테고리 필터링
    // -------------------------
    let filteredItems = filterByMenu(cate, subcategory);

    // -------------------------
    // 2) 검색어 필터
    // -------------------------
    if (searchWord) {
        const lower = searchWord.toLowerCase();
        filteredItems = filteredItems.filter(
            (item) =>
                item.product.toLowerCase().includes(lower) ||
                item.tags?.some((tag) => tag.toLowerCase().includes(lower))
        );
    }

    // -------------------------
    // cate 문자열 -> 'men' | 'women' | 'kids' 로 매핑
    // -------------------------
    const normalizeCate = (cateString) => {
        if (!cateString) return null;
        const lower = cateString.toLowerCase();

        // 특정 키워드 우선 체크
        if (lower.includes('kid') || lower.includes('토들러') || lower.includes('kids'))
            return 'kids';
        if (lower.includes('women') || lower.includes('woman') || lower.includes('여'))
            return 'women';
        if (lower.includes('men') || lower.includes('man') || lower.includes('남')) return 'men';
        if (lower.includes('unisex')) return 'women'; // 정책: unisex -> women (필요시 변경)

        // fallback: try to guess from words
        if (lower.includes('키즈')) return 'kids';
        return null;
    };

    // -------------------------
    // 3) 자동으로 sizes 필드 부여 (항상 수행) — 반드시 사이즈 필터 전에 수행
    // -------------------------
    const itemsWithAutoSize = filteredItems.map((item) => {
        const cateKey = normalizeCate(item.cate);
        const autoSizes = cateKey ? crocsSizesByCategory?.[cateKey] || [] : [];
        return { ...item, sizes: autoSizes };
    });

    // 교체
    filteredItems = itemsWithAutoSize;

    // -------------------------
    // 4) 전역 사이즈 필터 (카테고리/검색 결과 상관없이 적용)
    // selectedSize는 SizeMenu에서 전달된 값 (string or number)
    // 비교는 Number로 통일
    // -------------------------
    if (selectedSize !== null && selectedSize !== undefined) {
        const sizeNum = Number(selectedSize);
        if (!isNaN(sizeNum)) {
            filteredItems = filteredItems.filter(
                (item) => Array.isArray(item.sizes) && item.sizes.includes(sizeNum)
            );
        } else {
            // 만약 selectedSize가 숫자로 변환 불가하면 아무것도 필터하지 않음
        }
    }

    // -------------------------
    // 🔥 5) 컬러 필터 적용
    // selectedColors 에 포함된 컬러가 하나라도 있으면 통과
    // -------------------------
    if (selectedColors.length > 0) {
        filteredItems = filteredItems.filter((item) =>
            selectedColors.some((color) => item.color?.toLowerCase().includes(color.toLowerCase()))
        );
    }

    // -------------------------
    // 페이징
    // -------------------------
    const itemsPerPage = 12;
    const totalPage = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
    const start = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(start, start + itemsPerPage);

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

    // 현재 메뉴 / 서브카테고리 계산 (UI용)
    const currentMenu = menuList.find((m) => m.key === cate);
    const subCategoryList = [
        ...new Set(
            filteredItems.flatMap(
                (item) => item.subcategory?.split(',')?.map((sc) => sc.trim().toLowerCase()) || []
            )
        ),
    ];

    const mainItem = filteredItems.find((item) => item.cate?.toLowerCase() === cate?.toLowerCase());
    const mainCategory = mainItem ? mainItem.cate : cate;
    const mainSubcategory = subcategory || (mainItem?.subcategory?.split(',')[0] ?? null);

    return (
        <div className="sub_page">
            <div className="inner">
                <Title title={cate?.toUpperCase()} />
                <div className="product_list_wrap">
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
                                    navigate(cate ? `/${cate}` : '/');
                                }}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {currentMenu?.submenu_list?.length > 0 && !searchWord && (
                        <div className="sub_menu_wrap">
                            {currentMenu.submenu_list.map((sub) => (
                                <div
                                    key={sub.key}
                                    className={`btn_menu_item ${
                                        subcategory === sub.key ? 'active' : ''
                                    }`}
                                    onClick={() => navigate(`/${cate}/${sub.key}`)}
                                >
                                    <button className="sub_menu_btn">{sub.label}</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="product_list_wrap">
                        <div className="list_left">
                            <LeftNavigation
                                category={mainCategory}
                                subcategory={mainSubcategory}
                                subCategoryList={subCategoryList}
                                selectedSize={selectedSize}
                                onSizeSelect={setSelectedSize}
                                selectedColors={selectedColors}
                                onColorSelect={setSelectedColors}
                            />
                        </div>

                        <div className="list_right">
                            {currentItems.length > 0 ? (
                                <ul className="product-card__item_list">
                                    {currentItems.map((p) => (
                                        <ProductCard
                                            key={p.id}
                                            product={p}
                                            onClick={() => navigate(`/product/${p.id}`)}
                                            image={p.product_img?.[0] || '/images/default.png'}
                                            onSizeSelect={setSelectedSize}
                                        />
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

export default ProductListPage;
=======
=======
>>>>>>> 138ae27786ad15781f30dd6515dbd1fddf69a230
import React from 'react';
import ProductImage from '../components/ProductImage';
import ProductInfo from '../components/ProductInfo';
import '../components/scss/ProductDetail.scss';

const ProductDetail = () => {
    return (
        <main className="product-detail-page">
            <section className="product-img-info__wrap">
                <ProductImage />
                <ProductInfo />
            </section>
        </main>
    );
};

export default ProductDetail;
<<<<<<< HEAD
>>>>>>> 664d07f (2025-11-21(금) 워크트리 정우 - 머지 - v03)
=======
>>>>>>> 138ae27786ad15781f30dd6515dbd1fddf69a230
