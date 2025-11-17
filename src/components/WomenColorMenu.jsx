import React from 'react';
import './scss/WomenColorMenu.scss';

export default function WomenColorMenu() {
    const colors = [
        { name: '블랙', class: 'black' },
        { name: '그레이', class: 'gray' },
        { name: '화이트', class: 'white' },
        { name: '빨강', class: 'red' },
        { name: '핑크', class: 'pink' },
        { name: '브라운', class: 'brown' },
        { name: '주황', class: 'orange' },
        { name: '보라', class: 'purple' },
        { name: '노랑', class: 'yellow' },
        { name: '민트', class: 'mint' },
        { name: '연두', class: 'light-green' },
        { name: '녹색', class: 'green' },
        { name: '하늘', class: 'sky-blue' },
        { name: '파랑', class: 'blue' },
        { name: '네이비', class: 'navy' }
    ];

    return (
        <div className="color-menu">
            <div className="color-menu__wrap menu_wrap-style">
                <div className="color-menu__wrap--title_wrap title--wrap">
                    <h3 className="color-menu__wrap--title title">색상</h3>
                    <a href="#" className="color-menu--title__toggle title--toggle">
                        <button>
                            <img src="/images/Sub_Women_Images/icon-minus.svg" alt="줄이기/더보기 버튼" />
                        </button>
                    </a>
                </div>
                <ul className="select__color--wrap">
                    {colors.map((color) => (
                        <li key={color.class} className="select__color--wrap_list">
                            <a href="#" className="select__color--link">
                                <p className={`color_select ${color.class}`}></p>
                                <p className="color_select-text">{color.name}</p>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
