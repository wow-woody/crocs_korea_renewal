import React, { useEffect } from 'react';
import { collaboAuthStore } from '../store/collaboAuthStore';
import './scss/WomenComponents.scss';

const JibbitzFilterMenu = () => {
    // const { disneyItems } = collaboAuthStore();
    const { disneyItems, jibbitzFilterList, onFetchJibbitz } = collaboAuthStore();

    // 상품 불러오기
    useEffect(() => {
        onFetchJibbitz();
    }, []);

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
                    {/* {jibbitzFilterList.map((filter, id) => (
                        <li key={id} className="filter-menu__item filter_list_menu">
                            <a href="#" className="filter-menu__close-link">
                                {filter}
                                <img
                                    src="/images/Sub_Women_Images/icon-close_cross.svg"
                                    alt="필터 닫기 버튼"
                                    className="close-btn"
                                />
                            </a>
                        </li>
                    ))} */}
                </ul>
            </div>
        </div>
    );
};

export default JibbitzFilterMenu;
