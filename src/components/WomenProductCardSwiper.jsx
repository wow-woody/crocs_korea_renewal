import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './scss/WomenProductCardSwiper.scss';

export default function WomenProductCardSwiper({ images = [] }) {
    const swiperRef = useRef(null);
    const swiperInstanceRef = useRef(null);

    useEffect(() => {
        if (swiperRef.current && !swiperInstanceRef.current) {
            swiperInstanceRef.current = new Swiper(swiperRef.current, {
                modules: [Navigation, Pagination],
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    type: 'progressbar',
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        }

        return () => {
            if (swiperInstanceRef.current) {
                swiperInstanceRef.current.destroy(true, true);
                swiperInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div className="product-card__img_wrap swiper" ref={swiperRef}>
            <div className="swiper-wrapper">
                {images.map((image, index) => (
                    <div className="swiper-slide" key={index}>
                        <a href="#" className="product-card__link">
                            <img 
                                src={image.src} 
                                alt={image.alt || `상품 이미지 ${index + 1}`} 
                                className="product-card__img" 
                            />
                        </a>
                    </div>
                ))}
            </div>
            <div className="swiper-button-prev product-card__arrow_left"></div>
            <div className="swiper-button-next product-card__arrow_right"></div>
            <div className="swiper-pagination product-card__pagination"></div>
        </div>
    );
}
