<<<<<<< HEAD
import React from 'react';
import LeftNavigation from '../components/LeftNavigation';
import ProductList from '../components/ProductList';
import './scss/Women.scss';

const Women = () => {
    const products = [
        {
            id: 1,
            name: '클래식 언퍼게터블 스웨이드\n클로그',
            images: [
                {
                    src: '/images/Sub_Women_Images/1_클래식_언퍼게터블_스웨이드_클로그_1.jpg',
                    alt: '클래식 언퍼게터블 스웨이드 클로그 이미지 1',
                },
                {
                    src: '/images/Sub_Women_Images/1_클래식_언퍼게터블_스웨이드_클로그_2.jpg',
                    alt: '클래식 언퍼게터블 스웨이드 클로그 이미지 2',
                },
            ],
            price: { discountedPrice: 55900, discountRate: 20, originalPrice: 69900 },
            colors: ['black', 'brown', 'navy', 'pink'],
            sizes: [
                '210',
                '220',
                '230',
                '240',
                '250',
                '260',
                '265',
                '270',
                '280',
                '290',
                '300',
                '310',
            ],
            soldOutSizes: [],
        },
    ];

    const sizes = [
        '210',
        '220',
        '230',
        '240',
        '250',
        '260',
        '265',
        '270',
        '280',
        '290',
        '300',
        '310',
    ];
    const filters = [
        { color: 'pink', class: 'select-pink' },
        { color: 'black', class: 'select-black' },
    ];

    return (
        <main>
            <div className="section__wrap">
                <LeftNavigation
                    category="여성"
                    subcategory="털안감 라인드 클로그"
                    sizes={sizes}
                    filters={filters}
                />
                <ProductList products={products} />
            </div>
        </main>
=======
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
<<<<<<< HEAD
                <div className="left_nav">
                    <SizeMenu />
                    <div className="breadcrumbs__line"></div>
                    <FilterMenu />
                    <div className="breadcrumbs__line"></div>
                    <ColorMenu />
                    <div className="breadcrumbs__line"></div>
                    <PriceMenu />
                </div>
            </section>
            <section className="product-card__section_wrap">
                <div className="product-card__wrap">
                    <ul className="product-card__item_list">
                        <li className="product-card">
                            <div className="product-card__img_info_wrap">
                                <div className="product-card__img_wrap">
                                    <a href="#" className="product-card__link">
                                        <img src="/images/Sub_Women_Images/1_클래식_언퍼게터블_스웨이드_클로그_1.jpg" alt="상품 이미지" className="product-card__img" />
                                        <img src="/images/Sub_Women_Images/1_클래식_언퍼게터블_스웨이드_클로그_2.jpg" alt="상품 이미지" className="product-card__img" />
                                    </a>
                                    <div className="product-card_arrow">
                                        <a href="#" className="product-card__arrow_left_link">
                                            <img src="/images/Sub_Women_Images/icon-arrow-left-green.svg" alt="왼쪽 버튼" className="icon__arrow_left" />
                                        </a>
                                        <a href="#" className="product-card__arrow_right_link">
                                            <img src="/images/Sub_Women_Images/icon-arrow-right-green.svg" alt="오른쪽 버튼" className="icon__arrow_right" />
                                        </a>
                                    </div>
                                </div>
                                <div className="product-card__name--warp">
                                    <p className="product-card__name">클래식 언퍼게터블 스웨이드<br />클로그</p>
                                </div>
                                <div className="product-card__price_wrap">
                                    <div className="product-card__price">
                                        <span className="product-card__price_dc_rate">55,900</span>
                                        <span className="product-card__price_breadcrumbs__line"></span>
                                        <span className="product-card__price_slel">20%</span>
                                        <span className="product-card__price_breadcrumbs__line"></span>
                                        <span className="product-card__price_cost">69,900</span>
                                    </div>
                                </div>
                                <div className="product-card__color">
                                    <div className="product-card__color__title--wrap">
                                        <p className="product-card__color__title">색상</p>
                                    </div>
                                    <div className="color-badge__wrap">
                                        <span className="color-badge black"></span>
                                        <span className="color-badge brown"></span>
                                        <span className="color-badge navy"></span>
                                        <span className="color-badge pink"></span>
                                    </div>
                                </div>
                                <div className="product-card__size">
                                    <div className="product-card__size__title--wrap">
                                        <p className="product-card__size--title">사이즈</p>
                                    </div>
                                    <ul className="product-card__size--btns__wrap size-menu__wrap--size">
                                        {['210', '220', '230', '240', '250', '260', '265', '270', '280', '290', '300', '310'].map((size) => (
                                            <li key={size} className="size--btns__item">
                                                <a href="#" className="size--btns__link btn-menu-style">
                                                    <button className="size--btns__button btn-menu__button">{size}</button>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
>>>>>>> 82841dc (2025-11-16(일) 컴포넌트 - v01)
=======
                <WomenProductList products={products} />
            </div>
        </main>
>>>>>>> 680e991 (2025-11-17(월) 스와이퍼 적용 완료 - v02)
    );
};

export default Women;
