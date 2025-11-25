import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecentProductsStore = create(
  persist(
    (set, get) => ({
      // 상태
      recentProducts: [],

      // 상품 추가 (최근 본 상품에 추가)
      addProduct: (product) => {
        set((state) => {
          const exists = state.recentProducts.find(p => p.id === product.id);
          
          if (exists) {
            // 이미 있는 상품이면 맨 앞으로 이동하고 시간 업데이트
            return {
              recentProducts: [
                { ...product, viewedAt: new Date().toISOString() },
                ...state.recentProducts.filter(p => p.id !== product.id)
              ]
            };
          } else {
            // 새 상품이면 맨 앞에 추가 (최대 50개까지만 저장)
            return {
              recentProducts: [
                { ...product, viewedAt: new Date().toISOString() },
                ...state.recentProducts
              ].slice(0, 50)
            };
          }
        });
      },

      // 상품 삭제
      removeProduct: (productId) => {
        set((state) => ({
          recentProducts: state.recentProducts.filter(p => p.id !== productId)
        }));
      },

      // 전체 삭제
      clearAll: () => {
        set({ recentProducts: [] });
      },

      // 특정 상품 조회 시간 업데이트
      updateViewedTime: (productId) => {
        set((state) => ({
          recentProducts: state.recentProducts.map(p =>
            p.id === productId
              ? { ...p, viewedAt: new Date().toISOString() }
              : p
          )
        }));
      },

      // 오래된 상품 자동 삭제 (30일 이상)
      removeOldProducts: () => {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        set((state) => ({
          recentProducts: state.recentProducts.filter(p => 
            new Date(p.viewedAt).getTime() > thirtyDaysAgo
          )
        }));
      },

      // 최근 본 상품 개수 조회
      getProductCount: () => {
        return get().recentProducts.length;
      }
    }),
    {
      name: 'recent-products-storage',
      version: 1
    }
  )
);