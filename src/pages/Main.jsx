import React from 'react';
<<<<<<< HEAD
import MainSlider from '../components/MainSlider';
import TopPopup from '../components/TopPopup';
import Monthly from '../components/Monthly';
=======
import JibbitzCollaboSwiper from '../components/JibbitzCollaboSwiper';
// import Join from './Join';
// import { Link } from 'react-router-dom';
import MainSlider from '../components/MainSlider';
import TopPopup from '../components/TopPopup';
import Monthly from '../components/Monthly';
import MainCategory from '../components/MainCategory';
import MainInstagram from '../components/MainInstagram';
import SlideCircle from '../components/SlideCircle';
import CrocsSection from '../components/CrocsSectionFinal';
>>>>>>> 7e8c2c77746530933c16fbb40c876986979575d2

const Main = () => {
    return (
        <main>
            <MainSlider />
            <TopPopup />
            <div className="container">
<<<<<<< HEAD
                <Monthly />
=======
                <MainCategory />
                <SlideCircle />
                <JibbitzCollaboSwiper />
                <CrocsSection />
                <Monthly />
                <MainInstagram />
>>>>>>> 7e8c2c77746530933c16fbb40c876986979575d2
            </div>
        </main>
    );
};

export default Main;
