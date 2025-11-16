import { create } from 'zustand';
import jibbitzAll from '../data/jibbitzAll.json';

export const collaboAuthStore = create((set, get) => ({
    //메인//
    //section3_CollaboJibbitz 상품 목록을 저장할 배열
    jibbitzItems: jibbitzAll,
    disneyItems: jibbitzAll.filter(
        (item) =>
            (item.title.includes('디즈니') || item.title.includes('동물')) && item.price !== ''
    ),

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
}));
