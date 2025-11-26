import React from 'react';

const PriceMenu = () => {
    const priceRanges = [
        '0 ~ 20,000',
        '20,000 ~ 40,000',
        '40,000 ~ 60,000',
        '60,000 ~ 80,000',
        '80,000 ~ 100,000',
        '100,000 ~'
    ];

    return (
        <div className="price-menu">
            <div className="price-menu__wrap menu_wrap-style">
                <div className="price-menu__wrap--title_wrap title--wrap">
                    <h3 className="price-menu__wrap--title title">가격</h3>
                    <a href="#" className="price-menu--title__toggle title--toggle">
                        <button>
                            <img src="/images/Sub_Women_Images/icon-minus.svg" alt="줄이기/더보기 버튼" />
                        </button>
                    </a>
                </div>
                <ul className="price-menu__wrap price-menu__wrap--price-range">
                    {priceRanges.map((price, index) => (
                        <li key={index} className="price-menu__item">
                            <a href="#" className="price-menu__link btn-menu-style">
                                <button className="price-menu__button btn-menu__button">{price}</button>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PriceMenu;
