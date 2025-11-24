import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecentProductsStore = create(
  persist(
    (set, get) => ({
      // 상태
      recentProducts: [
        {
          id: 1,
          name: '프리미엄 무선 이어폰',
          category: '전자제품',
          price: 189000,
          discount: 15,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
          viewedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
          rating: 4.8,
          reviewCount: 1247
        },
        {
          id: 2,
          name: '스마트 워치 7세대',
          category: '웨어러블',
          price: 450000,
          discount: 20,
          image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
          viewedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
          rating: 4.9,
          reviewCount: 856
        },
        {
          id: 3,
          name: '노트북 스탠드 알루미늄',
          category: '액세서리',
          price: 35000,
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
          viewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전
          rating: 4.6,
          reviewCount: 432
        },
        {
          id: 4,
          name: '기계식 키보드 RGB',
          category: '컴퓨터 주변기기',
          price: 129000,
          discount: 10,
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
          viewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3일 전
          rating: 4.7,
          reviewCount: 623
        }
      ],

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