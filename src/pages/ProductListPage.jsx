import React, { useEffect, useState } from 'react';
import { useCrocsProductStore } from '../store/useCrocsProductStore';
import LeftNavigation from '../components/LeftNavigation';
import ProductCard from '../components/ProductCard';
import './scss/productListpage.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { menuList } from '../store/menuList';
import Title from '../components/Title';

const ProductListPage = () => {
    const { onFetchItems, filterByMenu, searchWord } = useCrocsProductStore();
    const navigate = useNavigate();
    const { cate, subcategory } = useParams(); // URL에서 cate, subcategory 가져오기
    const [selectedSize, setSelectedSize] = useState(null); // 🔥 선택된 사이즈

    // 최초 로딩
    useEffect(() => {
        onFetchItems();
    }, []);

    // cate, subcategory, searchWord가 바뀔 때 페이지 1로 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [cate, subcategory, searchWord]);

    // --- 카테 + 서브카테 필터링 ---
    let filteredItems = filterByMenu(cate, subcategory);
    console.log(
        '🔹 cate/subcategory 필터 후:',
        filteredItems.map((item) => item.product)
    );
    // --- 검색어 필터 ---
    if (searchWord) {
        const lower = searchWord.toLowerCase();
        filteredItems = filteredItems.filter((item) => item.product.toLowerCase().includes(lower));
    }

    // --- 사이즈 필터링 ---
    if (selectedSize) {
        filteredItems = filteredItems.filter((item) => item.sizes?.includes(selectedSize));
    }
    console.log(
        '🔹 selectedSize 필터 후:',
        filteredItems.map((item) => item.product),
        '선택된 사이즈:',
        selectedSize
    );

    // 페이징 처리
    // 한 페이지에 보여질 개수
    const itemsPerPage = 12;
    // 현재 보여지는 페이지를 체크하고 변경하기
    const [currentPage, setCurrentPage] = useState(1);
    // 전체 페이지 수 계산하기
    const totalPage = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    const start = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(start, start + itemsPerPage);

    // 페이징 버튼 그룹 단위
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

    const handleGoPage = (pageNum) => {
        if (pageNum < 1 || pageNum > totalPage) return;
        console.log(pageNum);
        setCurrentPage(pageNum);
    };

    // 해당 카테고리 메뉴 찾기
    const currentMenu = menuList.find((m) => m.key === cate);

    // --- 서브카테고리 리스트 계산 ---
    const subCategoryList = [
        ...new Set(
            filteredItems.flatMap((item) =>
                item.subcategory?.split(',')?.map((sc) => sc.trim().toLowerCase())
            )
        ),
    ];

    // --- 메인 카테/서브카테 선택 ---
    const mainItem = filteredItems.find((item) => item.cate.toLowerCase() === cate.toLowerCase());
    const mainCategory = mainItem ? mainItem.cate : cate;
    const mainSubcategory = subcategory || (mainItem?.subcategory?.split(',')[0] ?? null);

    return (
        <div className="sub_page product_list_page">
            <div className="inner">
                <Title title={cate?.toUpperCase()} />

                {/* 🔥 타이틀 아래 서브메뉴 */}
                {currentMenu?.submenu_list?.length > 0 && (
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
                            selectedSize={selectedSize} // 🔥 현재 선택된 사이즈
                            onSizeSelect={setSelectedSize} // 🔥 사이즈 선택 시 상태 업데이트
                        />
                    </div>

                    <div className="list_right">
                        {currentItems.length > 0 ? (
                            <>
                                <ul className="product-card__item_list">
                                    {currentItems.map((p) => (
                                        <ProductCard
                                            key={p.id}
                                            product={p}
                                            onClick={() => navigate(`/product/${p.id}`)}
                                            // 🔥 이미지 경로 확인
                                            image={p.product_img?.[0] || '/images/default.png'}
                                            onSizeSelect={setSelectedSize}
                                        />
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <div className="empty_state">
                                <p>해당 카테고리에 상품이 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 페이징목록 */}
            <div className="page_pager">
                <button onClick={() => handleGoPage(currentPage - 1)}>이전</button>
                {pagerButton}
                <button onClick={() => handleGoPage(currentPage + 1)}>다음</button>
            </div>
        </div>
    );
};

export default ProductListPage;
