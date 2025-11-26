import { create } from "zustand";
import { persist } from "zustand/middleware";
import { parsePrice } from "../components/parsePrice";

export const useCartStore = create(
    persist(
        (set, get) => ({
            // 상태
            cartProducts: [],
            selectedProducts: new Set(),
            isOrderComplete: false,

            // 배송비 설정
            freeShippingThreshold: 30000,
            shippingFee: 2500,

            // 초기화 -  localstorage에서 불러오기
            initializeCart: (Products, wishCartItems = []) => {
                const cartIds = JSON.parse(localStorage.getItem("cartIds")) || [];

                // 이미 장바구니에 상품이 있으면 건너뜀
                // if (cartProducts.length > 0) return;

                // Products에서 가져온 상품
                const productsWithPrice = Products.filter((item) => cartIds.includes(item.id)).map(
                    (item) => {
                        const price_dc = parsePrice(item.price_dc_rate);
                        const price_original = parsePrice(item.price);
                        return {
                            ...item,
                            quantity: 1,
                            price: price_dc > 0 ? price_dc : price_original,
                            // size가 있는 경우에만 추가
                            ...(item.size && { size: item.size }),
                        };
                    }
                );

                // wishCartItems가 있으면 추가
                const wishProducts = wishCartItems.map((item) => {
                    const price_dc = parsePrice(item.price_dc_rate || item.price);
                    const price_original = parsePrice(item.price);
                    return {
                        ...item,
                        id: item.id,
                        quantity: item.count || 1,
                        price: price_dc > 0 ? price_dc : price_original,
                        product_img: item.imageUrl || item.product_img,
                        name: item.title || item.name,
                        // size가 있는 경우에만 추가
                        ...(item.size && { size: item.size }),
                    };
                });

                // 중복 제거하고 합치기 (wishProducts 우선)
                const allProducts = [...wishProducts];
                productsWithPrice.forEach((product) => {
                    const existing = allProducts.find((p) => p.id === product.id);
                    if (!existing) {
                        allProducts.push(product);
                    }
                });

                set({
                    cartProducts: allProducts,
                    selectedProducts: new Set(allProducts.map((p) => p.id)),
                });
            },

            // 위시리스트에서 장바구니로 추가
            addFromWishlist: (Products, wishCartItems = []) => {
                const { cartProducts } = get();

                // wishListStore의 cartWishItems 처리
                const wishProducts = wishCartItems.map((item) => {
                    const price_dc = parsePrice(item.price_dc_rate || item.price);
                    const price_original = parsePrice(item.price);

                    return {
                        ...item,
                        quantity: item.count || 1,
                        price: price_dc > 0 ? price_dc : price_original,
                        product_img: item.imageUrl || item.product_img,
                        name: item.title || item.name,
                    };
                });

                // 기존 장바구니에 없는 상품만 추가
                const newProducts = wishProducts.filter(
                    (newItem) => !cartProducts.some((existing) => existing.id === newItem.id)
                );

                if (newProducts.length > 0) {
                    const updatedProducts = [...cartProducts, ...newProducts];
                    set({
                        cartProducts: updatedProducts,
                        selectedProducts: new Set(updatedProducts.map((p) => p.id)),
                    });
                }
            },

            // 상품 상세에서 장바구니에 직접 추가 (새로 추가)
            addProductToCart: (product, count = 1) => {
                const { cartProducts } = get();
                const cartIds = JSON.parse(localStorage.getItem("cartIds")) || [];

                // 중복 체크
                // if (cartIds.includes(product.id)) {
                //   alert("이미 장바구니에 담긴 상품입니다.");
                //   return false;
                // }
                // 수정: cartProducts에서 직접 확인 + 중복이면 수량 증가
                const existingProductIndex = cartProducts.findIndex(
                    (item) => item.id === product.id
                );

                if (existingProductIndex !== -1) {
                    // 이미 있으면 수량만 증가
                    const updatedProducts = cartProducts.map((item, index) =>
                        index === existingProductIndex
                            ? { ...item, quantity: item.quantity + count }
                            : item
                    );

                    set({ cartProducts: updatedProducts });

                    alert(`장바구니에 상품이 이미 있어 수량이 ${count}개 추가되었습니다.`);
                    return true;
                }

                const price_dc = parsePrice(product.price_dc_rate || product.discountPrice);
                const price_original = parsePrice(product.price);
                const finalPrice = price_dc > 0 ? price_dc : price_original;

                // 새 상품 객체 생성
                const newProduct = {
                    ...product,
                    quantity: count,
                    price: finalPrice,
                    product_img: product.imageUrl || product.product_img,
                    name: product.title || product.name || product.product,
                };

                // localStorage에 추가
                cartIds.push(product.id);
                localStorage.setItem("cartIds", JSON.stringify(cartIds));

                // cartProducts에 추가
                const updatedProducts = [...cartProducts, newProduct];

                set({
                    cartProducts: updatedProducts,
                    selectedProducts: new Set(updatedProducts.map((p) => p.id)),
                });

                return true;
            },

            // 개별 선택
            handleSelectProduct: (id) => {
                const { selectedProducts } = get();
                const newSelected = new Set(selectedProducts);

                if (newSelected.has(id)) {
                    newSelected.delete(id);
                } else {
                    newSelected.add(id);
                }
                set({ selectedProducts: newSelected });
            },

            // 전체 선택/해제
            handleSelectAll: (checked) => {
                const { cartProducts } = get();
                if (checked) {
                    set({ selectedProducts: new Set(cartProducts.map((p) => p.id)) });
                } else {
                    set({ selectedProducts: new Set() });
                }
            },

            // 상품 삭제
            handleRemoveProduct: (id) => {
                const { cartProducts, selectedProducts } = get();
                const newProducts = cartProducts.filter((p) => p.id !== id);
                const newSelected = new Set(selectedProducts);
                newSelected.delete(id);

                // localStorage에서도 제거
                const cartIds = JSON.parse(localStorage.getItem("cartIds")) || [];
                const updatedCartIds = cartIds.filter((cartId) => cartId !== id);
                localStorage.setItem("cartIds", JSON.stringify(updatedCartIds));

                set({
                    cartProducts: newProducts,
                    selectedProducts: newSelected,
                });
            },

            // 선택 상품 삭제
            handleRemoveSelected: () => {
                const { selectedProducts, cartProducts } = get();

                if (selectedProducts.size === 0) {
                    alert("삭제할 상품을 선택해주세요.");
                    return;
                }

                const newProducts = cartProducts.filter((p) => !selectedProducts.has(p.id));

                if (window.confirm(`선택한 ${selectedProducts.size}개 상품을 삭제하시겠습니까?`)) {
                  
                    // localStorage에서도 삭제
                    const cartIds = JSON.parse(localStorage.getItem("cartIds")) || [];
                    const updatedCartIds = cartIds.filter((id) => !selectedProducts.has(id));
                    localStorage.setItem("cartIds", JSON.stringify(updatedCartIds));

                    set({
                        cartProducts: cartProducts.filter((p) => !selectedProducts.has(p.id)),
                        selectedProducts: new Set(),
                    });
                }
            },

            // 수량 증가
            handleIncreaseQuantity: (id) => {
                const { cartProducts } = get();
                set({
                    cartProducts: cartProducts.map((product) =>
                        product.id === id ? { ...product, quantity: product.quantity + 1 } : product
                    ),
                });
            },

            // 수량 감소
            handleDecreaseQuantity: (id) => {
                const { cartProducts } = get();
                set({
                    cartProducts: cartProducts.map((product) =>
                        product.id === id && product.quantity > 1
                            ? { ...product, quantity: product.quantity - 1 }
                            : product
                    ),
                });
            },

            // 총 가격 계산
            // 전체 상품 금액 (배송비 제외)
            getSubtotal: () => {
                const { cartProducts } = get();
                return cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
            },

            // 선택된 상품 금액
            getSelectedSubtotal: () => {
                const { cartProducts, selectedProducts } = get();
                return cartProducts
                    .filter((p) => selectedProducts.has(p.id))
                    .reduce((sum, p) => sum + p.price * p.quantity, 0);
            },

            // 배송비 계산
            getShipping: () => {
                const { freeShippingThreshold, shippingFee } = get();
                const subtotal = get().getSubtotal();
                return subtotal >= freeShippingThreshold ? 0 : shippingFee;
            },

            // 전체 최종 금액 (상품금액 + 배송비)
            getTotal: () => {
                const { cartProducts } = get();

                // 장바구니가 비어있으면 총가격 0
                if (cartProducts.length === 0) {
                    return 0;
                }
                const subtotal = get().getSubtotal();
                const shipping = get().getShipping();
                return subtotal + shipping;
            },

            // 선택 상품 최종 금액 (상품금액 + 배송비)
            getSelectedTotal: () => {
                const { freeShippingThreshold, shippingFee, cartProducts } = get();
                const selectedSubtotal = get().getSelectedSubtotal();

                // 장바구니가 비어있으면 배송비도 0
                if (cartProducts.length === 0 || selectedSubtotal === 0) {
                    return 0;
                }

                const Shipping = selectedSubtotal >= freeShippingThreshold ? 0 : shippingFee;
                return selectedSubtotal + Shipping;
            },

            // 전체 상품 주문
            handleOrderAll: () => {
                const { cartProducts } = get();

                if (cartProducts.length === 0) {
                    alert("장바구니에 상품이 없습니다.");
                    return null;
                }

                return {
                    products: cartProducts.map((item) => ({
                        name: item.name,
                        color: item.color,
                        size: item.size,
                        quantity: item.quantity,
                        price: item.price,
                        product_img: item.product_img,
                        cate: item.cate,
                    })),
                    subtotal: get().getSubtotal(),
                    shipping: get().getShipping(),
                    total: get().getTotal(),
                };
            },

            // 선택 상품 주문
            handleOrderSelected: () => {
                const { cartProducts, selectedProducts } = get();

                if (selectedProducts.size === 0) {
                    alert("주문할 상품을 선택해주세요.");
                    return;
                }

                const selected = cartProducts.filter((p) => selectedProducts.has(p.id));

                return {
                    products: selected.map((item) => ({
                        name: item.name,
                        color: item.color,
                        size: item.size,
                        quantity: item.quantity,
                        price: item.price,
                        product_img: item.product_img,
                        cate: item.cate,
                    })),
                    subtotal: get().getSelectedSubtotal(),
                    shipping: get().getShipping(),
                    total: get().getSelectedTotal(),
                };

                // set({ isOrderComplete: true });

                // setTimeout(() => {
                //   const newProducts = cartProducts.filter(
                //     (p) => !selectedProducts.has(p.id)
                //   );
                //   set({
                //     cartProducts: newProducts,
                //     selectedProducts: new Set(),
                //     isOrderComplete: false,
                //   });
                //   alert(`선택한 ${selectedProducts.size}개 상품만 주문하시겠습니까?`);
                // }, 1000);
            },

            // 선택 상품 선물
            handleGiftSelected: () => {
                const { selectedProducts } = get();

                if (selectedProducts.size === 0) {
                    alert("선물할 상품을 선택해주세요.");
                    return;
                }

                alert(`선택한 ${selectedProducts.size}개 상품을 선물하기 페이지로 이동합니다.`);
            },

            // 장바구니 전체 비우기 (추가 기능)
            clearCart: () => {
                set({
                    cartProducts: [],
                    selectedProducts: new Set(),
                    isOrderComplete: false,
                });
            },

            // 주문 완료 상태 리셋
            resetOrderComplete: () => set({ isOrderComplete: false }),
        }),
        {
            name: "cart-storage",
            partialize: (state) => ({
                cartProducts: state.cartProducts,
                selectedProducts: Array.from(state.selectedProducts), // Set을 배열로 변환
            }),
            // 로드 시 Set으로 다시 변환
            onRehydrateStorage: () => (state) => {
                if (state && Array.isArray(state.selectedProducts)) {
                    state.selectedProducts = new Set(state.selectedProducts);
                }
            },
        }
    )
);
