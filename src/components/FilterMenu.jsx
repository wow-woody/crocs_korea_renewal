import React from 'react';
import './scss/WomenComponents.scss';

export default function FilterMenu({
    filters = [
        { color: 'pink', class: 'select-pink' },
        { color: 'black', class: 'select-black' },
    ],
}) {
    return (
        <div className="filter-menu">
            <div className="filter-menu__wrap menu_wrap-style">
                <div className="filter-menu__wrap--title_wrap title--wrap">
                    <h3 className="filter-menu__wrap--title title">필터</h3>
                    <a href="#" className="filter-menu--title__toggle title--toggle">
                        <button>
                            <img src="/images/Sub_Women_Images/icon-minus.svg" alt="" />
                        </button>
                    </a>
                </div>
                <ul className="filter-menu__wrap filter-menu__wrap--color">
                    {filters.map((filter, index) => (
                        <li key={index} className="filter-menu__item">
                            <div className={`filter-menu__select_color ${filter.class}`}></div>
                            <a href="#" className="filter-menu__close-link">
                                <img
                                    src="/images/Sub_Women_Images/icon-close_cross.svg"
                                    alt="필터 닫기 버튼"
                                    className="close-btn"
                                />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
