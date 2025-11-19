import React from 'react';
<<<<<<< HEAD:src/components/WomenFilterMenu.jsx
<<<<<<< HEAD:src/components/FilterMenu.jsx
<<<<<<< HEAD
import './scss/WomenComponents.scss';

export default function FilterMenu({
    filters = [
        { color: 'pink', class: 'select-pink' },
        { color: 'black', class: 'select-black' },
    ],
}) {
=======

const FilterMenu = ({ filters = [{ color: 'pink', class: 'select-pink' }, { color: 'black', class: 'select-black' }] }) => {
>>>>>>> 82841dc (2025-11-16(일) 컴포넌트 - v01)
=======
import './scss/WomenFilterMenu.scss';
=======
import './scss/WomenComponents.scss';
>>>>>>> a61aa1d (2025-11-19(수) 여성 페이지 파일명 변경 및 scss 파일 한개의 파일로 통합 -  v01):src/components/FilterMenu.jsx

export default function WomenFilterMenu({ filters = [{ color: 'pink', class: 'select-pink' }, { color: 'black', class: 'select-black' }] }) {
>>>>>>> 680e991 (2025-11-17(월) 스와이퍼 적용 완료 - v02):src/components/WomenFilterMenu.jsx
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
<<<<<<< HEAD
                                <img
                                    src="/images/Sub_Women_Images/icon-close_cross.svg"
                                    alt="필터 닫기 버튼"
                                    className="close-btn"
                                />
=======
                                <img src="/images/Sub_Women_Images/icon-close_cross.svg" alt="필터 닫기 버튼" className="close-btn" />
>>>>>>> 82841dc (2025-11-16(일) 컴포넌트 - v01)
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
<<<<<<< HEAD:src/components/FilterMenu.jsx
<<<<<<< HEAD
}
=======
};

export default FilterMenu;
>>>>>>> 82841dc (2025-11-16(일) 컴포넌트 - v01)
=======
}
>>>>>>> 680e991 (2025-11-17(월) 스와이퍼 적용 완료 - v02):src/components/WomenFilterMenu.jsx
