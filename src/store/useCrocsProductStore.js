import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Products } from '../data/CrocsProductsData';
import { getCategoryMap } from '../utils/getCategoryMap';

// 🔥 스토어 버전 - 이 숫자를 변경하면 자동으로 캐시가 초기화됩니다
const STORE_VERSION = 3; // prices 배열 사용으로 버전 업

// 콜라보 키워드
const AUTO_TAG_KEYWORDS = [
    '디즈니',
    '마블',
    '픽사',
    '짱구',
    '포켓몬',
    '스누피',
    '라인프렌즈',
    'BT21',
    '카카오프렌즈',
    '스폰지밥',
    '세서미',
    '토이 스토리',
    '산리오',
    '쿠로미',
    '마이멜로디',
    '헬로키티',
    '잭오랜턴',
    '심슨',
    '미키',
    '미니',
    '주토피아',
    '도라에몽',
    '랏소',
    '기묘한 이야기',
    '버터 x',
    '장 폴 고티에',
    'M&M',
    '시몬 로샤',
];

// ===============================
// 🔥 RGB → 숫자 배열
// ===============================
const rgbStringToArray = (rgb) => {
    if (!rgb) return null;
    const nums = rgb.match(/\d+/g);
    return nums ? nums.map(Number) : null;
};

// 🔥 두 rgb 사이 거리 계산
const colorDistance = (a, b) => {
    if (!a || !b) return Infinity;
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
};

// 🔥 유사 색 여부 (threshold 조절 가능)
const isSimilarColor = (c1, c2, threshold = 60) => {
    const rgb1 = rgbStringToArray(c1);
    const rgb2 = rgbStringToArray(c2);
    return colorDistance(rgb1, rgb2) <= threshold;
};

