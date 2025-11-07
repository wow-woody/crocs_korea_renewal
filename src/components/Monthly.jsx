import React from 'react';
import MonthlyLEft from './MonthlyLEft';
import MonthlyRight from './MonthlyRight';
import './scss/monthly.scss';

const Monthly = () => {
    return (
        <section className="monthly_wrap">
            <div className="inner">
                <MonthlyLEft />
                <MonthlyRight />
            </div>
        </section>
    );
};

export default Monthly;
