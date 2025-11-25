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
        const existing = wish.find((item) => item.id === product.id);
        if (existing) {
            set({ popUp: { show: true, message: '이미 위시리스트에 담긴 상품입니다 💚' } });
            return false;
        }
        set({
            wishLists: [...wish, product],
            popUp: { show: true, message: '위시리스트에 추가되었습니다! 💚' },
        });
        console.log('wishLists에 담긴 것 확인:', get().wishLists);
        return true;
    },

    // 위시 추가 팝업창 끄기

    hidePopup: () => set({ popUp: { show: false, message: '' } }),

    // ======== 위시리스트 데이터 삭제 ========

    // 위시리스트 중 선택된 내역을 저장할 배열
    removeWish: [],

    // 체크박스 체크했을 때 담기

    toggleRemoveWish: (item) => {
        const currentWish = get().removeWish;
        const findSelectWish = currentWish.find((w) => w.id === item.id);

        if (findSelectWish) {
            //이미 있으면 제거
            set({ removeWish: currentWish.filter((w) => w.id !== item.id) });
        } else {
            //없으면 추가
            const newRemoveWish = [...currentWish, item];
            set({ removeWish: newRemoveWish });
            console.log('newRemoveWish체크박스 체크했을 때:', newRemoveWish);
        }
    },

    onRemoveWish: () => {
        // console.log('위시삭제');
        // const wish = get().removeWish;
        // const updateWish = wish.filter((wish) => wish.id !== item.id);
        // set({ removeWish: updateWish });
        console.log('위시삭제');
        const removeWish = get().removeWish;
        console.log('removeWish 선택된 위시:', removeWish);
        const wishLists = get().wishLists;
        console.log('wishLists 전체위시:', wishLists);

        const updateWishLists = wishLists.filter(
            (wish) => !removeWish.some((r) => r.id === wish.id)
        );

        set({ wishLists: updateWishLists, removeWish: [] });
    },

    addCartWish: [],
    cartWishItems: [],
    cartCount: 0,

    //장바구니 추가 버튼 선택 시 위시리스트에서 지우고 장바구니 배열에 추가

    onAddCartBtn: () => {
        // 체크된 위시들을 배열로 가져옴
        const removeWish = get().removeWish;
        // 전체 위시리스트
        const wishLists = get().wishLists;
        // 현재 장바구니 목록
        const cartWishItems = get().cartWishItems;

        // 위시리스트에서 선택된 항목 제거
        const newWishLists = wishLists.filter((wish) => !removeWish.some((r) => r.id === wish.id));

        // 장바구니에 선택된 항목 추가
        // 이미 cartWishItems에 있는 동일 상품은 count만 증가
        const newcartWishItems = [...cartWishItems];

        removeWish.forEach((item) => {
            const existing = newcartWishItems.find((cart) => cart.id === item.id);

            if (existing) {
                existing.count = (existing.count || 1) + (item.count || 1);
            } else {
                newcartWishItems.push({ ...item });
            }
        });

        // 상태 업데이트
        set({
            wishLists: newWishLists,
            cartWishItems: newcartWishItems,
            cartCount: newcartWishItems.length,
            removeWish: [], // 체크 초기화
        });
    },

    cartItems: [],

    // //진짜 장바구니 버튼 클릭 시 장바구니 추가 메서드 (위시리스트랑 합쳐)

    onProductAddCart: (product, count = 1) => {
        const cartItems = get().cartItems;
        const existing = cartItems.find((item) => item.id === product.id);

        let updated;
        if (existing) {
            updated = cartItems.map((item) =>
                item.id === product.id ? { ...item, count: item.count + count } : item
            );
        } else {
            updated = [...cartItems, { ...product, count }];
        }

        set({
            cartItems: updated,
            cartCount: updated.reduce((sum, item) => sum + item.count, 0),
            popUp: { show: true, message: '장바구니에 담겼습니다! 🛒' },
        });
    },

    // addToCart: (product, count = 1) => {
    //     const cartItems = get().cartItems;
    //     const existing = cartItems.find((item) => item.id === product.id);

    //     let updatedCart;
    //     if (existing) {
    //         updatedCart = cartItems.map((item) =>
    //             item.id === product.id ? { ...item, count: item.count + count } : item
    //         );
    //     } else {
    //         updatedCart = [...cartItems, { ...product, count }];
    //     }

    //     set({
    //         cartItems: updatedCart,
    //         cartCount: updatedCart.reduce((sum, item) => sum + item.count, 0),
    //     });
    //     set({ popUp: { show: true, message: '장바구니에 담겼습니다! 💚' } });

    //     console.log('장바구니 상태:', get().cartItems);

    //     // if (existing) {
    //     //     // 이미 장바구니에 있는 경우 팝업만 띄우고 종료
    //     //     set({ popUp: { show: true, message: '이미 장바구니에 담긴 상품입니다! 🛒' } });
    //     //     return;
    //     // }

    //     // const updatedCart = [...cartItems, { ...product, count }];

    //     // set({
    //     //     cartItems: updatedCart,
    //     //     cartCount: updatedCart.reduce((sum, item) => sum + (item.count || 1), 0),
    //     //     popUp: { show: true, message: '장바구니에 추가되었습니다! 💚' },
    //     // });

    //     // console.log('장바구니 상태:', get().cartItems);
    // },

    // onProductAddCart: (product, count = 1) => {
    //     console.log('상품 상세에서 장바구니:', product);
    //     get().addToCart(product, count);
    // },

    // 장바구니 추가 버튼 메서드(위시리스트 목록에서 지우기 )
    // onAddCartBtn: () => {
    //     console.log('장바구니 추가 버튼');
    //     const cartWish = get().removeWish;
    //     console.log('cartWish 카트에 담을 위시:', cartWish);
    //     const wishLists = get().wishLists;
    //     console.log('wishLists 전체위시:', wishLists);

    //     const updateWishCartLists = wishLists.filter(
    //         (wish) => !cartWish.some((r) => r.id === wish.id)
    //     );

    //     set({ wishLists: updateWishCartLists, addCartWish: cartWish, cartWish: [] });

    //     console.log('장바구니 추가');
    //     const addToCartWish = get().addCartWish;
    //     console.log('카트에 담겨있는 위시 내역 확인:', addToCartWish);

    //     //장바구니로 보내기

    //     const addToCartLists = get().addCartWish;
    //     const existing = addToCartLists.find((item) => item.id === product.id);

    //     let updateWishCart;
    //     if (existing) {
    //         updateWishCart = addToCartLists.map((item) =>
    //             item.id === product.id ? { ...item, count: item.count + product.count } : item
    //         );
    //     } else {
    //         updateWishCart = [...addToCartLists, { ...product }];
    //     }

    //     set({
    //         cartWishItems: updateWishCart,
    //         cartCount: updateWishCart.length,
    //     });
    // },

    // 장바구니에 추가하기 (데이터 보내기)
    // onAddToCart: (product) => {
    //     const addToCartLists = get().addCartWish;
    //     const existing = addToCartLists.find((item) => item.id === product.id);

    //     let updateWishCart;
    //     if (existing) {
    //         updateWishCart = addToCartLists.map((item) =>
    //             item.id === product.id ? { ...item, count: item.count + product.count } : item
    //         );
    //     } else {
    //         updateWishCart = [...addToCartLists, { ...product }];
    //     }

    //     set({
    //         cartWishItems: updateWishCart,
    //         cartCount: updateWishCart.length,
    //     });
    // },
}));
