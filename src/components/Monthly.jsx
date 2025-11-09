import React, { useState } from 'react';
import MonthlyLeft from './MonthlyLeft';
import MonthlyRight from './MonthlyRight';
import ButtonWrap from './ButtonWrap';
import './scss/monthly.scss';

const Monthly = () => {
    const [isActive, setIsActive] = useState(false);

    const toggleSlide = () => {
        setIsActive((prev) => !prev);
    };

    return (
        <section className="monthly_wrap">
            <div className="inner">
                <MonthlyLeft />
                <ButtonWrap onClick={toggleSlide} />
                <MonthlyRight isActive={isActive} />
            </div>
        </section>
    );
};

export default Monthly;
