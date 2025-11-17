import React from 'react';
import './scss/WomenSizeMenu.scss';

export default function WomenSizeMenu({ sizes = ['210', '220', '230', '240', '250', '260', '265', '270', '280', '290', '300', '310'] }) {
    return (
        <div className="size-menu">
            <div className="size-menu__wrap">
                <div className="size-menu__wrap--title_wrap title--wrap">
                    <h3 className="size-menu__wrap--title title">사이즈</h3>
                    <a href="#" className="size-menu--title__toggle title--toggle">
                        <button>
                            <img src="/images/Sub_Women_Images/icon-minus.svg" alt="줄이기/더보기 버튼" />
                        </button>
                    </a>
                </div>
                <ul className="size-menu__wrap size-menu__wrap--size">
                    {sizes.map((size) => (
                        <li key={size} className="size-menu__item">
                            <a href="#" className="size-menu__link btn-menu-style">
                                <button className="size-menu__button btn-menu__button">{size}</button>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
