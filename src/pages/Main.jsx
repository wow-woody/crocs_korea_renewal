import React from 'react';
import MainSlider from '../components/MainSlider';
import TopPopup from '../components/TopPopup';

const Main = () => {
    return (
        <main>
            <MainSlider />
            <TopPopup />
            <div className="container"></div>
        </main>
    );
};

export default Main;
