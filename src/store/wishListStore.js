import { create } from 'zustand';

export const wishListStore = create((set, get) => ({
    // ========= 위시리스트 담기 =========

    // 위시목록에 저장할 배열
    wishLists: [],
    // 위시 저장 완료 팝업
    popUp: {
        show: false,
        message: '',
    },

    // 위시리스트 저장 메서드
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
        set({ popUp: { show: true, message: '장바구니에 담겼습니다! 💚' } });
        console.log('위시에 담긴 것 확인:', get().wishLists);
        console.log('찜완💚되었으니 계속 개발을 하시어요');
        return true;
    },

    // 위시 추가 팝업창 끄기

    hidePopup: () => set({ popUp: { show: false, message: '' } }),

    // 위시리스트 데이터 삭제
    onRemoveWish: (item) => {
        console.log('위시삭제');
        const wish = get().wishLists;
        const updateWish = wish.filter((wish) => wish.id !== item.id);
        set({ wishLists: updateWish });
    },
}));
