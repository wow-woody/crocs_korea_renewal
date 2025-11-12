// import { create } from 'zustand';

// export const useSearchStore = create((set, get) => ({
//     // 글자를 입력받을 변수
//     inputText: '',

//     // 입력받은 데이터를 저장할 배열
//     recentSearches: [],

//     onInputText: (value) => set(() => ({ inputText: value })),

//     onAddRecentSearches: () => {
//         const { inputText, recentSearches } = get();
//         const newRecentSearches = { id: Date.now(), inputText };
//         const updateInput = [...recentSearches, newRecentSearches];

//         set({ recentSearches: updateInput, inputText: '' });
//     },
// }));

import { create } from 'zustand';

export const useSearchStore = create((set, get) => ({
    inputText: '',
    recentSearches: [],
    searchOpen: false,

    onInputText: (value) => set(() => ({ inputText: value })),

    onAddRecentSearches: () => {
        const { inputText, recentSearches } = get();
        if (!inputText.trim()) return; // 빈 문자열 방지

        // 기존에 동일 텍스트가 있는지 체그
        const existing = recentSearches.find((item) => item.inputText === inputText);

        let updatedList;

        if (existing) {
            // 기존항목 맨 위로 이동
            updatedList = [
                { ...existing, id: Date.now() },
                ...recentSearches.filter((item) => item.inputText !== inputText),
            ];
        } else {
            // 새로운 검색어 추가
            updatedList = [{ id: Date.now(), inputText }, ...recentSearches];
        }

        // 최대 9개까지만 유지
        updatedList = updatedList.slice(0, 7);

        set({ recentSearches: updatedList, inputText: '' });

        // const newRecentSearch = { id: Date.now(), inputText };
        // set({ recentSearches: [...recentSearches, newRecentSearch], inputText: '' });
    },

    onRemoveSearch: (id) => {
        const { recentSearches } = get();
        const newRecentSearch = recentSearches.filter((search) => search.id !== id);

        set({
            recentSearches: newRecentSearch,
        });
    },

    onClearAll: () => set({ recentSearches: [] }),

    onOpenSearch: () => set({ searchOpen: true }),
    onCloseSearch: () => set({ searchOpen: false }),
}));
