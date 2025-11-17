import React, { useEffect } from 'react';
import WomenLeftNavigation from '../components/WomenLeftNavigation';
import WomenProductList from '../components/WomenProductList';
import './scss/Women.scss';

const Women = () => {
    const products = [
        {
            id: 1,
            name: '클래식 언퍼게터블 스웨이드\n클로그',
            images: [
                {
                    src: '/images/Sub_Women_Images/1_클래식_언퍼게터블_스웨이드_클로그_1.jpg',
                    alt: '클래식 언퍼게터블 스웨이드 클로그 이미지 1'
                },
                {
                    src: '/images/Sub_Women_Images/1_클래식_언퍼게터블_스웨이드_클로그_2.jpg',
                    alt: '클래식 언퍼게터블 스웨이드 클로그 이미지 2'
                }
            ],
            price: {
                discountedPrice: 55900,
                discountRate: 20,
                originalPrice: 69900
            },
            colors: ['black', 'brown', 'navy', 'pink'],
            sizes: ['210', '220', '230', '240', '250', '260', '265', '270', '280', '290', '300', '310'],
            soldOutSizes: []
        }
    ];

    const sizes = ['210', '220', '230', '240', '250', '260', '265', '270', '280', '290', '300', '310'];
    const filters = [
        { color: 'pink', class: 'select-pink' },
        { color: 'black', class: 'select-black' }
    ];

    useEffect(() => {
        // 버튼 메뉴 스타일 클릭 이벤트 핸들러
        const handleButtonClick = (e) => {
            e.preventDefault();
            e.currentTarget.classList.toggle('active');
        };

        // 모든 .btn-menu-style 요소에 이벤트 리스너 추가
        const buttons = document.querySelectorAll('.btn-menu-style');
        buttons.forEach(btn => {
            btn.addEventListener('click', handleButtonClick);
        });

        // 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            buttons.forEach(btn => {
                btn.removeEventListener('click', handleButtonClick);
            });
        };
    }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

    return (
        <main>
            <div className="section__wrap">
                <WomenLeftNavigation 
                    category="여성"
                    subcategory="털안감 라인드 클로그"
                    sizes={sizes}
                    filters={filters}
                />
                <WomenProductList products={products} />
            </div>
        </main>
    );
};

export default Women;
