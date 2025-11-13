import React from 'react';
import MonthlyCardList from './MonthlyCardList';

const MonthlyRight = ({ isActive }) => {
    return (
        <div className={`monthly_right${isActive ? ' active' : ''}`}>
            <div className="monthly_card_wrap">
                <MonthlyCardList />
            </div>
        </div>
    );
};

export default MonthlyRight;
