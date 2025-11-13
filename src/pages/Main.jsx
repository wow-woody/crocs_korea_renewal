import React from 'react';
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

const Main = () => {
    return (
        <main>
            <MainSlider />
            <TopPopup />
            <div className="container">
                <MainCategory />
                <SlideCircle />
                <JibbitzCollaboSwiper />
                <CrocsSection />
                <Monthly />
                <MainInstagram />
            </div>
        </main>
    );
};

export default Main;
