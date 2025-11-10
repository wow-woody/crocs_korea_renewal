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

    onInputText: (value) => set(() => ({ inputText: value })),

    onAddRecentSearches: () => {
        const { inputText, recentSearches } = get();
        if (!inputText.trim()) return; // 빈 문자열 방지
        const newRecentSearch = { id: Date.now(), inputText };
        set({ recentSearches: [...recentSearches, newRecentSearch], inputText: '' });
    },
}));
