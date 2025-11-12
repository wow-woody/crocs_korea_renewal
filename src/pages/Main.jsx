import React from 'react';
import JibbitzCollaboSwiper from '../components/JibbitzCollaboSwiper';
import Join from './Join';
import { Link } from 'react-router-dom';
import MainSlider from '../components/MainSlider';
import TopPopup from '../components/TopPopup';
import Monthly from '../components/Monthly';

const Main = () => {
    return (
        <main>
            <div className="container">
                <Link to="/join">join</Link>
                <JibbitzCollaboSwiper />
            </div>
            <MainSlider />
            <TopPopup />
            <div className="container">
                <Monthly />
            </div>
        </main>
    );
};

export default Main;
