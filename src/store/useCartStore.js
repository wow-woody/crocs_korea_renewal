import { create } from "zustand";
import { persist } from "zustand/middleware";

// 가격설정
function parsePrice(priceStr) {
    if (!priceStr) return 0;
    let price = String(priceStr).replace(/₩|,/g, "").trim();
    price = price.replace(/\([^)]*\)/g, "").trim();
    const numbers = price.match(/\d+/);
    return numbers ? parseInt(numbers[0]) : 0;
}

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

            // 초기화 (로컬스토리지에서 불러오기)
            initializeCart: (Products) => {
                const cartIds = JSON.parse(localStorage.getItem("cartIds")) || [];
                
                const productsWithPrice = Products
                    .filter((item) => cartIds.includes(item.id))
                    .map((item) => {
                        const price_dc = parsePrice(item.price_dc_rate);
                        const price_original = parsePrice(item.price);
                        return {
                            ...item,
                            quantity: 1,
                            price: price_dc > 0 ? price_dc : price_original,
                        };
                    });

                set({
                    cartProducts: productsWithPrice,
                    selectedProducts: new Set(productsWithPrice.map((p) => p.id)),
                });
            },

            // 금액 계산 (Computed Values)
            getSubtotal: () => {
                const { cartProducts } = get();
                return cartProducts.reduce(
                    (sum, product) => sum + product.price * product.quantity,
                    0
                );
            },

            getSelectedSubtotal: () => {
                const { cartProducts, selectedProducts } = get();
                return cartProducts
                    .filter((p) => selectedProducts.has(p.id))
                    .reduce((sum, product) => sum + product.price * product.quantity, 0);
            },

            getShipping: () => {
                const { freeShippingThreshold, shippingFee } = get();
                const subtotal = get().getSubtotal();
                return subtotal >= freeShippingThreshold ? 0 : shippingFee;
            },

            getTotal: () => {
                const subtotal = get().getSubtotal();
                const shipping = get().getShipping();
                return subtotal + shipping;
            },

            getSelectedTotal: () => {
                const { freeShippingThreshold, shippingFee } = get();
                const selectedSubtotal = get().getSelectedSubtotal();
                const selectedShipping = selectedSubtotal >= freeShippingThreshold ? 0 : shippingFee;
                return selectedSubtotal + selectedShipping;
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

            // 상품 제거
            handleRemoveProduct: (id) => {
                const { cartProducts, selectedProducts } = get();
                const newSelected = new Set(selectedProducts);
                newSelected.delete(id);
                
                set({
                    cartProducts: cartProducts.filter((product) => product.id !== id),
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
                
                if (window.confirm(`선택한 ${selectedProducts.size}개 상품을 삭제하시겠습니까?`)) {
                    set({
                        cartProducts: cartProducts.filter((product) => !selectedProducts.has(product.id)),
                        selectedProducts: new Set(),
                    });
                }
            },

            // 수량 증가
            handleIncreaseQuantity: (id) => {
                const { cartProducts } = get();
                set({
                    cartProducts: cartProducts.map((product) =>
                        product.id === id
                            ? { ...product, quantity: product.quantity + 1 }
                            : product
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

            // 전체 상품 주문
            handleOrderAll: () => {
                const { cartProducts } = get();
                
                if (cartProducts.length === 0) {
                    alert("장바구니에 상품이 없습니다.");
                    return;
                }
                
                set({ isOrderComplete: true });
                setTimeout(() => {
                    alert(`전체 ${cartProducts.length}개 상품 주문이 완료되었습니다!`);
                }, 100);
            },

            // 선택 상품 주문
            handleOrderSelected: () => {
                const { selectedProducts } = get();
                
                if (selectedProducts.size === 0) {
                    alert("주문할 상품을 선택해주세요.");
                    return;
                }
                
                set({ isOrderComplete: true });
                setTimeout(() => {
                    alert(`선택한 ${selectedProducts.size}개 상품만 주문하시겠습니까?`);
                }, 100);
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