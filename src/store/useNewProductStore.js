import React from 'react'
import { create } from 'zustand'
import {newProducts} from "../data/newProductData.js"

export const useNewProductStore = create((set, get) => ({
    items: [],
    onFetchItem: async () => {
        const currentItems = get().items;
        if (currentItems.length > 0) return;
        set({ items: newProducts})
    }
}));

// export const useNewProductStore = create((set) => ({
//     items: newProducts,
// }));
