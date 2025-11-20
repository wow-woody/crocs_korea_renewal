// import { create } from 'zustand';

// export const useSearchStore = create((set, get) => ({
//     inputText: '',
//     recentSearches: [],
//     searchOpen: false,

//     onInputText: (value) => set(() => ({ inputText: value })),

//     onAddRecentSearches: () => {
//         const { inputText, recentSearches } = get();
//         if (!inputText.trim()) return; // 빈 문자열 방지

//         // 기존에 동일 텍스트가 있는지 체그
//         const existing = recentSearches.find((item) => item.inputText === inputText);

//         let updatedList;

//         if (existing) {
//             // 기존항목 맨 위로 이동
//             updatedList = [
//                 { ...existing, id: Date.now() },
//                 ...recentSearches.filter((item) => item.inputText !== inputText),
//             ];
//         } else {
//             // 새로운 검색어 추가
//             updatedList = [{ id: Date.now(), inputText }, ...recentSearches];
//         }

//         // 최대 9개까지만 유지
//         updatedList = updatedList.slice(0, 7);

//         set({ recentSearches: updatedList, inputText: '' });

//         // const newRecentSearch = { id: Date.now(), inputText };
//         // set({ recentSearches: [...recentSearches, newRecentSearch], inputText: '' });
//     },

//     onRemoveSearch: (id) => {
//         const { recentSearches } = get();
//         const newRecentSearch = recentSearches.filter((search) => search.id !== id);

//         set({
//             recentSearches: newRecentSearch,
//         });
//     },

//     onClearAll: () => set({ recentSearches: [] }),

//     onOpenSearch: () => set({ searchOpen: true }),
//     onCloseSearch: () => set({ searchOpen: false }),
// }));

import { create } from 'zustand';

const STORAGE_KEY = 'recentSearches';

export const useSearchStore = create((set, get) => ({
    inputText: '',
    recentSearches: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
    searchOpen: false,

    onInputText: (value) => set(() => ({ inputText: value })),

    onAddRecentSearches: () => {
        const { inputText, recentSearches } = get();
        if (!inputText.trim()) return;

        const existing = recentSearches.find((item) => item.inputText === inputText);
        let updatedList;

        if (existing) {
            updatedList = [
                { ...existing, id: Date.now() },
                ...recentSearches.filter((item) => item.inputText !== inputText),
            ];
        } else {
            updatedList = [{ id: Date.now(), inputText }, ...recentSearches];
        }

        updatedList = updatedList.slice(0, 7);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
        set({ recentSearches: updatedList, inputText: '' });
    },

    onRemoveSearch: (id) => {
        const { recentSearches } = get();
        const newRecentSearch = recentSearches.filter((search) => search.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecentSearch));
        set({ recentSearches: newRecentSearch });
    },

    onClearAll: () => {
        localStorage.removeItem(STORAGE_KEY);
        set({ recentSearches: [] });
    },

    onOpenSearch: () => set({ searchOpen: true }),
    onCloseSearch: () => set({ searchOpen: false }),
}));
