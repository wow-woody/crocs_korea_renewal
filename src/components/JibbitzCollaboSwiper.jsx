import React from 'react';
import { collaboAuthStore } from '../store/authStore';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import { EffectCoverflow, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import JibbitzProductCard from './JibbitzProductCard';
import 'swiper/css';
import './scss/jibbitzcollaboswiper.scss';
import Title from './Title';

const JibbitzCollaboSwiper = () => {
    const { disneyItems } = collaboAuthStore();
    return (
        <section className="jibbitz_wrap">
            <div className="inner">
                <Title
                    title={`COLLABO <br/> Jibbitz`}
                    subTitle="당신의 스타일에 맞는 완벽한 크록스를 찾아보세요"
                />
                <div className="collabo-wrap">
                    <Swiper
                        modules={[Navigation, Scrollbar, Pagination]}
                        pagination
                        navigation={{
                            prevEl: '.swiper-button-prev', // ← 이걸 이전 버튼으로 써!
                            nextEl: '.swiper-button-next', // ← 이걸 다음 버튼으로 써!
                        }}
                        scrollbar
                        grabCursor={true}
                        spaceBetween={50}
                        slidesPerView={2.5}
                        centeredSlides={true}
                        loop={true}
                        className="MySwiper"
                    >
                        {disneyItems.map((item) => (
                            <SwiperSlide>
                                <Link>
                                    <JibbitzProductCard sendItem={item} />
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="swiper-button-prev"></div>
                    <div className="swiper-button-next"></div>
                </div>
            </div>
        </section>
    );
};

export default JibbitzCollaboSwiper;
