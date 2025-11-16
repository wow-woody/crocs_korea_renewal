import { create } from 'zustand';

export const wishListStore = create((set, get) => ({
    // ========= 위시리스트 store =========
    wishLists: [],
    onAddWishList: (product) => {
        console.log('선택상품 들어왔나?:', product);
        const wish = get().wishLists;

        const existing = wish.find((wish) => wish.id === product.id);
        let updateWish;
        if (existing) {
            alert('이미 당신의 위시 속에 쏘옥💚');
            return false;
        } else {
            updateWish = [...wish, { ...product }];
            console.log('선택상품 담겼나?:', wish);
        }

        set({ wishLists: updateWish });
        console.log('위시에 담긴 것 확인:', get().wishLists);
        console.log('찜완💚되었으니 계속 개발을 하시어요');
        return true;
    },

    // ========= 위시리스트 store =========
}));
