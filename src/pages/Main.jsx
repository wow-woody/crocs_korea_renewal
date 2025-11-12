import React from 'react';
import JibbitzCollaboSwiper from '../components/JibbitzCollaboSwiper';
import Join from './Join';
import { Link } from 'react-router-dom';

const Main = () => {
    return (
        <main>
            <div className="container">
                <Link to="/join">join</Link>
                <JibbitzCollaboSwiper />
            </div>
        </main>
    );
};

export default Main;
