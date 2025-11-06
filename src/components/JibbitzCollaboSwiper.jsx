import React from 'react';
import { collaboAuthStore } from '../store/authStore';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import { Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import JibbitzProductCard from './JibbitzProductCard';

const JibbitzCollaboSwiper = () => {
    const { disneyItems } = collaboAuthStore();
    return (
        <div>
            <Swiper
                modules={[Navigation, Scrollbar]}
                navigation
                scrollbar
                spaceBetween={40}
                slidesPerView={3}
            >
                {disneyItems.map((item) => (
                    <SwiperSlide>
                        <Link>
                            <JibbitzProductCard sendItem={item} />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default JibbitzCollaboSwiper;
