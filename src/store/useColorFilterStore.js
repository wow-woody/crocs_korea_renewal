import { create } from 'zustand';

export const useColorFilterStore = create((set) => ({
    selectedColors: [], // 선택된 컬러들

    // 컬러 추가
    addColor: (color) =>
        set((state) => ({
            selectedColors: [...state.selectedColors, color],
        })),

    // 컬러 제거
    removeColor: (colorValue) =>
        set((state) => ({
            selectedColors: state.selectedColors.filter((c) => c.value !== colorValue),
        })),

    // 컬러 토글 (있으면 제거, 없으면 추가)
    toggleColor: (color) =>
        set((state) => {
            const exists = state.selectedColors.some((c) => c.value === color.value);
            if (exists) {
                return {
                    selectedColors: state.selectedColors.filter((c) => c.value !== color.value),
                };
            } else {
                return {
                    selectedColors: [...state.selectedColors, color],
                };
            }
        }),

    // 모든 컬러 초기화
    clearColors: () => set({ selectedColors: [] }),
}));
