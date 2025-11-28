import React, { useEffect, useState } from 'react';
import { useCrocsProductStore } from '../store/useCrocsProductStore';
import LeftNavigation from '../components/LeftNavigation';
import ProductCard from '../components/ProductCard';
import './scss/productListpage.scss';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { menuList } from '../store/menuList';
import Title from '../components/Title';
import { useCrocsSizeStore } from '../store/useCrocsSizeStore';
import { useColorFilterStore } from '../store/useColorFilterStore';

const ProductListPage = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');

    // --- size store ---
    const { crocsSizesByCategory, onFetchSize } = useCrocsSizeStore();

    // --- product store ---
    const { onFetchItems, filterByMenu, searchWord, setSearchWord } = useCrocsProductStore();

    // --- color filter store ---
    const { selectedColors } = useColorFilterStore();

    const navigate = useNavigate();
    const { cate, subcategory } = useParams();

    const [selectedSize, setSelectedSize] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // 최초 로딩
    useEffect(() => {
        onFetchItems();
        onFetchSize();
    }, [onFetchItems, onFetchSize]);

    // 검색어 URL → store
    useEffect(() => {
        if (searchQuery) setSearchWord(searchQuery);
    }, [searchQuery, setSearchWord]);

    // 카테고리/검색 변경 시 페이지 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [cate, subcategory, searchWord]);

    // 1) 카테고리 필터
    let filteredItems = filterByMenu(cate, subcategory);

    // 2) 검색어 필터
    if (searchWord) {
        const lower = searchWord.toLowerCase();
        filteredItems = filteredItems.filter(
            (item) =>
                item.product.toLowerCase().includes(lower) ||
                item.tags?.some((tag) => tag.toLowerCase().includes(lower))
        );
    }

    // 3) 카테고리 기반 사이즈 자동 지정
    const normalizeCate = (cateString) => {
        if (!cateString) return null;
        const lower = cateString.toLowerCase();

        if (lower.includes('kid') || lower.includes('키즈')) return 'kids';
        if (lower.includes('women') || lower.includes('여성')) return 'women';
        if (lower.includes('men') || lower.includes('남성')) return 'men';

        return null;
    };

    filteredItems = filteredItems.map((item) => {
        const cateKey = normalizeCate(item.cate);
        const autoSizes = cateKey ? crocsSizesByCategory?.[cateKey] || [] : [];
        return { ...item, sizes: autoSizes };
    });

    // 4) 사이즈 필터
    if (selectedSize) {
        const sizeNum = Number(selectedSize);
        if (!isNaN(sizeNum)) {
            filteredItems = filteredItems.filter(
                (item) => Array.isArray(item.sizes) && item.sizes.includes(sizeNum)
            );
        }
    }

    // 5) 색상 필터
    if (selectedColors.length > 0) {
        filteredItems = filteredItems.filter((item) => {
            const productColors = Array.isArray(item.color) ? item.color : [item.color];

            return selectedColors.some((selected) => {
                const selectedValues = Array.isArray(selected.value)
                    ? selected.value
                    : [selected.value];
                return productColors.some((pColor) => selectedValues.includes(pColor));
            });
        });
    }

    // 6) 페이징
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

    // UI 서브카테고리
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
                <div className="jibbitz_list_wrap">
                    <div className="product_list_page">
                        <Title title={cate?.toUpperCase()} />

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

                        {/* 서브 메뉴 (Jibbitz 스타일 유지) */}
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
                            {/* 좌측 네비게이션 */}
                            <div className="list_left">
                                <LeftNavigation
                                    category={mainCategory}
                                    subcategory={mainSubcategory}
                                    subCategoryList={subCategoryList}
                                    selectedSize={selectedSize}
                                    onSizeSelect={setSelectedSize}
                                />
                            </div>

                            {/* 우측 리스트 (Jibbitz 스타일 유지) */}
                            <div className="list_right">
                                {currentItems.length > 0 ? (
                                    <ul className="product-card__item_list">
                                        {currentItems.map((p) => (
                                            <ProductCard
                                                key={p.id}
                                                product={p}
                                                onClick={() => navigate(`/product/${p.id}`)}
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

export default ProductListPage;

// import React, { useEffect, useState } from 'react';
// import { useCrocsProductStore } from '../store/useCrocsProductStore';
// import LeftNavigation from '../components/LeftNavigation';
// import ProductCard from '../components/ProductCard';
// import './scss/productListpage.scss';
// import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
// import { menuList } from '../store/menuList';
// import Title from '../components/Title';
// import { useCrocsSizeStore } from '../store/useCrocsSizeStore';
// import { useColorFilterStore } from '../store/useColorFilterStore';

// const ProductListPage = () => {
//     const [searchParams] = useSearchParams();
//     const searchQuery = searchParams.get('search');

//     // --- size store ---
//     const { crocsSizesByCategory, onFetchSize } = useCrocsSizeStore();

//     // --- product store ---
//     const { onFetchItems, filterByMenu, searchWord, setSearchWord } = useCrocsProductStore();

//     // --- color filter store ---
//     const { selectedColors } = useColorFilterStore();

//     const navigate = useNavigate();
//     const { cate, subcategory } = useParams();

//     const [selectedSize, setSelectedSize] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);

//     // 최초 로딩
//     useEffect(() => {
//         onFetchItems();
//         onFetchSize();
//     }, [onFetchItems, onFetchSize]);

//     // 검색어 URL → store
//     useEffect(() => {
//         if (searchQuery) setSearchWord(searchQuery);
//     }, [searchQuery, setSearchWord]);

//     // 카테고리/검색 변경 시 페이지 초기화
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [cate, subcategory, searchWord]);

//     // -----------------------------------
//     // 1) 카테고리 필터 (기존 정상 작동 코드 기반)
//     // -----------------------------------
//     let filteredItems = filterByMenu(cate, subcategory);

//     // -----------------------------------
//     // 2) 검색어 필터
//     // -----------------------------------
//     if (searchWord) {
//         const lower = searchWord.toLowerCase();
//         filteredItems = filteredItems.filter(
//             (item) =>
//                 item.product.toLowerCase().includes(lower) ||
//                 item.tags?.some((tag) => tag.toLowerCase().includes(lower))
//         );
//     }

//     // -----------------------------------
//     // 3) 카테고리 기반 사이즈 자동 부여
//     // -----------------------------------
//     const normalizeCate = (cateString) => {
//         if (!cateString) return null;
//         const lower = cateString.toLowerCase();

//         if (lower.includes('kid') || lower.includes('키즈')) return 'kids';
//         if (lower.includes('women') || lower.includes('여성') || lower.includes('여'))
//             return 'women';
//         if (lower.includes('men') || lower.includes('남성') || lower.includes('남')) return 'men';

//         return null;
//     };

//     filteredItems = filteredItems.map((item) => {
//         const cateKey = normalizeCate(item.cate);
//         const autoSizes = cateKey ? crocsSizesByCategory?.[cateKey] || [] : [];
//         return { ...item, sizes: autoSizes };
//     });

//     // -----------------------------------
//     // 4) 사이즈 필터
//     // -----------------------------------
//     if (selectedSize) {
//         const sizeNum = Number(selectedSize);
//         if (!isNaN(sizeNum)) {
//             filteredItems = filteredItems.filter(
//                 (item) => Array.isArray(item.sizes) && item.sizes.includes(sizeNum)
//             );
//         }
//     }

//     // -----------------------------------
//     // 5) 🔥 색상 필터 (store 기반, item.color 배열 사용)
//     // -----------------------------------
//     const normalizeRGB = (rgb) => {
//         if (!rgb) return null;

//         const nums = rgb.match(/\d+/g);
//         if (!nums) return null;

//         const [r, g, b] = nums.map(Number);
//         return `rgb(${r}, ${g}, ${b})`;
//     };

//     // 🔥 5) 색상 필터 적용
//     // if (selectedColors.length > 0) {
//     //     filteredItems = filteredItems.filter((item) => {
//     //         if (!Array.isArray(item.color)) return false;

//     //         return item.color.some((productColor) => {
//     //             const productNorm = normalizeRGB(productColor);

//     //             return selectedColors.some((selected) => {
//     //                 const selectedNorm = normalizeRGB(selected.value);
//     //                 return productNorm === selectedNorm;
//     //             });
//     //         });
//     //     });
//     // }
//     // if (selectedColors.length > 0) {
//     //     filteredItems = filteredItems.filter((item) => {
//     //         const productColors = Array.isArray(item.color) ? item.color : [item.color];

//     //         return selectedColors.some((selected) => {
//     //             // selected.value 가 배열일 수도 있음 → 배열로 통일
//     //             const selectedValues = Array.isArray(selected.value)
//     //                 ? selected.value
//     //                 : [selected.value];

//     //             // 상품 색상 중 하나라도 선택된 색상 배열 안에 있으면 통과
//     //             return productColors.some((productColor) => selectedValues.includes(productColor));
//     //         });
//     //     });
//     // }
//     if (selectedColors.length > 0) {
//         filteredItems = filteredItems.filter((item) => {
//             const productColors = Array.isArray(item.color) ? item.color : [item.color];

//             return selectedColors.some((selected) => {
//                 const selectedValues = Array.isArray(selected.value)
//                     ? selected.value
//                     : [selected.value];

//                 // 정확히 완전 일치해야 매칭됨
//                 return productColors.some((pColor) => selectedValues.includes(pColor));
//             });
//         });
//     }

//     // -----------------------------------
//     // 6) 페이징
//     // -----------------------------------
//     const itemsPerPage = 12;
//     const totalPage = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
//     const start = (currentPage - 1) * itemsPerPage;
//     const currentItems = filteredItems.slice(start, start + itemsPerPage);

//     const handleGoPage = (pageNum) => {
//         if (pageNum < 1 || pageNum > totalPage) return;
//         setCurrentPage(pageNum);
//     };

//     const pageGroupSize = 5;
//     const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
//     const groupStart = currentGroup * pageGroupSize + 1;
//     const groupEnd = Math.min(groupStart + pageGroupSize - 1, totalPage);

//     const pagerButton = [];
//     for (let i = groupStart; i <= groupEnd; i++) {
//         pagerButton.push(
//             <button
//                 key={i}
//                 className={currentPage === i ? 'active' : ''}
//                 onClick={() => handleGoPage(i)}
//             >
//                 {i}
//             </button>
//         );
//     }

//     // -----------------------------------
//     // UI용 서브카테고리 계산
//     // -----------------------------------
//     const currentMenu = menuList.find((m) => m.key === cate);
//     const subCategoryList = [
//         ...new Set(
//             filteredItems.flatMap(
//                 (item) => item.subcategory?.split(',')?.map((sc) => sc.trim().toLowerCase()) || []
//             )
//         ),
//     ];

//     const mainItem = filteredItems.find((item) => item.cate?.toLowerCase() === cate?.toLowerCase());
//     const mainCategory = mainItem ? mainItem.cate : cate;
//     const mainSubcategory = subcategory || (mainItem?.subcategory?.split(',')[0] ?? null);

//     return (
//         <div className="sub_page">
//             <div className="inner">
//                 <div className="jibbitz_list_wrap">
//                     <div className="product_list_page">
//                         <Title title={cate?.toUpperCase()} />
//                         {/* 검색결과 */}
//                         {searchWord && (
//                             <div className="search_info_wrap">
//                                 <div className="search_info">
//                                     {`" ${searchWord} " 검색 결과 : `}
//                                     <p>
//                                         <strong>{filteredItems.length}</strong>개
//                                     </p>
//                                 </div>
//                                 <button
//                                     className="clear_search_info_btn"
//                                     onClick={() => {
//                                         setSearchWord('');
//                                         navigate(`/${cate}`);
//                                     }}
//                                 >
//                                     ×
//                                 </button>
//                             </div>
//                         )}

//                         {/* 서브 메뉴 */}
//                         {currentMenu?.submenu_list?.length > 0 && !searchWord && (
//                             <div className="sub_menu_wrap">
//                                 {currentMenu.submenu_list.map((sub) => (
//                                     <div
//                                         key={sub.key}
//                                         className={`btn_menu_item ${
//                                             subcategory === sub.key ? 'active' : ''
//                                         }`}
//                                         onClick={() => navigate(`/${cate}/${sub.key}`)}
//                                     >
//                                         <button className="sub_menu_btn">{sub.label}</button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         <div className="product_list_wrap">
//                             {/* 좌측 필터 */}
//                             <div className="list_left">
//                                 <LeftNavigation
//                                     category={mainCategory}
//                                     subcategory={mainSubcategory}
//                                     subCategoryList={subCategoryList}
//                                     selectedSize={selectedSize}
//                                     onSizeSelect={setSelectedSize}
//                                 />
//                             </div>

//                             {/* 우측 리스트 */}
//                             <div className="list_right">
//                                 {currentItems.length > 0 ? (
//                                     <ul className="product-card__item_list">
//                                         {currentItems.map((p) => (
//                                             <ProductCard
//                                                 key={p.id}
//                                                 product={p}
//                                                 onClick={() => navigate(`/product/${p.id}`)}
//                                                 onSizeSelect={setSelectedSize}
//                                             />
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <div className="empty_state">
//                                         <p>
//                                             {searchWord
//                                                 ? `"${searchWord}"에 대한 검색 결과가 없습니다.`
//                                                 : '해당 조건에 맞는 상품이 없습니다.'}
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {totalPage > 1 && (
//                         <div className="page_pager">
//                             <button onClick={() => handleGoPage(currentPage - 1)}>이전</button>
//                             {pagerButton}
//                             <button onClick={() => handleGoPage(currentPage + 1)}>다음</button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductListPage;