export const useCrocsProductStore = create(
    persist(
        (set, get) => ({
            crocsItems: [],
            searchWord: '',
            categoryMap: getCategoryMap(),
            version: STORE_VERSION,

            // ⭐ 추가된 필드
            colorFilter: null,
            setColorFilter: (color) => set({ colorFilter: color }),

            selectedCategory: null,
            selectedSubcategory: null,

            setSelectedCategory: (cate) => set({ selectedCategory: cate }),
            setSelectedSubcategory: (sub) => set({ selectedSubcategory: sub }),

            // ---------------------------
            // 📌 상품 로드 + 태그 생성
            // ---------------------------
            // onFetchItems: async () => {
            //     const current = get().crocsItems;
            //     if (current.length > 0) return;

            //     const map = get().categoryMap;

            //     const parsed = Products.filter((item) => item.prices && item.prices[0]) // 가격 없는 제품 제외
            //         .map((item) => {
            //             const cateList = item.cate
            //                 ? item.cate
            //                       .split(',')
            //                       .map((v) => v.trim())
            //                       .filter(Boolean)
            //                 : [];

            //             const subList = item.subcategory
            //                 ? item.subcategory
            //                       .split(',')
            //                       .map((v) => v.trim())
            //                       .filter(Boolean)
            //                 : [];

            //             const allKoreanTags = [...cateList, ...subList];

            //             const englishTags = [
            //                 ...new Set(
            //                     allKoreanTags
            //                         .map((tag) => {
            //                             if (tag.includes('_')) {
            //                                 return tag.split('_').map((p) => map[p] || p);
            //                             }
            //                             return map[tag] || tag;
            //                         })
            //                         .flat()
            //                         .filter(Boolean)
            //                 ),
            //             ];

            //             AUTO_TAG_KEYWORDS.forEach((keyword) => {
            //                 if (item.product.includes(keyword)) {
            //                     if (!englishTags.includes(keyword)) englishTags.push(keyword);
            //                     if (!englishTags.includes('collabs')) englishTags.push('collabs');
            //                 }
            //             });

            //             return {
            //                 ...item,
            //                 tags: englishTags,
            //                 tags_ko: allKoreanTags,
            //             };
            //         });

            //     set({ crocsItems: parsed });
            // },

            onFetchItems: async () => {
                const current = get().crocsItems;
                if (current.length > 0) return;

                const map = get().categoryMap;

                // 🔹 가격 정리 함수
                const normalizePrice = (price) => {
                    if (!price) return null;

                    // 1. 원화 기호 제거
                    let cleaned = price.replace(/₩/g, '');

                    // 2. 콤마 제거
                    cleaned = cleaned.replace(/,/g, '');

                    // 3. 숫자로 변환
                    const number = Number(cleaned);

                    if (isNaN(number)) return null;

                    // 4. 다시 콤마 찍어 문자열로 변환
                    return number.toLocaleString('ko-KR');
                };

                const parsed = Products.filter((item) => item.prices && item.prices[0]) // 가격 없는 제품 제외
                    .map((item) => {
                        // 🔹 가격 배열 정리
                        const normalizedPrices = item.prices.map(normalizePrice);

                        // 카테고리 처리
                        const cateList = item.cate
                            ? item.cate
                                  .split(',')
                                  .map((v) => v.trim())
                                  .filter(Boolean)
                            : [];

                        const subList = item.subcategory
                            ? item.subcategory
                                  .split(',')
                                  .map((v) => v.trim())
                                  .filter(Boolean)
                            : [];

                        const allKoreanTags = [...cateList, ...subList];

                        // 영어 태그 매핑
                        const englishTags = [
                            ...new Set(
                                allKoreanTags
                                    .map((tag) =>
                                        tag.includes('_')
                                            ? tag.split('_').map((p) => map[p] || p)
                                            : map[tag] || tag
                                    )
                                    .flat()
                                    .filter(Boolean)
                            ),
                        ];

                        // 자동 태그 추가
                        AUTO_TAG_KEYWORDS.forEach((keyword) => {
                            if (item.product.includes(keyword)) {
                                if (!englishTags.includes(keyword)) englishTags.push(keyword);
                                if (!englishTags.includes('collabs')) englishTags.push('collabs');
                            }
                        });

                        return {
                            ...item,
                            prices: normalizedPrices, // 정리된 가격 배열
                            tags: englishTags,
                            tags_ko: allKoreanTags,
                        };
                    });

                set({ crocsItems: parsed });
            },

            // ---------------------------
            // 📌 기본 필터
            // ---------------------------
            onItemsCategory: (cate) => {
                const items = get().crocsItems;
                if (!cate || cate === 'all') return items;
                return items.filter((item) => item.tags?.includes(cate));
            },

            // filterByMenu: (mainKey, subKey = null) => {
            //     const items = get().crocsItems;
            //     const hasTag = (item, key) => item?.tags?.includes(key);

            //     if (mainKey === 'all') {
            //         if (!subKey || subKey === 'all') return items;
            //         return items.filter((i) => hasTag(i, subKey));
            //     }

            //     if (!subKey || subKey === 'all') {
            //         return items.filter((i) => hasTag(i, mainKey));
            //     }

            //     return items.filter((i) => hasTag(i, mainKey) && hasTag(i, subKey));
            // },

            filterByMenu: (mainKey, subKey = null) => {
                const items = get().crocsItems;

                const hasTag = (item, key) =>
                    item?.tags?.includes(key) || item?.tags_ko?.includes(key);

                if (mainKey === 'all') {
                    if (!subKey || subKey === 'all') return items;
                    return items.filter((i) => hasTag(i, subKey));
                }

                if (!subKey || subKey === 'all') {
                    return items.filter((i) => hasTag(i, mainKey));
                }

                return items.filter((i) => hasTag(i, mainKey) && hasTag(i, subKey));
            },

            filteredItems: () => {
                const { crocsItems, colorFilter } = get();
                if (!colorFilter) return crocsItems;

                return crocsItems.filter((item) => {
                    const rawColors = item.color;

                    let itemColors = [];

                    if (typeof rawColors === 'string') {
                        itemColors = rawColors
                            .split(',')
                            .map((c) => c.trim())
                            .filter(Boolean);
                    } else if (Array.isArray(rawColors)) {
                        itemColors = rawColors;
                    }

                    return itemColors.some((c) => isSimilarColor(colorFilter, c));
                });
            },

            // ---------------------------
            // 📌 검색어 저장
            // ---------------------------
            setSearchWord: (word) => set({ searchWord: word }),
        }),
        {
            name: 'crocs-product-store',
            version: STORE_VERSION,
            migrate: (persistedState, version) => {
                if (version !== STORE_VERSION) {
                    return {
                        crocsItems: [],
                        searchWord: '',
                        categoryMap: getCategoryMap(),
                        version: STORE_VERSION,
                    };
                }
                return persistedState;
            },
        }
    )
);
