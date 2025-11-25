import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Products } from '../data/CrocsProductsData';
// import { getCategoryMap } from '../utils/getCategoryMap';

// 🔥 스토어 버전
const STORE_VERSION = 4;

// 최근 검색어 저장 키
const RECENT_SEARCHES_KEY = 'recentSearches';

export const AUTO_TAG_KEYWORDS = [
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
            // ============================================
            // 📦 제품 관련 상태
            // ============================================
            // 필터 상태
            colorFilter: null,
            selectedCategory: null,
            selectedSubcategory: null,

            // ============================================
            // 🔍 검색 관련 상태
            // ============================================
            searchWord: '',
            inputText: '',
            searchOpen: false,
            recentSearches: [],

            // ============================================
            // 📦 제품 관련 액션
            // ============================================
            setColorFilter: (color) => set({ colorFilter: color }),
            setSelectedCategory: (cate) => set({ selectedCategory: cate }),
            setSelectedSubcategory: (sub) => set({ selectedSubcategory: sub }),

            // ============================================
            // 🔍 해시태그 리스트 생성 (여기에 넣기!)
            // ============================================
            getHashtags: () => {
                const { crocsItems } = get();
                const hashtagSet = new Set();

                // 📌 1. 제품에서 실제 등장한 태그들
                crocsItems.forEach((item) => {
                    item.tags?.forEach((tag) => hashtagSet.add(tag));
                });

                // 📌 2. 자동 태그 키워드 중 제품명에 등장하면 추가
                AUTO_TAG_KEYWORDS.forEach((keyword) => {
                    const hasKeywordItem = crocsItems.some((item) =>
                        item.product.includes(keyword)
                    );
                    if (hasKeywordItem) hashtagSet.add(keyword);
                });

                return Array.from(hashtagSet);
            },

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

            searchFilteredItems: () => {
                const { crocsItems, searchWord } = get();
                if (!searchWord) return crocsItems;

                const keyword = searchWord.toLowerCase();
                return crocsItems.filter(
                    (item) =>
                        item.product.toLowerCase().includes(keyword) ||
                        item.tags.some((tag) => tag.toLowerCase().includes(keyword))
                );
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

            // ============================================
            // 🔍 검색 관련 액션
            // ============================================

            // 검색어 설정 (제품 필터링용)
            setSearchWord: (word) => set({ searchWord: word }),

            // 입력 텍스트 설정 (UI용)
            onInputText: (value) => set({ inputText: value }),

            // 최근 검색어 추가
            onAddRecentSearches: (searchText) => {
                const { recentSearches } = get();

                // 전달받은 searchText 사용 (없으면 inputText 사용)
                const textToSave = searchText || get().inputText;

                if (!textToSave.trim()) return;

                const existing = recentSearches.find((item) => item.inputText === textToSave);
                let updatedList;

                if (existing) {
                    // 이미 존재하면 최상단으로 이동
                    updatedList = [
                        { ...existing, id: Date.now() },
                        ...recentSearches.filter((item) => item.inputText !== textToSave),
                    ];
                } else {
                    // 새로운 검색어 추가
                    updatedList = [{ id: Date.now(), inputText: textToSave }, ...recentSearches];
                }

                // 최대 7개까지만 유지
                updatedList = updatedList.slice(0, 7);

                set({ recentSearches: updatedList });
            },

            // 특정 검색어 삭제
            onRemoveSearch: (id) => {
                const { recentSearches } = get();
                const newRecentSearch = recentSearches.filter((search) => search.id !== id);
                set({ recentSearches: newRecentSearch });
            },

            // 모든 최근 검색어 삭제
            onClearAll: () => {
                set({ recentSearches: [] });
            },

            // 검색 모달 열기/닫기
            onOpenSearch: () => set({ searchOpen: true }),
            onCloseSearch: () => set({ searchOpen: false }),
        }),
        {
            name: 'crocs-unified-store',
            version: STORE_VERSION,
            // ✅ recentSearches만 localStorage에 저장
            partialize: (state) => ({
                recentSearches: state.recentSearches,
            }),
            migrate: (persistedState, version) => {
                if (version !== STORE_VERSION) {
                    return {
                        crocsItems: [],
                        searchWord: '',
                        inputText: '',
                        searchOpen: false,
                        recentSearches: persistedState?.recentSearches || [],
                        version: STORE_VERSION,
                        colorFilter: null,
                        selectedCategory: null,
                        selectedSubcategory: null,
                    };
                }
                return persistedState;
            },
        }
    )
);
