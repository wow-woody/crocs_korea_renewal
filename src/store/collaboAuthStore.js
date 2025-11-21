import { create } from 'zustand';
import { jibbitzs } from '../data/jibbitzs';

export const collaboAuthStore = create((set, get) => ({
    jibbitzItems: [],

    onFetchJibbitz: async () => {
        const items = get().jibbitzItems;
        if (items.length > 0) return;
        set({ jibbitzItems: jibbitzs });
    },

    disneyItems: jibbitzs.filter(
        (item) =>
            (item.title.includes('디즈니') || item.title.includes('동물')) && item.price !== ''
    ),
}));
